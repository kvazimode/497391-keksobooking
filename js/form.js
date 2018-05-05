'use strict';

(function () {
  var formFieldList = window.util.formNode.querySelectorAll('fieldset');
  var formFieldCheckIn = window.util.formNode.querySelector('#timein');
  var formFieldCheckOut = window.util.formNode.querySelector('#timeout');
  var formFieldPrice = window.util.formNode.querySelector('#price');
  var formFieldType = window.util.formNode.querySelector('#type');
  var formFieldCapacity = window.util.formNode.querySelector('#capacity');
  var formFieldRoomNumber = window.util.formNode.querySelector('#room_number');
  var formSubmitButton = window.util.formNode.querySelector('.ad-form__submit');
  var formResetButton = window.util.formNode.querySelector('.ad-form__reset');
  var successMessage = document.querySelector('.success');

  // переключение активности полей формы
  window.setFormActive = function (active) {
    for (var i = 0; i < formFieldList.length; i++) {
      formFieldList[i].disabled = !active;
    }
    if (!active) {
      window.util.formNode.classList.add('ad-form--disabled');
    } else {
      window.util.formNode.classList.remove('ad-form--disabled');
    }
  };

  // синхронизация времени заезда/выезда
  var syncArrivalDepartureTime = function (time, node) {
    if (node === formFieldCheckIn) {
      formFieldCheckIn.value = time;
    } else {
      formFieldCheckOut.value = time;
    }
  };

  formFieldCheckIn.addEventListener('change', function () {
    syncArrivalDepartureTime(formFieldCheckIn.value, formFieldCheckOut);
  });

  formFieldCheckOut.addEventListener('change', function () {
    syncArrivalDepartureTime(formFieldCheckOut.value, formFieldCheckIn);
  });

  // установка минимальной цены от типа жилья
  var setMinPriceLimit = function (room) {
    var minimum = window.TYPES_PARAM[room].minPrice;
    formFieldPrice.placeholder = minimum;
    formFieldPrice.min = minimum;
  };
  setMinPriceLimit(formFieldType.value);

  formFieldType.addEventListener('change', function () {
    setMinPriceLimit(formFieldType.value);
  });

  // проверка на соотвествие количества гостей и комнат
  var checkCapacity = function (room, guest) {
    room = parseInt(room, 10);
    guest = parseInt(guest, 10);
    if (room === 100 && guest !== 0) {
      formFieldCapacity.setCustomValidity('При выбранном количестве комнат гости не допускаются');
    } else if (room !== 100 && guest === 0) {
      formFieldCapacity.setCustomValidity('Без гостей можно только при 100 комнат');
    } else if (guest <= room) {
      formFieldCapacity.setCustomValidity('');
    } else {
      formFieldCapacity.setCustomValidity('Количество гостей не может быть больше количества комнат');
    }
  };

  formSubmitButton.addEventListener('click', function () {
    checkCapacity(formFieldRoomNumber.value, formFieldCapacity.value);
  });

  var removePins = function () {
    var pin = window.util.pinMain.nextElementSibling;
    while (pin) {
      pin.remove();
      pin = window.util.pinMain.nextElementSibling;
    }
  };

  var pageReset = function () {
    window.util.formNode.reset();
    window.setFormActive(false);
    window.mapNode.classList.add('map--faded');
    removePins();
    window.util.pinMain.style.top = '375px';
    window.util.pinMain.style.left = '570px';
    window.firstPinMouseUp = true;
    window.cardPopup = window.mapNode.querySelector('.popup');
    if (window.cardPopup) {
      window.removePopupCard(window.cardPopup);
    }
  };

  successMessage.addEventListener('click', function () {
    successMessage.classList.add('hidden');
  });

  formResetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    pageReset();
  });

  var formSuccessSentHandler = function () {
    pageReset();
    successMessage.classList.remove('hidden');
  };

  window.util.formNode.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload('https://js.dump.academy/keksobooking', new FormData(evt.target), formSuccessSentHandler);
  });
})();
