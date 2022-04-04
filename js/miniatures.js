import {setFullSizeModeClick} from './full-size-mode.js';
import {debounce, isEscapeKey} from './util.js';

const RENDER_DELAY = 500;
const RANDOM_MINIATURES_NUMBER = 10;

const body = document.querySelector('body');
const templatePicture = document.querySelector('#picture').content.querySelector('.picture');
const picturesBlock = document.querySelector('.pictures');
const imgFiltersContainer = document.querySelector('.img-filters');
const imgFiltersForm = imgFiltersContainer.querySelector('.img-filters__form');
const imgFiltersButtons = imgFiltersForm.querySelectorAll('.img-filters__button');

const picturesFragment = document.createDocumentFragment();


const renderMiniatures = (photoDescriptions) => {

  photoDescriptions.forEach((item) => {
    item.liked = false;
    item.hidden = false;
  });

  const toRender = (data) => {
    document.querySelectorAll('.picture').forEach((item) => {
      item.remove();
    });
    data.forEach((item) => {
      const picture = templatePicture.cloneNode(true);
      if (!item.hidden) {
        picture.querySelector('.picture__img').src = item.url;
        if (item.liked) {
          picture.querySelector('.picture__likes').textContent = item.likes + 1;
          picture.querySelector('.picture__likes').classList.add('picture__likes-added');
        } else {
          picture.querySelector('.picture__likes').textContent = item.likes;
        }
        picture.querySelector('.picture__comments').textContent = item.comments.length;
        picturesFragment.append(picture);
      }
    });
    picturesBlock.append(picturesFragment);
    setFullSizeModeClick(data);
  };

  toRender(photoDescriptions);
  imgFiltersContainer.classList.remove('img-filters--inactive');

  const syncLikes = () => {
    const picturesLikes = document.querySelectorAll('.picture__likes');
    photoDescriptions.forEach((item) => {
      if (item.hidden) {
        item.hidden = false;
      }
    });
    picturesLikes.forEach((item, i) => {
      if (item.classList.contains('picture__likes-added')) {
        photoDescriptions[i].liked = true;
      } else {
        photoDescriptions[i].liked = false;
      }
    });
  };

  const setFilterClick = (cb) => {
    imgFiltersForm.addEventListener('click', (evt) => {
      const removeActivityHighlight = () => {
        for (let i = 0; i < imgFiltersButtons.length; i++) {
          if (imgFiltersButtons[i].classList.contains('img-filters__button--active')) {
            imgFiltersButtons[i].classList.remove('img-filters__button--active');
            break;
          }
        }
      };
      if (evt.target.matches('button#filter-default')) {
        if (!evt.target.classList.contains('img-filters__button--active')) {
          removeActivityHighlight();
          evt.target.classList.add('img-filters__button--active');
          syncLikes();
          photoDescriptions.sort((a, b) => a.id - b.id);
          cb();
        } else {
          setFullSizeModeClick(photoDescriptions);
        }
      }
      if (evt.target.matches('button#filter-random')) {
        removeActivityHighlight();
        evt.target.classList.add('img-filters__button--active');
        syncLikes();
        photoDescriptions.sort(() => Math.random() - 0.5);
        for (let i = photoDescriptions.length - 1; i >= RANDOM_MINIATURES_NUMBER; i--) {
          photoDescriptions[i].hidden = true;
        }
        cb();
      }
      if (evt.target.matches('button#filter-discussed')) {
        if (!evt.target.classList.contains('img-filters__button--active')) {
          removeActivityHighlight();
          evt.target.classList.add('img-filters__button--active');
          syncLikes();
          photoDescriptions.sort((a, b) => b.comments.length - a.comments.length);
          cb();
        } else {
          setFullSizeModeClick(photoDescriptions);
        }
      }
    });
  };

  setFilterClick(debounce(() => toRender(photoDescriptions), RENDER_DELAY));
};

const onErrorDataDownload = () => {

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

export {renderMiniatures, onErrorDataDownload};
