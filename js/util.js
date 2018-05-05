'use strict';

window.util = (function () {
  return {
    template: document.querySelector('template').content,
    pinMain: document.querySelector('.map__pin--main'),
    formNode: document.querySelector('.ad-form'),
    getRandomInt: function (min, max) {
      var random = min - 0.5 + Math.random() * (max - min + 1);
      random = Math.round(random);
      return random;
    },
    getRandomParam: function (params) {
      var param = params[window.util.getRandomInt(0, params.length - 1)];
      return param;
    }
  };
})();
