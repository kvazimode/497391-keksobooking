'use strict';

var AVATARS_TEMPLATE = 'img/avatars/user0';
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TYPES_PARAM = {
  bungalo: {
    title: 'Бунгало',
    minPrice: 0
  },
  flat: {
    title: 'Квартира',
    minPrice: 1000
  },
  house: {
    title: 'Дом',
    minPrice: 5000
  },
  palace: {
    title: 'Дворец',
    minPrice: 10000
  }
};
var CHECKINS_CHEKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var MAIN_PIN_HEIGHT = 84;
var MAIN_PIN_WIDTH = 62;
var MAP_HEIGHT = 704;
var MAP_WIDTH = 1200;

var template = document.querySelector('template').content;
var pinTemplate = template.querySelector('.map__pin');
var pinsNode = document.querySelector('.map__pins');
var cardTemplate = template.querySelector('.map__card');
var formNode = document.querySelector('.ad-form');
var formFieldList = formNode.querySelectorAll('fieldset');
var formFieldAddress = formNode.querySelector('#address');
var formFieldCheckIn = formNode.querySelector('#timein');
var formFieldCheckOut = formNode.querySelector('#timeout');
var formFieldPrice = formNode.querySelector('#price');
var formFieldType = formNode.querySelector('#type');
var formFieldCapacity = formNode.querySelector('#capacity');
var formFieldRoomNumber = formNode.querySelector('#room_number');
var formSubmitButton = formNode.querySelector('.ad-form__submit');
var pinMain = document.querySelector('.map__pin--main');
var mapNode = document.querySelector('.map');
var filterNode = document.querySelector('.map__filters-container');
var firstPinMouseUp = true;

var getRandomInt = function (min, max) {
  var random = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(random);
};

var getRandomParam = function (params) {
  return params[getRandomInt(0, params.length - 1)];
};

// потаскивание главного пина
pinMain.addEventListener('mousedown', function (evt) {
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

    var newY = pinMain.offsetTop - distance.y;
    var newX = pinMain.offsetLeft - distance.x;
    if (newY < (MAP_HEIGHT - MAIN_PIN_HEIGHT) && newY > 0) {
      pinMain.style.top = (newY) + 'px';
    }
    if (newX < (MAP_WIDTH - MAIN_PIN_WIDTH / 2) && newX > 0) {
      pinMain.style.left = (newX) + 'px';
    }
  };

  var mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    writePinAddress();
    if (firstPinMouseUp) {
      mapNode.classList.remove('map--faded');
      appendMapPins(cardObjectList);
      setFormActive(true);
      firstPinMouseUp = false;
    }
  };

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);

});

// переключение активности полей формы
var setFormActive = function (active) {
  for (var i = 0; i < formFieldList.length; i++) {
    formFieldList[i].disabled = !active;
  }
  if (!active) {
    formNode.classList.add('ad-form--disabled');
  } else {
    formNode.classList.remove('ad-form--disabled');
  }
};
setFormActive(false);

// передача координаты главной метки в поле адреса
var writePinAddress = function () {
  var left = parseInt(pinMain.style.left, 10);
  var top = parseInt(pinMain.style.top, 10);
  formFieldAddress.value = (left + MAIN_PIN_WIDTH / 2) + ', ' + (top + MAIN_PIN_HEIGHT);
};
writePinAddress();

// отображение карточки по нажатию
var findCard = function (alt) {
  var card = {};
  for (var i = 0; i < cardObjectList.length; i++) {
    if (cardObjectList[i].offer.title === alt) {
      card = cardObjectList[i];
    }
  }
  return card;
};

