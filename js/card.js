'use strict';

(function () {
  var ESC_CODE = 27;

  window.TYPES_PARAM = {
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

  var cardTemplate = window.util.template.querySelector('.map__card');
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
    cardNode.querySelector('.popup__type').textContent = window.TYPES_PARAM[item.offer.type].title;
  };

  var setCardCapacity = function (cardNode, item) {
    cardNode.querySelector('.popup__text--capacity').textContent = item.offer.rooms +
      ' комнаты для ' +
      item.offer.guests +
      ' гостей';
  };

  var setCardTime = function (cardNode, item) {
    cardNode.querySelector('.popup__text--time').textContent = 'Заезд после ' +
      item.offer.checkin +
      ', выезд до ' +
      item.offer.checkout;
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

  var isEscPressEvent = function (evt, callback) {
    if (evt.keyCode === ESC_CODE) {
      callback();
    }
  };

  window.cardEscPressHandler = function (evt) {
    isEscPressEvent(evt, function () {
      window.util.removeCardPopup();
    });
  };

  window.makeCardElement = function (item) {
    var cardElement = cardTemplate.cloneNode(true);
    var closeButton = cardElement.querySelector('.popup__close');
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
    closeButton.addEventListener('click', function () {
      window.util.removeCardPopup();
    });
    document.addEventListener('keydown', window.cardEscPressHandler);
    return cardElement;
  };
})();
