import {isEscapeKey} from './util.js';

const NUMBER_COMMENTS_DISPLAYED = 5;

const bigPicture = document.querySelector('.big-picture');
const body = document.querySelector('body');
const imgFiltersForm = body.querySelector('.img-filters__form');
const pictureContainer = document.querySelector('.pictures');
const pictureCancel = bigPicture.querySelector('#picture-cancel');
const socialCommentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const likesCount = bigPicture.querySelector('.likes-count');
const bigPictureImg = bigPicture.querySelector('.big-picture__img');
const partCommentsCount = socialCommentCount.querySelector('.part-comments-count');
const commentsCount = socialCommentCount.querySelector('.comments-count');
const commentsText = socialCommentCount.querySelector('.comments-text');


let onPictureClickVariable;

imgFiltersForm.addEventListener('click', (evt) => {
  if (evt.target.matches('button')) {
    pictureContainer.removeEventListener('click', onPictureClickVariable);
  }
});

const openFullSizeMode = (data) => {

  const pictures = document.querySelectorAll('.picture');

  const onPictureClick = (evt) => {
    if (evt.target.matches('img.picture__img')) {
      bigPicture.classList.remove('hidden');
      body.classList.add('modal-open');
      pictureCancel.addEventListener('click', onPictureCancelClick);
      document.addEventListener('keydown', onBigPictureEscKeydown);
      bigPicture.querySelector('img').src = evt.target.src;
      bigPicture.querySelector('.likes-count').textContent = evt.target.parentElement.querySelector('.picture__likes').textContent;
      bigPicture.querySelector('.comments-count').textContent = evt.target.parentElement.querySelector('.picture__comments').textContent;
      const getElementNumber = () => {
        for (let i = 0; i < pictures.length; i++) {
          if (evt.target.parentElement === pictures[i]) {
            return i;
          }
        }
      };
      if (Number(evt.target.parentElement.querySelector('.picture__likes').textContent) > data[getElementNumber()].likes) {
        likesCount.classList.add('likes-count--active');
      } else {
        likesCount.classList.remove('likes-count--active');
      }
      bigPicture.querySelector('.social__caption').textContent = data[getElementNumber()].description;
      bigPicture.querySelector('.social__comments').innerHTML = '';
      data[getElementNumber()].comments.forEach(({avatar, name, message}) => {
        bigPicture.querySelector('.social__comments').insertAdjacentHTML('beforeend', `
            <li class="social__comment hidden">
              <img
                class="social__picture"
                src="${avatar}"
                alt="${name}"
                width="35" height="35">
              <p class="social__text">${message}</p>
            </li>`);
      });
      const comments = bigPicture.querySelectorAll('.social__comment');
      if (Number(commentsCount.textContent[commentsCount.textContent.length - 1]) === 1 &&
            Number(commentsCount.textContent[commentsCount.textContent.length - 2]) !== 1) {
        commentsText.textContent = ' комментария';
      } else {
        commentsText.textContent = ' комментариев';
      }
      for (let j = 0; j < NUMBER_COMMENTS_DISPLAYED; j++) {
        if (comments[j] !== undefined) {
          comments[j].classList.remove('hidden');
          partCommentsCount.textContent = j + 1;
        } else {
          break;
        }
      }
      const hiddenComments = bigPicture.querySelectorAll('.social__comment.hidden');
      if (hiddenComments.length === 0) {
        commentsLoader.classList.add('hidden');
      }
      likesCount.addEventListener('click', onLikesCountClick);
      commentsLoader.addEventListener('click', onCommentsLoaderClick);
    }
  };

  onPictureClickVariable = onPictureClick;

  function onLikesCountClick () {
    likesCount.classList.toggle('likes-count--active');
    if (likesCount.classList.contains('likes-count--active')) {
      likesCount.textContent = Number(likesCount.textContent) + 1;
      for (let i = 0; i < pictures.length; i++) {
        if (pictures[i].querySelector('.picture__img').src === bigPictureImg.querySelector('img').src) {
          pictures[i].querySelector('.picture__likes').textContent = Number(pictures[i].querySelector('.picture__likes').textContent) + 1;
          pictures[i].querySelector('.picture__likes').classList.add('picture__likes-added');
          break;
        }
      }
    } else {
      likesCount.textContent = Number(likesCount.textContent) - 1;
      for (let i = 0; i < pictures.length; i++) {
        if (pictures[i].querySelector('.picture__img').src === bigPictureImg.querySelector('img').src) {
          pictures[i].querySelector('.picture__likes').textContent = Number(pictures[i].querySelector('.picture__likes').textContent) - 1;
          pictures[i].querySelector('.picture__likes').classList.remove('picture__likes-added');
          break;
        }
      }
    }
  }

  function onCommentsLoaderClick () {
    const hiddenComments = bigPicture.querySelectorAll('.social__comment.hidden');
    let numberAddedComments = 0;
    for (let i = 0; i < NUMBER_COMMENTS_DISPLAYED; i++) {
      if (hiddenComments[i] !== undefined) {
        hiddenComments[i].classList.remove('hidden');
        numberAddedComments += 1;
      } else {
        break;
      }
    }
    partCommentsCount.textContent = Number(partCommentsCount.textContent) + numberAddedComments;
    if (hiddenComments.length <= NUMBER_COMMENTS_DISPLAYED) {
      commentsLoader.classList.add('hidden');
    }
  }

  pictureContainer.addEventListener('click', onPictureClick);

  const closeBigPicture = () => {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
    partCommentsCount.textContent = 0;
    if (commentsLoader.classList.contains('hidden')) {
      commentsLoader.classList.remove('hidden');
    }
    pictureCancel.removeEventListener('click', onPictureCancelClick);
    document.removeEventListener('keydown', onBigPictureEscKeydown);
    likesCount.removeEventListener('click', onLikesCountClick);
    commentsLoader.removeEventListener('click', onCommentsLoaderClick);
  };
  function onPictureCancelClick () {
    closeBigPicture();
  }
  function onBigPictureEscKeydown (evt) {
    if (isEscapeKey(evt)) {
      closeBigPicture();
    }
  }
};

const onFailure = () => {

  body.insertAdjacentHTML('beforeend', `
    <section class="error">
      <div class="error__inner">
        <h2 class="error__title">Ошибка загрузки данных с сервера</h2>
        <button type="button" class="error__button">Жаль:(</button>
      </div>
    </section>`);

  const errorSection = body.querySelector('.error');
  const errorMessage = errorSection.querySelector('.error__inner');
  const errorButton = errorMessage.querySelector('.error__button');

  const onErrorButtonClick = () => {
    closeErrorMessage();
  };

  const onDocumentEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      closeErrorMessage();
    }
  };

  const onErrorSectionClick = (evt) => {
    if (evt.target === errorSection) {
      closeErrorMessage();
    }
  };

  errorButton.addEventListener('click', onErrorButtonClick);
  errorSection.addEventListener('click', onErrorSectionClick);
  document.addEventListener('keydown', onDocumentEscKeydown);

  function closeErrorMessage () {
    errorSection.remove();
    errorSection.removeEventListener('click', onErrorSectionClick);
    document.removeEventListener('keydown', onDocumentEscKeydown);
  }
};

export {openFullSizeMode, onFailure};
