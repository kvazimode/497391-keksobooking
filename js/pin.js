'use strict';

(function () {
  var pinTemplate = window.util.template.querySelector('.map__pin');
  window.makePinElement = function (item) {
    var pin = pinTemplate.cloneNode(true);
    pin.style = 'left: '
      + (item.location.x - 25)
      + 'px; top: '
      + (item.location.y - 70)
      + 'px;';
    pin.querySelector('img').src = item.author.avatar;
    pin.querySelector('img').alt = item.offer.title;
    pin.addEventListener('click', window.pinClickHandler, true);
    return pin;
  };
})();
