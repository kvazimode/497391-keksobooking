'use strict';

window.backend = (function () {
  return {
    load: function (link, loadHandler, errorHandler) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          loadHandler(xhr.response);
        } else {
          errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        errorHandler('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        errorHandler('Превышено время ожидания ответа (' + xhr.timeout + 'мс)');
      });
      xhr.timeout = 5000;
      xhr.open('GET', link);
      xhr.send();
    },
    upload: function (link, data, loadHandler, errorHandler) {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          loadHandler();
        } else {
          errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        errorHandler('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        errorHandler('Превышено время ожидания ответа (' + xhr.timeout + 'мс)');
      });
      xhr.timeout = 5000;
      xhr.open('POST', link);
      xhr.send(data);
    }
  };
})();
