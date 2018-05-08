'use strict';

(function () {
  var findCard = function (alt) {
    var data = window.data.getData();
    for (var i = 0; i < data.length; i++) {
      if (data[i].offer.title === alt) {
        return data[i];
      }
    }
    return null;
  };
  var pinTemplate = window.util.template.querySelector('.map__pin');
  var pinClickHandler = function (evt) {
    var clickedPin = evt.currentTarget;
    var pinAlt = clickedPin.firstElementChild.alt;
    var card = findCard(pinAlt);
    window.util.removeCardPopup();
    window.appendCardElement(card);
  };
  window.makePinElement = function (item) {
    var pin = pinTemplate.cloneNode(true);
    pin.style = 'left: ' +
      (item.location.x - 25) +
      'px; top: ' +
      (item.location.y - 70) +
      'px;';
    pin.querySelector('img').src = item.author.avatar;
    pin.querySelector('img').alt = item.offer.title;
    pin.addEventListener('click', pinClickHandler, true);
    return pin;
  };
})();
