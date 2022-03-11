import {createPhotoDescriptions} from './data.js';

const COUNT_RANDOM_ELEMENTS = 25;

const templatePicture = document.querySelector('#picture').content.querySelector('.picture');
const picturesBlock = document.querySelector('.pictures');

const randomPhotoDescriptions = createPhotoDescriptions(COUNT_RANDOM_ELEMENTS);

const picturesFragment = document.createDocumentFragment();

randomPhotoDescriptions.forEach(({url, likes, comments}) => {
  const picture = templatePicture.cloneNode(true);
  picture.querySelector('.picture__img').src = url;
  picture.querySelector('.picture__likes').textContent = likes;
  picture.querySelector('.picture__comments').textContent = comments.length;
  picturesFragment.append(picture);
});

picturesBlock.append(picturesFragment);

export {randomPhotoDescriptions};
