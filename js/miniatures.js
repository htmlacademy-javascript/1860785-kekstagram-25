import {openFullSizeMode} from './full-size-mode.js';
import {debounce} from './util.js';

const RENDER_DELAY = 500;
const RANDOM_MINIATURES_NUMBER = 10;

const templatePicture = document.querySelector('#picture').content.querySelector('.picture');
const picturesBlock = document.querySelector('.pictures');
const imgFiltersContainer = document.querySelector('.img-filters');
const imgFiltersForm = imgFiltersContainer.querySelector('.img-filters__form');
const imgFiltersButtons = imgFiltersForm.querySelectorAll('.img-filters__button');

const picturesFragment = document.createDocumentFragment();

const renderMiniatures = (photoDescriptions) => {

  const toRender = (data) => {
    document.querySelectorAll('.picture').forEach((item) => {
      item.remove();
    });
    data.forEach(({url, likes, comments}) => {
      const picture = templatePicture.cloneNode(true);
      picture.querySelector('.picture__img').src = url;
      picture.querySelector('.picture__likes').textContent = likes;
      picture.querySelector('.picture__comments').textContent = comments.length;
      picturesFragment.append(picture);
    });
    picturesBlock.append(picturesFragment);
    openFullSizeMode(data);
  };
  toRender(photoDescriptions);
  imgFiltersContainer.classList.remove('img-filters--inactive');

  let filteredData;

  const setFilterClick = (cb) => {
    imgFiltersForm.addEventListener('click', (evt) => {
      const removeActivityHighlight = () => {
        imgFiltersButtons.forEach((item) => {
          if (item.classList.contains('img-filters__button--active')) {
            item.classList.remove('img-filters__button--active');
          }
        });
      };
      if (evt.target.matches('button#filter-default')) {
        removeActivityHighlight();
        evt.target.classList.add('img-filters__button--active');
        filteredData = photoDescriptions;
        cb();
      }
      if (evt.target.matches('button#filter-random')) {
        removeActivityHighlight();
        evt.target.classList.add('img-filters__button--active');
        filteredData = photoDescriptions.slice().sort(() => Math.random() - 0.5).splice(0, RANDOM_MINIATURES_NUMBER);
        cb();
      }
      if (evt.target.matches('button#filter-discussed')) {
        removeActivityHighlight();
        evt.target.classList.add('img-filters__button--active');
        filteredData = photoDescriptions.slice().sort((a, b) => b.comments.length - a.comments.length);
        cb();
      }
    });
  };

  setFilterClick(debounce(() => toRender(filteredData), RENDER_DELAY));
};

export {renderMiniatures};
