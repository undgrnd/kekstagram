'use strict';

(function () {

  var AVATARS_COUNT = 6;
  var bigPost = document.querySelector('.big-picture');
  var postCloseButton = bigPost.querySelector('#picture-cancel');

  var appendComments = function (post) {
    var commentsContainer = bigPost.querySelector('.social__comments');
    var commentTemplate = bigPost.querySelector('.social__comment');
    // Удаляем шаблоны комментариев
    commentsContainer.innerHTML = '';

    var fragment = document.createDocumentFragment();
    for (var i = 0; i < post.comments.length; i++) {
      var commentElement = commentTemplate.cloneNode(true);
      commentElement.querySelector('.social__picture').src = 'img/avatar-' + window.utils.getRandomNumber(1, AVATARS_COUNT) + '.svg';
      commentElement.querySelector('.social__text').textContent = post.comments[i];
      fragment.appendChild(commentElement);
    }
    commentsContainer.appendChild(fragment);
  };

  window.showBigPost = function (post) {
    document.body.classList.add('modal-open');
    bigPost.classList.remove('hidden');
    bigPost.querySelector('.big-picture__img img').src = post.url;
    bigPost.querySelector('.likes-count').textContent = post.likes;
    bigPost.querySelector('.comments-count').textContent = post.comments.length;
    bigPost.querySelector('.social__caption').textContent = post.description;
    bigPost.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPost.querySelector('.social__loadmore').classList.add('visually-hidden');
    appendComments(post);

    document.addEventListener('keydown', onEscPress);
  };

  var closePreview = function () {
    bigPost.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener(onEscPress);
  };

  postCloseButton.addEventListener('click', function () {
    closePreview();
  });

  var onEscPress = function (evt) {
    if (window.utils.isEscPress(evt)) {
      closePreview();
    }
  };
})();
