import {createPhotoDescriptions} from './data.js';

const COUNT_RANDOM_ELEMENTS = 25;

const templatePicture = document.querySelector('#picture').content.querySelector('.picture');
const picturesBlock = document.querySelector('.pictures');

const randomPhotoDescriptions = createPhotoDescriptions(COUNT_RANDOM_ELEMENTS);

const picturesFragment = document.createDocumentFragment();

randomPhotoDescriptions.forEach((element) => {
  const picture = templatePicture.cloneNode(true);
  picture.querySelector('.picture__img').src = element.url;
  picture.querySelector('.picture__likes').textContent = element.likes;
  picture.querySelector('.picture__comments').textContent = element.comments.length;
  picturesFragment.append(picture);
});

picturesBlock.append(picturesFragment);