var pinClickHandler = function (evt) {
  var clickedPin = evt.currentTarget;
  var pinAlt = clickedPin.firstElementChild.alt;
  var card = findCard(pinAlt);
  var cardPopup = mapNode.querySelector('.popup');
  if (cardPopup) {
    cardPopup.remove();
  }
  appendCardElement(card);
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
  var minimum = TYPES_PARAM[room].minPrice;
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

// создание пинов и карточки
var generateShuffledArray = function (arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
};

var generateShuffledIntArray = function (amount) {
  var shuffled = [];
  for (var i = 1; i <= amount; i++) {
    shuffled.push(i);
  }
  return generateShuffledArray(shuffled);
};

var getAvatarLink = function (imgNumber) {
  return AVATARS_TEMPLATE + imgNumber + '.png';
};

var getFeatures = function (featuresList) {
  var amount = getRandomInt(0, featuresList.length - 1);
  var features = [];
  var shuffled = generateShuffledArray(featuresList);
  for (var i = 0; i <= amount; i++) {
    features.push(shuffled[i]);
  }
  return features;
};

var shuffledTitles = generateShuffledArray(TITLES);
var shuffledAvatarNumbers = generateShuffledIntArray(8);

var generateCardObjectList = function (amount) {
  var cardList = [];
  for (var i = 0; i < amount; i++) {
    var card = {};
    card.author = {};
    card.offer = {};
    card.location = {};
    card.author.avatar = getAvatarLink(shuffledAvatarNumbers[i]);
    card.offer.title = shuffledTitles[i];
    card.location.x = getRandomInt(300, 900);
    card.location.y = getRandomInt(150, 500);
    card.offer.address = card.location.x + ', ' + card.location.y;
    card.offer.price = getRandomInt(1000, 1000000);
    card.offer.type = getRandomParam(TYPES);
    card.offer.rooms = getRandomInt(1, 5);
    card.offer.guests = getRandomInt(0, 100); // ограничимся 100 гостей
    card.offer.checkin = getRandomParam(CHECKINS_CHEKOUTS);
    card.offer.checkout = getRandomParam(CHECKINS_CHEKOUTS);
    card.offer.features = getFeatures(FEATURES);
    card.offer.description = '';
    card.offer.photos = generateShuffledArray(PHOTOS);
    cardList.push(card);
  }
  return cardList;
};
var cardObjectList = generateCardObjectList(8);

var makePinElement = function (item) {
  var pin = pinTemplate.cloneNode(true);
  pin.style = 'left: '
    + (item.location.x - 25)
    + 'px; top: '
    + (item.location.y - 70)
    + 'px;';
  pin.querySelector('img').src = item.author.avatar;
  pin.querySelector('img').alt = item.offer.title;
  pin.addEventListener('click', pinClickHandler, true);
  return pin;
};

var appendMapPins = function (itemList) {
  for (var i = 0; i < itemList.length; i++) {
    pinsNode.appendChild(makePinElement(itemList[i]));
  }
};

var setCardTitle = function (cardNode, item) {
  cardNode.querySelector('.popup__title').textContent = item.offer.title;
};

var setCardAddress = function (cardNode, item) {
  cardNode.querySelector('.popup__text--address').textContent = item.offer.address;
};

var setCardPrice = function (cardNode, item) {
  cardNode.querySelector('.popup__text--price').textContent = item.offer.price + '₽/ночь';
};

var setCardType = function (cardNode, item) {
  cardNode.querySelector('.popup__type').textContent = TYPES_PARAM[item.offer.type].title;
};

var setCardCapacity = function (cardNode, item) {
  cardNode.querySelector('.popup__text--capacity').textContent = item.offer.rooms
    + ' комнаты для '
    + item.offer.guests
    + ' гостей';
};

var setCardTime = function (cardNode, item) {
  cardNode.querySelector('.popup__text--time').textContent = 'Заезд после '
    + item.offer.checkin
    + ', выезд до '
    + item.offer.checkout;
};

var setCardFeatures = function (cardNode, item) {
  var featuresNode = cardNode.querySelector('.popup__features');
  var featureTemplate = featuresNode.firstElementChild;
  for (var i = 0; i < item.offer.features.length; i++) {
    var feature = featureTemplate.cloneNode(false);
    feature.classList.add('popup__feature--' + item.offer.features[i]);
    featuresNode.appendChild(feature);
  }
  featureTemplate.remove();
};

var setCardDescription = function (cardNode, item) {
  cardNode.querySelector('.popup__description').textContent = item.offer.description;
};

var setCardPhotos = function (cardNode, item) {
  var photosNode = cardNode.querySelector('.popup__photos');
  var photoTemplate = photosNode.firstElementChild;
  for (var i = 0; i < item.offer.photos.length; i++) {
    var photo = photoTemplate.cloneNode(false);
    photo.src = item.offer.photos[i];
    photosNode.appendChild(photo);
  }
  photoTemplate.remove();
};

var setCardAvatar = function (cardNode, item) {
  cardNode.querySelector('img').src = item.author.avatar;
};

var makeCardElement = function (item) {
  var cardElement = cardTemplate.cloneNode(true);
  setCardTitle(cardElement, item);
  setCardAddress(cardElement, item);
  setCardPrice(cardElement, item);
  setCardType(cardElement, item);
  setCardCapacity(cardElement, item);
  setCardTime(cardElement, item);
  setCardFeatures(cardElement, item);
  setCardDescription(cardElement, item);
  setCardPhotos(cardElement, item);
  setCardAvatar(cardElement, item);
  return cardElement;
};

var appendCardElement = function (item) {
  mapNode.insertBefore(makeCardElement(item), filterNode);
};
