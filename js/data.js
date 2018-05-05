'use strict';

(function () {
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
  var CHECKINS_CHEKOUTS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var getRandomInt = window.util.getRandomInt;
  var getRandomParam = window.util.getRandomParam;
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

  window.generateCardObjectList = function (amount) {
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
})();
