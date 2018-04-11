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

var generateShuffledArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array;
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

var makePinElement = function (element) {
  var pin = pinTemplate.cloneNode(true);
  pin.style = 'left: '
    + (element.location.x + 50)
    + 'px; top: '
    + (element.location.y + 70)
    + 'px;';
  pin.querySelector('img').src = element.author.avatar;
  pin.querySelector('img').alt = element.offer.title;
  return pin;
};

var appendMapPins = function (elements) {
  for (var i = 0; i < elements.length; i++) {
    pinsNode.appendChild(makePinElement(elements[i]));
  }
};

var setCardTitle = function (cardNode, element) {
  cardNode.querySelector('.popup__title').textContent = element.offer.title;
};

var setCardAddress = function (cardNode, element) {
  cardNode.querySelector('.popup__text--address').textContent = element.offer.address;
};

var setCardPrice = function (cardNode, element) {
  cardNode.querySelector('.popup__text--price').textContent = element.offer.price + '₽/ночь';
};

var setCardType = function (cardNode, element) {
  switch (element.offer.type) {
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

var setCardGuests = function (cardNode, element) {
  cardNode.querySelector('.popup__text--capacity').textContent = element.offer.rooms
    + ' комнаты для '
    + element.offer.guests
    + ' гостей';
};

var setCardTime = function (cardNode, element) {
  cardNode.querySelector('.popup__text--time').textContent = 'Заезд после '
    + element.offer.checkin
    + ', выезд до '
    + element.offer.checkout;
};

// запоминаем первый элемент списка, удаляем список, создаём клоны первого элемента с нужыми классами
var setCardFeatures = function (cardNode, element) {
  var featuresNode = cardNode.querySelector('.popup__features');
  var featuresList = featuresNode.querySelectorAll('li');
  var listItem = featuresList[0].cloneNode(false);
  for (var i = 0; i < featuresList.length; i++) {
    featuresNode.removeChild(featuresList[i]);
  }
  for (var j = 0; j < element.offer.features.length; j++) {
    var newItem = listItem.cloneNode(false);
    newItem.classList.remove('popup__feature--wifi');
    newItem.classList.add('popup__feature--' + element.offer.features[j]);
    featuresNode.appendChild(newItem);
  }
};

var setCardDescription = function (cardNode, element) {
  cardNode.querySelector('.popup__description').textContent = element.offer.description;
};

var setCardPhotos = function (cardNode, element) {
  var photosNode = cardNode.querySelector('.popup__photos');
  var firstImg = photosNode.querySelector('img');
  photosNode.removeChild(firstImg);
  for (var i = 0; i < element.offer.photos.length; i++) {
    var photo = firstImg.cloneNode(false);
    photo.src = element.offer.photos[i];
    photosNode.appendChild(photo);
  }
};

var setCardAvatar = function (cardNode, element) {
  cardNode.querySelector('img').src = element.author.avatar;
};

var makeCardElement = function (element) {
  var cardElement = cardTemplate.cloneNode(true);
  setCardTitle(cardElement, element);
  setCardAddress(cardElement, element);
  setCardPrice(cardElement, element);
  setCardType(cardElement, element);
  setCardGuests(cardElement, element);
  setCardTime(cardElement, element);
  setCardFeatures(cardElement, element);
  setCardDescription(cardElement, element);
  setCardPhotos(cardElement, element);
  setCardAvatar(cardElement, element);
  return cardElement;
};

var appendCardElement = function (card) {
  mapNode.insertBefore(makeCardElement(card), filterNode);
};

var cardObjects = generateCardObjects(8);
appendMapPins(cardObjects);
appendCardElement(cardObjects[0]);
