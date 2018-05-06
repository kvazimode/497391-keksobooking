'use strict';


(function () {
  var DELAY = 500;
  var filterState = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any',
    'features': []
  };

  window.resetFilter = function () {
    filterState.features = [];
    window.util.filterNode.querySelector('form').reset();
  };

  var findIndex = function (arr, item) {
    if (arr.indexOf) {
      return arr.indexOf(item);
    }
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        return i;
      }
    }
    return -1;
  };

  var editFeature = function (feature) {
    var existing = findIndex(filterState['features'], feature.value);
    if (feature.checked) {
      filterState['features'].push(feature.value);
    } else {
      filterState['features'].splice(existing, 1);
    }
  };

  var checkSame = function (given, filter, areNums) {
    if (filter !== 'any') {
      if (areNums) {
        given = +given;
        filter = +filter;
      }
      return (given === filter);
    }
    return true;
  };

  var checkPrice = function (given, filter) {
    var low = 10000;
    var high = 50000;
    if (filter !== 'any') {
      if (given < low) {
        return (filter === 'low');
      } else if (given >= low && given <= high) {
        return (filter === 'middle');
      } else if (given > high) {
        return (filter === 'high');
      }
    }
    return true;
  };

  var checkFeature = function (given, filter) {
    var count = 0;
    if (filter.length) {
      for (var i = 0; i < filter.length; i++) {
        for (var j = 0; j < given.length; j++) {
          if (checkSame(filter[i], given[j])) {
            count++;
          }
        }
      }
      return (count === filter.length);
    }
    return true;
  };

  var findSuitable = function (list, filter) {
    var filteredList = [];
    filteredList = list.map(function (card) {
      var type = card.offer.type;
      var price = card.offer.price;
      var room = card.offer.rooms;
      var guest = card.offer.guests;
      var features = card.offer.features;
      if (checkSame(type, filter['housing-type']) &&
        checkPrice(price, filter['housing-price']) &&
        checkSame(room, filter['housing-rooms'], true) &&
        checkSame(guest, filter['housing-guests'], true) &&
        checkFeature(features, filter['features'])) {
        return card;
      }
      return '';
    });

    var suitableItemList = [];
    for (var i = 0; i < filteredList.length; i++) {
      if (filteredList[i] !== '') {
        suitableItemList.push(filteredList[i]);
      }
    }
    return suitableItemList;
  };

  var debounce = function (fn) {
    var lastTimeout = null;
    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fn.apply(null, args);
      }, DELAY);
    };
  };

  var filterChangeHandler = function (evt) {
    if (evt.target.name === 'features') {
      editFeature(evt.target);
    } else {
      filterState[evt.target.name] = evt.target.value;
    }
    window.cardPopup = window.util.mapNode.querySelector('.popup');
    if (window.cardPopup) {
      window.cardPopup.remove();
    }
    window.util.removePins();
    var List = findSuitable(window.data.serverData, filterState);
    window.util.appendMapPins(List);
  };

  window.util.filterNode.addEventListener('change', debounce(filterChangeHandler));
})();
