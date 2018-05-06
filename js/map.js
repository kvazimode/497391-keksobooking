'use strict';

(function () {
  var MAP_WIDTH = 1200;

  var pinsNode = document.querySelector('.map__pins');
  window.firstPinMouseUp = true;
  window.util.setFormActive(false);
  window.util.writePinAddress();

  // потаскивание главного пина
  window.util.pinMain.addEventListener('mousedown', function (evt) {
    var startPoint = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      var distance = {
        x: startPoint.x - moveEvt.clientX,
        y: startPoint.y - moveEvt.clientY
      };
      startPoint = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var newY = window.util.pinMain.offsetTop - distance.y;
      var newX = window.util.pinMain.offsetLeft - distance.x;
      if (newY < 500 + window.util.MAIN_PIN_HEIGHT && newY > 150) {
        window.util.pinMain.style.top = (newY) + 'px';
      }
      if (newX < (MAP_WIDTH - window.util.MAIN_PIN_WIDTH) && newX > 0) {
        window.util.pinMain.style.left = (newX) + 'px';
      }
    };

    var mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      window.util.writePinAddress();
      if (window.firstPinMouseUp) {
        window.util.mapNode.classList.remove('map--faded');
        window.appendMapPins(window.data.serverData);
        window.util.setFormActive(true);
        window.firstPinMouseUp = false;
      }
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  // создание пинов и карточки
  window.appendMapPins = function (itemList) {
    var arr = window.util.generateShuffledIntArray(itemList.length);
    for (var i = 0; i < 5 && i < itemList.length; i++) {
      pinsNode.appendChild(window.makePinElement(itemList[arr[i]]));
    }
  };
  window.appendCardElement = function (item) {
    window.util.mapNode.insertBefore(window.makeCardElement(item), window.util.filterNode);
  };

})();
