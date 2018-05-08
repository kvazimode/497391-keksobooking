'use strict';

window.util = (function () {
  var _adForm = document.querySelector('.ad-form');
  var _map = document.querySelector('.map');
  var _template = document.querySelector('template').content;
  var _filter = document.querySelector('.map__filters-container');
  var _formFieldList = _adForm.querySelectorAll('fieldset');
  var _fieldAddress = _adForm.querySelector('#address');
  var _pinsNode = document.querySelector('.map__pins');
  var _cardPopup = null;
  return {
    MAIN_PIN_HEIGHT: 84,
    MAIN_PIN_WIDTH: 62,
    filterNode: _filter,
    mapNode: _map,
    template: _template,
    formNode: _adForm,
    getCardPopup: function () {
      return _cardPopup;
    },
    setCardPopup: function (node) {
      _cardPopup = node;
    },
    removeCardPopup: function () {
      if (window.util.getCardPopup()) {
        window.util.getCardPopup().remove();
      }
      document.removeEventListener('keydown', window.cardEscPressHandler);
    },
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
    generateShuffledIntArray: function (amount, forAvatar) {
      var shuffled = [];
      var i = 0;
      if (forAvatar) { // номера аватаров начинаются с 1
        i++;
        amount++;
      }
      for (i; i <= amount - 1; i++) {
        shuffled.push(i);
      }
      shuffled = window.util.generateShuffledArray(shuffled);
      return shuffled;
    },
    setFormActive: function (active) {
      for (var i = 0; i < _formFieldList.length; i++) {
        _formFieldList[i].disabled = !active;
      }
      if (!active) {
        _adForm.classList.add('ad-form--disabled');
      } else {
        _adForm.classList.remove('ad-form--disabled');
      }
    },
    writePinAddress: function () {
      var left = parseInt(window.mainPin.getPinCoord('x'), 10);
      var top = parseInt(window.mainPin.getPinCoord('y'), 10);
      _fieldAddress.value = (left + window.util.MAIN_PIN_WIDTH / 2) + ', ' + (top + window.util.MAIN_PIN_HEIGHT);
    },
    appendMapPins: function (itemList) {
      var arr = window.util.generateShuffledIntArray(itemList.length);
      for (var i = 0; i < 5 && i < itemList.length; i++) {
        _pinsNode.appendChild(window.makePinElement(itemList[arr[i]]));
      }
    },
    removePins: function () {
      var pin = window.mainPin.pinNode.nextElementSibling;
      while (pin) {
        pin.remove();
        pin = window.mainPin.pinNode.nextElementSibling;
      }
    },
    resetPage: function () {
      _adForm.reset();
      window.util.setFormActive(false);
      window.util.mapNode.classList.add('map--faded');
      window.util.removePins();
      window.mainPin.setPinCoord(570, 375);
      window.mainPin.pinNode.style.top = window.mainPin.getPinCoord('y') + 'px';
      window.mainPin.pinNode.style.left = window.mainPin.getPinCoord('x') + 'px';
      window.mainPin.setFirstTimeMouseUp(true);
      window.util.removeCardPopup();
      window.util.writePinAddress();
      window.resetFilter();
    }
  };
})();
