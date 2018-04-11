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
var CHECKINS_CHEKOUTS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var template = document.querySelector('template').content;
var pinTemplate = template.querySelector('.map__pin');
var pinsNode = document.querySelector('.map__pins');
var cardTemplate = template.querySelector('.map__card');
var mapNode = document.querySelector('.map');
var filterNode = document.querySelector('.map__filters-container');
mapNode.classList.remove('map--faded');

var getRandomInt = function (min, max) {
  var random = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(random);
};

var getRandomParam = function (params) {
  return params[getRandomInt(0, params.length - 1)];
};

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

var generateCardObjects = function (amount) {
  var cards = [];
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
    cards.push(card);
  }
  return cards;
};

var makePinElement = function (house) {
  var pin = pinTemplate.cloneNode(true);
  pin.style = 'left: '
    + (house.location.x + 25)
    + 'px; top: '
    + (house.location.y + 70)
    + 'px;';
  pin.querySelector('img').src = house.author.avatar;
  pin.querySelector('img').alt = house.offer.title;
  return pin;
};

var appendMapPins = function (houses) {
  for (var i = 0; i < houses.length; i++) {
    pinsNode.appendChild(makePinElement(houses[i]));
  }
};

var setCardTitle = function (cardNode, house) {
  cardNode.querySelector('.popup__title').textContent = house.offer.title;
};

var setCardAddress = function (cardNode, house) {
  cardNode.querySelector('.popup__text--address').textContent = house.offer.address;
};

var setCardPrice = function (cardNode, house) {
  cardNode.querySelector('.popup__text--price').textContent = house.offer.price + '₽/ночь';
};

var setCardType = function (cardNode, house) {
  switch (house.offer.type) {
    case 'flat':
      cardNode.querySelector('.popup__type').textContent = 'Квартира';
      break;
    case 'bungalo':
      cardNode.querySelector('.popup__type').textContent = 'Бунгало';
      break;
    case 'house':
      cardNode.querySelector('.popup__type').textContent = 'Дом';
      break;
    case 'palace':
      cardNode.querySelector('.popup__type').textContent = 'Дворец';
      break;
  }
};

var setCardCapacity = function (cardNode, house) {
  cardNode.querySelector('.popup__text--capacity').textContent = house.offer.rooms
    + ' комнаты для '
    + house.offer.guests
    + ' гостей';
};

var setCardTime = function (cardNode, house) {
  cardNode.querySelector('.popup__text--time').textContent = 'Заезд после '
    + house.offer.checkin
    + ', выезд до '
    + house.offer.checkout;
};

// запоминаем первый элемент списка, удаляем список, создаём клоны первого элемента с нужыми классами
var setCardFeatures = function (cardNode, house) {
  var featuresNode = cardNode.querySelector('.popup__features');
  var featuresList = featuresNode.querySelectorAll('li');
  var listItem = featuresList[0];
  for (var i = 0; i < featuresList.length; i++) {
    featuresNode.removeChild(featuresList[i]);
  }
  for (var j = 0; j < house.offer.features.length; j++) {
    var newItem = listItem.cloneNode(false);
    newItem.classList.remove('popup__feature--wifi');
    newItem.classList.add('popup__feature--' + house.offer.features[j]);
    featuresNode.appendChild(newItem);
  }
};

var setCardDescription = function (cardNode, house) {
  cardNode.querySelector('.popup__description').textContent = house.offer.description;
};

var setCardPhotos = function (cardNode, house) {
  var photosNode = cardNode.querySelector('.popup__photos');
  var firstImg = photosNode.querySelector('img');
  photosNode.removeChild(firstImg);
  for (var i = 0; i < house.offer.photos.length; i++) {
    var photo = firstImg.cloneNode(false);
    photo.src = house.offer.photos[i];
    photosNode.appendChild(photo);
  }
};

var setCardAvatar = function (cardNode, house) {
  cardNode.querySelector('img').src = house.author.avatar;
};

var makeCardElement = function (house) {
  var cardElement = cardTemplate.cloneNode(true);
  setCardTitle(cardElement, house);
  setCardAddress(cardElement, house);
  setCardPrice(cardElement, house);
  setCardType(cardElement, house);
  setCardCapacity(cardElement, house);
  setCardTime(cardElement, house);
  setCardFeatures(cardElement, house);
  setCardDescription(cardElement, house);
  setCardPhotos(cardElement, house);
  setCardAvatar(cardElement, house);
  return cardElement;
};

var appendCardElement = function (house) {
  mapNode.insertBefore(makeCardElement(house), filterNode);
};

var cardObjects = generateCardObjects(8);
appendMapPins(cardObjects);
appendCardElement(cardObjects[0]);
