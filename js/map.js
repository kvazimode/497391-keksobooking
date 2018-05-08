'use strict';

(function () {
  var MAP_WIDTH = 1200;
  var MAP_HEIGHT = {
    min: 150,
    max: 500
  };

  window.mainPin = (function () {
    var _firstTimeMouseUp = true;
    var _pinNode = document.querySelector('.map__pin--main');
    var _mouseCoord = {x: 0, y: 0};
    var _pinCoord = {
      x: _pinNode.offsetLeft,
      y: _pinNode.offsetTop
    };
    return {
      pinNode: _pinNode,
      setPinCoord: function (x, y) {
        _pinCoord.x = x;
        _pinCoord.y = y;
      },
      getPinCoord: function (axis) {
        return _pinCoord[axis];
      },
      setFirstTimeMouseUp: function (firstTime) {
        _firstTimeMouseUp = firstTime;
      },
      init: function () {
        window.mainPin.pinNode.addEventListener('mousedown', function (evt) {
          _mouseCoord.x = evt.clientX;
          _mouseCoord.y = evt.clientY;

          var mouseMoveHandler = function (moveEvt) {
            moveEvt.preventDefault();
            var distance = {
              x: _mouseCoord.x - moveEvt.clientX,
              y: _mouseCoord.y - moveEvt.clientY
            };
            var newY = _pinNode.offsetTop - distance.y;
            var newX = _pinNode.offsetLeft - distance.x;
            if (newX < (MAP_WIDTH - window.util.MAIN_PIN_WIDTH) && newX > 0) {
              _pinNode.style.left = (newX) + 'px';
              _mouseCoord.x = moveEvt.clientX;
              _pinCoord.x = newX;
            }
            if (newY <= (MAP_HEIGHT.max - window.util.MAIN_PIN_HEIGHT) && newY >= (MAP_HEIGHT.min - window.util.MAIN_PIN_HEIGHT)) {
              _pinNode.style.top = (newY) + 'px';
              _mouseCoord.y = moveEvt.clientY;
              _pinCoord.y = newY;
            }
          };

          var mouseUpHandler = function () {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            window.util.writePinAddress();
            if (_firstTimeMouseUp) {
              window.util.mapNode.classList.remove('map--faded');
              window.data.loadData();
              window.util.setFormActive(true);
              window.mainPin.setFirstTimeMouseUp(false);
            }
          };
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler);
        });
        window.util.writePinAddress();
      }
    };
  })();

  window.util.setFormActive(false);
  window.mainPin.init();
  window.appendCardElement = function (item) {
    window.util.mapNode.insertBefore(window.makeCardElement(item), window.util.filterNode);
    window.util.setCardPopup(window.util.mapNode.querySelector('.popup'));
  };
})();
