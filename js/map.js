'use strict';

(function () {
  var MAIN_PIN_HEIGHT = 84;
  var MAIN_PIN_WIDTH = 62;
  var MAP_WIDTH = 1200;

  var formFieldAddress = window.util.formNode.querySelector('#address');
  var pinsNode = document.querySelector('.map__pins');
  window.mapNode = document.querySelector('.map');
  var filterNode = document.querySelector('.map__filters-container');
  var errorTemplate = window.util.template.querySelector('.error');
  window.firstPinMouseUp = true;
  window.setFormActive(false);

  // отображение ошибки
  var showError = function (err) {
    var errorMessage = errorTemplate.cloneNode(true);
    if (err) {
      errorMessage.querySelector('p').textContent = err;
    }
    errorMessage.addEventListener('click', function () {
      errorMessage.remove();
    });
    document.querySelector('main').appendChild(errorMessage);
  };

  // скачивание данных
  var writeResponseData = function (res) {
    cardObjectList = res;
  };

  var cardObjectList = null;
  window.backend.load('https://js.dump.academy/keksobooking/data', writeResponseData, showError);

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
      if (newY < 500 + MAIN_PIN_HEIGHT && newY > 150) {
        window.util.pinMain.style.top = (newY) + 'px';
      }
      if (newX < (MAP_WIDTH - MAIN_PIN_WIDTH) && newX > 0) {
        window.util.pinMain.style.left = (newX) + 'px';
      }
    };

    var mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      writePinAddress();
      if (window.firstPinMouseUp) {
        window.mapNode.classList.remove('map--faded');
        appendMapPins(cardObjectList);
        window.setFormActive(true);
        window.firstPinMouseUp = false;
      }
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  // передача координаты главной метки в поле адреса
  var writePinAddress = function () {
    var left = parseInt(window.util.pinMain.style.left, 10);
    var top = parseInt(window.util.pinMain.style.top, 10);
    formFieldAddress.value = (left + MAIN_PIN_WIDTH / 2) + ', ' + (top + MAIN_PIN_HEIGHT);
  };
  writePinAddress();

  // отображение и закрытие карточки на карте
  var findCard = function (alt) {
    var card = {};
    for (var i = 0; i < cardObjectList.length; i++) {
      if (cardObjectList[i].offer.title === alt) {
        card = cardObjectList[i];
      }
    }
    return card;
  };

  window.pinClickHandler = function (evt) {
    var clickedPin = evt.currentTarget;
    var pinAlt = clickedPin.firstElementChild.alt;
    var card = findCard(pinAlt);
    if (window.cardPopup) {
      window.removePopupCard(window.cardPopup);
    }
    appendCardElement(card);
  };

  // создание пинов и карточки
  var appendMapPins = function (itemList) {
    for (var i = 0; i < itemList.length; i++) {
      pinsNode.appendChild(window.makePinElement(itemList[i]));
    }
  };
  var appendCardElement = function (item) {
    window.mapNode.insertBefore(window.makeCardElement(item), filterNode);
  };

})();
