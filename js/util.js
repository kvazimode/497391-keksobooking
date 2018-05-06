'use strict';

window.util = (function () {
  var formNode = document.querySelector('.ad-form');
  var mapNode = document.querySelector('.map');
  return {
    MAIN_PIN_HEIGHT: 84,
    MAIN_PIN_WIDTH: 62,
    filterNode: document.querySelector('.map__filters-container'),
    mapNode: mapNode,
    template: document.querySelector('template').content,
    pinMain: document.querySelector('.map__pin--main'),
    formNode: formNode,
    formFieldList: formNode.querySelectorAll('fieldset'),
    formFieldAddress: formNode.querySelector('#address'),
    getRandomInt: function (min, max) {
      var random = min - 0.5 + Math.random() * (max - min + 1);
      random = Math.round(random);
      return random;
    },
    getRandomParam: function (params) {
      var param = params[window.util.getRandomInt(0, params.length - 1)];
      return param;
    },
    generateShuffledArray: function (arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
      return arr;
    },
    generateShuffledIntArray: function (amount) {
      var shuffled = [];
      for (var i = 0; i <= amount - 1; i++) {
        shuffled.push(i);
      }
      shuffled = this.generateShuffledArray(shuffled);
      return shuffled;
    },
    setFormActive: function (active) {
      for (var i = 0; i < this.formFieldList.length; i++) {
        this.formFieldList[i].disabled = !active;
      }
      if (!active) {
        formNode.classList.add('ad-form--disabled');
      } else {
        formNode.classList.remove('ad-form--disabled');
      }
    },
    writePinAddress: function () {
      var left = parseInt(window.util.pinMain.style.left, 10);
      var top = parseInt(window.util.pinMain.style.top, 10);
      window.util.formFieldAddress.value = (left + window.util.MAIN_PIN_WIDTH / 2) + ', ' + (top + window.util.MAIN_PIN_HEIGHT);
    },
    removePins: function () {
      var pin = window.util.pinMain.nextElementSibling;
      while (pin) {
        pin.remove();
        pin = window.util.pinMain.nextElementSibling;
      }
    }
  };
})();
