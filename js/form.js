'use strict';

(function () {
  var scale = {
    MIN: 25,
    MAX: 100,
    DEFAULT: 100,
    STEP: 25
  };
  var effectValues = {
    HEAT_MAX: 3,
    HEAT_MIN: 1,
    PHOBOS_MAX: 3,
    MARVIN_MAX: 100,
    DEFAULT: 100
  };
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var uploadCloseButton = uploadOverlay.querySelector('.img-upload__cancel');
  var uploadFile = document.querySelector('#upload-file');
  var uploadForm = document.querySelector('.img-upload__form');
  var errorTemplate = document.querySelector('#picture').content.querySelector('.img-upload__message--error');
  var uploadingMessageTemplate = document.querySelector('#picture').content.querySelector('.img-upload__message--loading');
  var resizeControlMinus = uploadOverlay.querySelector('.resize__control--minus');
  var resizeControlPlus = uploadOverlay.querySelector('.resize__control--plus');
  var resizeControlValue = uploadOverlay.querySelector('.resize__control--value');
  var imageUploadPreview = document.querySelector('.img-upload__preview');
  var imageUploadPreviewImg = document.querySelector('.img-upload__preview img');
  var effectsList = uploadOverlay.querySelector('.effects__list');
  var hashtags = document.querySelector('.text__hashtags');
  var description = document.querySelector('.text__description');
  var defaultEffect = document.querySelector('#effect-none');
  var uploadScale = document.querySelector('.img-upload__scale');
  var scalePin = uploadScale.querySelector('.scale__pin');
  var scaleLine = uploadScale.querySelector('.scale__line');
  var scaleLevel = uploadScale.querySelector('.scale__level');
  var scaleValue = uploadScale.querySelector('.scale__value');
  var effectName = '';

  var resetUpload = function () {
    uploadFile.value = '';
    imageUploadPreview.style = '';
    resizeControlValue.value = scale.DEFAULT + '%';
    imageUploadPreviewImg.className = '';
    imageUploadPreviewImg.style = '';
    hashtags.value = '';
    description.value = '';
    defaultEffect.checked = true;
    scaleValue.value = effectValues.DEFAULT;
    setError(false);
  };

  var hideSplashes = function () {
    var splashes = document.querySelectorAll('.img-upload__message');
    for (var i = 0; i < splashes.length; i++) {
      splashes[i].parentNode.removeChild(splashes[i]);
    }
  };

  var closeImageUpload = function () {
    uploadOverlay.classList.add('hidden');
    resetUpload();
  };

  var openImageUpload = function () {
    uploadOverlay.classList.remove('hidden');
    uploadScale.classList.add('hidden');

    document.addEventListener('keydown', function (evt) {
      var activeElement = document.activeElement.type;
      if (window.utils.isEscPress(evt) && (activeElement !== 'text' && activeElement !== 'textarea')) {
        closeImageUpload();
      }
    });

    uploadForm.addEventListener('submit', onFormSubmit);
  };

  uploadFile.addEventListener('change', function () {
    openImageUpload();
  });

  uploadCloseButton.addEventListener('click', function () {
    closeImageUpload();
  });

  var resizeImage = function (sign) {
    var value = resizeControlValue.value;
    value = parseInt(value, 10) + scale.STEP * sign;
    if (value > scale.MAX) {
      value = scale.MAX;
    } else if (value < scale.MIN) {
      value = scale.MIN;
    }
    imageUploadPreview.style.transform = 'scale(' + (value / 100) + ')';
    resizeControlValue.value = value + '%';
  };

  resizeControlMinus.addEventListener('click', function () {
    resizeImage(-1);
  });

  resizeControlPlus.addEventListener('click', function () {
    resizeImage(1);
  });

  effectsList.addEventListener('click', function (evt) {
    if (evt.target.tagName === 'INPUT') {
      effectName = evt.target.value;
      if (effectName === 'none') {
        uploadScale.classList.add('hidden');
      } else {
        uploadScale.classList.remove('hidden');
      }
      imageUploadPreviewImg.className = '';
      imageUploadPreviewImg.style = '';
      imageUploadPreviewImg.classList.add('effects__preview--' + effectName);
      var defaultPinLevel = scaleLine.offsetWidth + 'px';
      scalePin.style.left = defaultPinLevel;
      scaleLevel.style.width = defaultPinLevel;
      scaleValue.value = effectValues.DEFAULT;
    }
  });

  var setError = function (message) {
    if (message) {
      hashtags.style.border = '2px solid red';
      hashtags.setCustomValidity(message);
    } else {
      hashtags.style.borderColor = 'transparent';
      hashtags.setCustomValidity('');
    }
  };

  var checkHashtags = function (array) {
    var hashtagsArrayLowerCase = window.utils.arrayToLowerCase(array);

    for (var i = 0; i < array.length; i++) {
      if (array.length > 5) {
        setError('Нельзя вводить больше пяти хештегов');
        break;
      } else if (array[i] === '#') {
        setError('Хештеги не могут состоять только из решетки.');
        break;
      } else if (array[i][0] !== '#') {
        setError('Хештег ' + array[i] + ' должен начинаться со знака "решетка" (#)');
        break;
      } else if (array[i].length > 20) {
        setError('Хештег ' + array[i] + ' содержит более 20 символов.');
        break;
      } else if (array[i].slice(1).indexOf('#') !== -1) {
        setError('Хештеги ' + array[i] + ' должны быть разделены пробелом.');
        break;
      } else {
        setError(false);
      }
    }

    var uniqueArray = window.utils.removeDuplicatesFromArray(hashtagsArrayLowerCase);
    if (array.length !== uniqueArray.length) {
      setError('Теги содержат дубликаты');
    }
  };

  hashtags.addEventListener('input', function () {
    var hashtagsArray = hashtags.value.split(' ');
    setError(false);
    checkHashtags(hashtagsArray);
  });

  var setEffectValue = function (effectTitle, proportion) {
    var effect = '';
    switch (effectTitle) {
      case 'chrome':
        effect = 'grayscale(' + proportion + ')';
        break;
      case 'sepia':
        effect = 'sepia(' + proportion + ')';
        break;
      case 'marvin':
        effect = 'invert(' + (proportion * effectValues.MARVIN_MAX) + '%)';
        break;
      case 'phobos':
        effect = 'blur(' + (proportion * effectValues.PHOBOS_MAX).toFixed(2) + 'px)';
        break;
      case 'heat':
        effect = 'brightness(' + ((proportion * (effectValues.HEAT_MAX - effectValues.HEAT_MIN)) + effectValues.HEAT_MIN).toFixed(2) + ')';
        break;
      default:
        break;
    }
    imageUploadPreviewImg.style.filter = effect;
  };

  scalePin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
      };

      startCoords = {
        x: moveEvt.clientX,
      };

      var value;
      if (moveEvt.clientX > scaleLine.getBoundingClientRect().right) {
        value = scaleLine.offsetWidth + 'px';
      } else if (moveEvt.clientX < scaleLine.getBoundingClientRect().left) {
        value = '0px';
      } else {
        value = (scalePin.offsetLeft - shift.x) + 'px';
      }
      scalePin.style.left = value;
      scaleLevel.style.width = value;
      var proportion = (scalePin.offsetLeft / scaleLine.offsetWidth).toFixed(2);
      scaleValue.value = proportion * 100;
      setEffectValue(effectName, proportion);
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var showSplash = function (splashTemplate) {
    var splash = splashTemplate.cloneNode(true);
    document.body.appendChild(splash);
    splash.classList.remove('hidden');
    splash.style.zIndex = '10';
    splash.style.position = 'fixed';
  };

  var getChoiceFromUser = function () {
    var linkRepeat = document.querySelector('.error__link--repeat');
    var linkReboot = document.querySelector('.error__link--reboot');

    linkRepeat.addEventListener('click', function (evt) {
      evt.preventDefault();
      hideSplashes();
      window.backend.upload(new FormData(uploadForm), onLoad, onError, showSplash(uploadingMessageTemplate));
    });

    linkReboot.addEventListener('click', function (evt) {
      evt.preventDefault();
      closeImageUpload();
      resetUpload();
      hideSplashes();
      uploadForm.removeEventListener('submit', onFormSubmit);
    });
  };

  var onLoad = function () {
    closeImageUpload();
    resetUpload();
    hideSplashes();
    uploadForm.removeEventListener('submit', onFormSubmit);
  };

  var onError = function () {
    showSplash(errorTemplate);
    getChoiceFromUser();
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(uploadForm), onLoad, onError, showSplash(uploadingMessageTemplate));
  };
})();
