'use strict';

(function () {

  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  var URL_POST = 'https://js.dump.academy/kekstagram';
  var ERROR_BAD_REQUEST = 400;
  var ERROR_NOT_FOUND = 404;
  var SUCCESS = 200;
  var TIMEOUT = 10000;

  var setupRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case SUCCESS:
          onLoad(xhr.response);
          break;
        case ERROR_BAD_REQUEST:
          onError('Запрос неверный');
          break;
        case ERROR_NOT_FOUND:
          onError('Не найдено');
          break;
        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  };

  var download = function (onLoad, onError) {
    var xhr = setupRequest(onLoad, onError);
    xhr.open('GET', URL_GET);
    xhr.send();
  };

  var upload = function (data, onLoad, onError, onUploading) {
    var xhr = setupRequest(onLoad, onError);
    xhr.upload.addEventListener('progress', onUploading);
    xhr.open('POST', URL_POST);
    xhr.send(data);
  };

  window.backend = {
    load: download,
    upload: upload
  };
})();
