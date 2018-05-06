'use strict';

(function () {
  var formFieldCheckIn = window.util.formNode.querySelector('#timein');
  var formFieldCheckOut = window.util.formNode.querySelector('#timeout');
  var formFieldPrice = window.util.formNode.querySelector('#price');
  var formFieldType = window.util.formNode.querySelector('#type');
  var formFieldCapacity = window.util.formNode.querySelector('#capacity');
  var formFieldRoomNumber = window.util.formNode.querySelector('#room_number');
  var formSubmitButton = window.util.formNode.querySelector('.ad-form__submit');
  var formResetButton = window.util.formNode.querySelector('.ad-form__reset');
  var successMessage = document.querySelector('.success');

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

  var resetPage = function () {
    window.util.formNode.reset();
    window.util.setFormActive(false);
    window.util.mapNode.classList.add('map--faded');
    window.util.removePins();
    window.util.pinMain.style.top = '375px';
    window.util.pinMain.style.left = '570px';
    window.firstPinMouseUp = true;
    window.cardPopup = window.util.mapNode.querySelector('.popup');
    if (window.cardPopup) {
      window.cardPopup.remove();
    }
    window.util.writePinAddress();
    window.resetFilter();
  };

  successMessage.addEventListener('click', function () {
    successMessage.classList.add('hidden');
  });

  formResetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    resetPage();
  });

  var formSuccessSentHandler = function () {
    resetPage();
    successMessage.classList.remove('hidden');
  };

  window.util.formNode.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload('https://js.dump.academy/keksobooking', new FormData(evt.target), formSuccessSentHandler);
  });
})();
