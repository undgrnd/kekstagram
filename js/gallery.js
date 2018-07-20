'use strict';

(function () {
  var DESCRIPTIONS = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];
  var NEW_POSTS_COUNT = 10;
  var postTemplate = document.querySelector('#picture').content.querySelector('.picture__link');
  var filtersContainer = document.querySelector('.img-filters');
  var filtersForm = document.querySelector('.img-filters__form');
  var filtersButtons = document.querySelectorAll('.img-filters__button');
  var picturesList = document.querySelector('.pictures');
  var activeClass = 'img-filters__button--active';
  var postData;

  var renderPost = function (post) {
    var postElement = postTemplate.cloneNode(true);
    postElement.querySelector('.picture__img').src = post.url;
    postElement.querySelector('.picture__stat--comments').textContent = post.comments.length;
    postElement.querySelector('.picture__stat--likes').textContent = post.likes;
    postElement.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.showBigPost(post);
    });
    return postElement;
  };

  var newRandomPosts = function (posts) {
    var mixedPosts = window.utils.shuffleArray(posts);
    return mixedPosts.slice(0, NEW_POSTS_COUNT);
  };

  var sortByComments = function (posts) {
    var newPosts = posts.slice();
    return newPosts.sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });
  };

  var appendPosts = function (posts) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < posts.length; i++) {
      fragment.appendChild(renderPost(posts[i]));
    }
    picturesList.appendChild(fragment);
  };

  var cleanPosts = function () {
    var posts = document.querySelectorAll('.picture__link');
    for (var i = 0; i < posts.length; i++) {
      posts[i].parentNode.removeChild(posts[i]);
    }
  };

  var addDescriptions = function (posts) {
    posts.forEach(function (item) {
      item.description = window.utils.getRandomElement(DESCRIPTIONS);
    });
  };

  var applyFilters = function (evt) {
    if (evt.target.tagName === 'BUTTON') {
      window.utils.toggleClassInLine(evt.target, filtersButtons, activeClass);
      cleanPosts();
      switch (evt.target.id) {
        case 'filter-popular':
          appendPosts(postData);
          break;
        case 'filter-new':
          appendPosts(newRandomPosts(postData));
          break;
        case 'filter-discussed':
          appendPosts(sortByComments(postData));
          break;
        default:
      }
    }
  };

  var showFilters = function () {
    filtersContainer.classList.remove('img-filters--inactive');
    filtersForm.addEventListener('click', window.debounce(applyFilters));
  };

  var onLoad = function (posts) {
    postData = posts;
    addDescriptions(posts);
    appendPosts(posts);
    showFilters();
  };

  var onError = function (message) {
    var div = document.createElement('div');
    div.style.padding = '10px';
    div.style.position = 'absolute';
    div.style.border = '1px solid #ffffff';
    div.style.top = '15px';
    div.innerHTML = message;
    document.body.appendChild(div);
    div.style.left = (document.body.offsetWidth / 2 - div.offsetWidth / 2) + 'px';
  };

  window.backend.load(onLoad, onError);
})();
