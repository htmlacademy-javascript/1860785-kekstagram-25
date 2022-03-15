import {isEscapeKey} from './util.js';

const form = document.querySelector('#upload-select-image');
const imgUploadOverlay = document.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const uploadFile = form.querySelector('#upload-file');
const uploadCancel = form.querySelector('#upload-cancel');
const textHashtags = form.querySelector('.text__hashtags');
const textDescription = form.querySelector('.text__description');
const regularExpression = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;

const pristine = new Pristine(form);

pristine.addValidator(textHashtags, () => {
  const arrayHashtags = textHashtags.value.split(' ');
  if (arrayHashtags.length > 5) {
    return false;
  }
  return true;
}, 'Максимальное количество хэш-тегов 5', 1, true);

pristine.addValidator(textHashtags, () => {
  const arrayHashtags = textHashtags.value.split(' ');
  for (let i = 0; i < arrayHashtags.length; i++) {
    if (!regularExpression.test(arrayHashtags[i]) && arrayHashtags[i] !== '') {
      return false;
    }
  }
  return true;
}, 'Хэш-тег должен начинаться с #, не превышать 20 символов и может содержать: A-Z, a-z, А-Я, а-я, 0-9', 2, true);

pristine.addValidator(textHashtags, () => {
  const arrayHashtags = textHashtags.value.split(' ');
  for (let i = 0; i < arrayHashtags.length; i++) {
    for (let j = i + 1; j < arrayHashtags.length; j++) {
      if (arrayHashtags[i].toLowerCase() === arrayHashtags[j].toLowerCase() && arrayHashtags[i] !== '') {
        return false;
      }
    }
  }
  return true;
}, 'Хэш-теги не должны повторяться независимо от регистра', 3, true);

function validateForm (evt) {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault();
  }
}

uploadFile.addEventListener('change', () => {
  imgUploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  uploadCancel.addEventListener('click', closeFormOnClick);
  document.addEventListener('keydown', closeFormOnKeydown);
  form.addEventListener('submit', validateForm);
});

const closeForm = () => {
  imgUploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadCancel.removeEventListener('click', closeFormOnClick);
  document.removeEventListener('keydown', closeFormOnKeydown);
  form.removeEventListener('submit', validateForm);
};

function closeFormOnClick () {
  closeForm();
}

function closeFormOnKeydown () {
  if (isEscapeKey && document.activeElement !== textDescription && document.activeElement !== textHashtags) {
    closeForm();
    form.reset();
  }
}
