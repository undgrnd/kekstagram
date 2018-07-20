'use strict';

(function () {
  var ESC_KEYCODE = 27;
  window.utils = {
    isEscPress: function (evt) {
      return evt.keyCode === ESC_KEYCODE;
    },
    getRandomNumber: function (min, max) {
      return Math.floor((Math.random() * max) + min);
    },
    getRandomElement: function (array) {
      return array[window.utils.getRandomNumber(0, array.length)];
    },
    shuffleArray: function (array) {
      var newArray = array.slice();
      return newArray.sort(function () {
        return 0.5 - Math.random();
      });
    },
    toggleClassInLine: function (element, neighbors, className) {
      neighbors.forEach(function (item) {
        item.classList.remove(className);
      });
      element.classList.add(className);
    },
    arrayToLowerCase: function (array) {
      var newArray = [];
      for (var i = 0; i < array.length; i++) {
        newArray[i] = array[i].toLowerCase();
      }
      return newArray;
    },
    removeDuplicatesFromArray: function (arrArg) {
      return arrArg.filter(function (elem, pos, arr) {
        return arr.indexOf(elem) === pos;
      });
    }
  };
})();
