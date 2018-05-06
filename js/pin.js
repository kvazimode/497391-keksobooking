'use strict';

(function () {
  var findCard = function (alt) {
    var card = {};
    for (var i = 0; i < window.data.serverData.length; i++) {
      if (window.data.serverData[i].offer.title === alt) {
        card = window.data.serverData[i];
      }
    }
    return card;
  };
  var pinTemplate = window.util.template.querySelector('.map__pin');
  var pinClickHandler = function (evt) {
    var clickedPin = evt.currentTarget;
    var pinAlt = clickedPin.firstElementChild.alt;
    var card = findCard(pinAlt);
    window.cardPopup = window.util.mapNode.querySelector('.popup');
    if (window.cardPopup) {
      window.cardPopup.remove();
    }
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
