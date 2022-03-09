import {randomPhotoDescriptions} from './miniatures.js';

const pictures = document.querySelectorAll('.picture');
const bigPicture = document.querySelector('.big-picture');
const pictureCancel = document.querySelector('#picture-cancel');
const body = document.querySelector('body');
const socialCommentCount = document.querySelector('.social__comment-count');
const commentsLoader = document.querySelector('.comments-loader');

pictureCancel.addEventListener('click', () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
});

document.addEventListener('keydown', (evt) => {
  if (evt.keyCode === 27) {
    bigPicture.classList.add('hidden');
    body.classList.remove('modal-open');
  }
});

for (let i = 0; i < pictures.length; i++) {
  pictures[i].addEventListener('click', (evt) => {
    evt.preventDefault();
    bigPicture.classList.remove('hidden');
    body.classList.add('modal-open');
    socialCommentCount.classList.add('hidden');
    commentsLoader.classList.add('hidden');
    bigPicture.querySelector('img').src = pictures[i].querySelector('.picture__img').src;
    bigPicture.querySelector('.likes-count').textContent = pictures[i].querySelector('.picture__likes').textContent;
    bigPicture.querySelector('.comments-count').textContent = pictures[i].querySelector('.picture__comments').textContent;
    bigPicture.querySelector('.social__caption').textContent = randomPhotoDescriptions[i].description;
    bigPicture.querySelector('.social__comments').innerHTML = '';
    randomPhotoDescriptions[i].comments.forEach(({avatar, name, message}) => {
      bigPicture.querySelector('.social__comments').insertAdjacentHTML('beforeend', `
      <li class="social__comment">
        <img
          class="social__picture"
          src="${avatar}"
          alt="${name}"
          width="35" height="35">
        <p class="social__text">${message}</p>
      </li>`);
    });
  });
}
