function quittingTime(mount) {
  'use strict';

  return (function (m, moment, dom, undefined) {
    function nextFriday(date) {
      var input, output;
      input = moment.isMoment(date) ? date : moment(date);
      output = input.clone().startOf('week').day(5).hour(17).minute(0).second(0);
      return output > input ? output : output.add(7, 'days');
    }

    function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function sample(arr) {
      if (!Array.isArray(arr)) {
        console.error('not an array');
        return false;
      }

      return arr[randomInt(0, arr.length - 1)];
    }

    var phrases = [
      'a watched kettle never boils',
      'time flies when you\'re having fun.',
      'keep staring: I won\'t go any faster.',
      'tick tock tick tock tick tock',
      'look at those minutes fly by! wait.',
      'it\'s been the same number for a while now.',
      'time does not pass. it continues.',
      'how will you find time to do it over if you don\'t have time to do it right?',
      'the only reason for time is so that everything doesn\'t happen at once.',
      'time flies like an arrow; fruit flies like a banana.',
      'time is the longest distance between two places.',
      'time is an illusion.',
      'you may delay, but time will not.',
      'only time can heal his broken arms and legs.',
      'the strongest of all warriors are these two \u2014 Time and Patience.',
      'never waste a minute thinking about people you don\'t like.',
      'a man who dares to waste one hour of time has not discovered the value of life.'
    ];

    var Timer = (function buildTimer(moment) {
      var prototype = {
        getMinutesFromNow: function getMinutesFromNow() {
          return this.time.diff(moment(), 'minutes');
        },

        getSecondsFromNow: function getSecondsFromNow() {
          return this.time.diff(moment(), 'seconds');
        },

        isFinished: function isFinished() {
          return this.time < moment();
        }
      };

      return function Timer(time) {
        var obj = Object.create(prototype);
        obj.time = time;
        return obj;
      };
    })(moment);

    var vm = (function (m) {

      function vmInit() {
        this.endTime = Timer(nextFriday());
        this.remaining = m.prop(0);
        this.phrase = m.prop(sample(phrases));
        this.update();
      }

      function vmUpdate() {
        m.startComputation();

        this.remaining(this.endTime.getMinutesFromNow());
        if (this.endTime.isFinished()) {
          this.endTime = Timer(nextFriday());
        }

        if (randomInt(0, 9) < 1) { // Random change
          this.phrase(sample(phrases));
        }

        m.endComputation();
      }

      return {
        init: vmInit,
        update: vmUpdate
      };
    })(m);

    var view = function view() {
      return m('div.timer', [
        m('div.content', [
          m('div.remaining', 'Minutes until Friday 5pm'),
          m('div.minutes', vm.remaining()),
          m('div.note', vm.phrase())
        ]),
        m('div.credits', [
          m('span', 'for Paul, \u00A92015 BHesse')
        ])
      ]);
    };

    var controller = function controller() {
      var intervalId;
      vm.init();
      intervalId = setInterval(vm.update.bind(vm), 5000);
    };

    m.mount(dom, {controller: controller, view: view});
  })(m, moment, mount);
}