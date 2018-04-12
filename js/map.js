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
var TYPES_DICT = {
  palace: 'Дворец',
  house: 'Дом',
  bungalo: 'Бунгало',
  flat: 'Квартира'
};
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

var makePinElement = function (item) {
  var pin = pinTemplate.cloneNode(true);
  pin.style = 'left: '
    + (item.location.x - 25)
    + 'px; top: '
    + (item.location.y - 70)
    + 'px;';
  pin.querySelector('img').src = item.author.avatar;
  pin.querySelector('img').alt = item.offer.title;
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
  cardNode.querySelector('.popup__type').textContent = TYPES_DICT[item.offer.type];
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

var cardObjects = generateCardObjects(8);
appendMapPins(cardObjects);
appendCardElement(cardObjects[0]);
