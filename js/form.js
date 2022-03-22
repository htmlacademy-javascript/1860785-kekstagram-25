import {isEscapeKey} from './util.js';

const form = document.querySelector('#upload-select-image');
const imgUploadOverlay = document.querySelector('.img-upload__overlay');
const body = document.querySelector('body');
const uploadFile = form.querySelector('#upload-file');
const uploadCancel = form.querySelector('#upload-cancel');
const textHashtags = form.querySelector('.text__hashtags');
const textDescription = form.querySelector('.text__description');
const scaleControlSmaller = form.querySelector('.scale__control--smaller');
const scaleControlBigger = form.querySelector('.scale__control--bigger');
const scaleControlValue = form.querySelector('.scale__control--value');
const imgUploadPreview = form.querySelector('.img-upload__preview');
const effectsList = form.querySelector('.effects__list');
const effectLevelSlider = form.querySelector('.effect-level__slider');
const effectLevelValue = form.querySelector('.effect-level__value');
const effectNoneInput = form.querySelector('#effect-none');
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

function makeScaleSmaller () {
  let scaleControlNumberValue = scaleControlValue.value.slice(0, scaleControlValue.value.length - 1);
  scaleControlNumberValue = Number(scaleControlNumberValue);
  scaleControlNumberValue -= 25;
  if (scaleControlNumberValue >= 25) {
    scaleControlValue.value = `${scaleControlNumberValue}%`;
    imgUploadPreview.firstElementChild.style.transform=`scale(0.${scaleControlNumberValue})`;
  } else {
    scaleControlValue.value = '25%';
  }
}

function makeScaleBigger () {
  let scaleControlNumberValue = scaleControlValue.value.slice(0, scaleControlValue.value.length - 1);
  scaleControlNumberValue = Number(scaleControlNumberValue);
  scaleControlNumberValue += 25;
  if (scaleControlNumberValue < 100) {
    scaleControlValue.value = `${scaleControlNumberValue}%`;
    imgUploadPreview.firstElementChild.style.transform=`scale(0.${scaleControlNumberValue})`;
  } else {
    scaleControlValue.value = '100%';
    imgUploadPreview.firstElementChild.style.transform='scale(1)';
  }
}

noUiSlider.create(effectLevelSlider, {
  range: {
    min: 0,
    max: 100,
  },
  start: 100,
  step: 1,
  connect: 'lower',
  format: {
    to: function (value) {
      if (Number.isInteger(value)) {
        return value.toFixed(0);
      }
      return value.toFixed(1);
    },
    from: function (value) {
      return parseFloat(value);
    },
  },
});

function getSliderValue () {
  effectLevelValue.value = effectLevelSlider.noUiSlider.get();
  if (imgUploadPreview.classList[1] === 'effects__preview--chrome') {
    imgUploadPreview.firstElementChild.style.filter=`grayscale(${effectLevelValue.value})`;
  }
  if (imgUploadPreview.classList[1] === 'effects__preview--sepia') {
    imgUploadPreview.firstElementChild.style.filter=`sepia(${effectLevelValue.value})`;
  }
  if (imgUploadPreview.classList[1] === 'effects__preview--marvin') {
    imgUploadPreview.firstElementChild.style.filter=`invert(${effectLevelValue.value}%)`;
  }
  if (imgUploadPreview.classList[1] === 'effects__preview--phobos') {
    imgUploadPreview.firstElementChild.style.filter=`blur(${effectLevelValue.value}px)`;
  }
  if (imgUploadPreview.classList[1] === 'effects__preview--heat') {
    imgUploadPreview.firstElementChild.style.filter=`brightness(${effectLevelValue.value})`;
  }
}

function applyEffect (evt) {
  if (evt.target.closest('.effects__preview')) {
    if (imgUploadPreview.classList.length > 1) {
      imgUploadPreview.classList.remove(imgUploadPreview.classList[1]);
    }
    imgUploadPreview.classList.add(evt.target.classList[1]);

    if (imgUploadPreview.classList[1] === 'effects__preview--none') {
      effectLevelSlider.classList.add('hidden');
      imgUploadPreview.firstElementChild.style.filter='';
    } else {
      effectLevelSlider.classList.remove('hidden');
    }

    if (imgUploadPreview.classList[1] === 'effects__preview--chrome') {
      effectLevelSlider.noUiSlider.updateOptions({
        range: {
          min: 0,
          max: 1,
        },
        start: 1,
        step: 0.1,
      });
    }

    if (imgUploadPreview.classList[1] === 'effects__preview--sepia') {
      effectLevelSlider.noUiSlider.updateOptions({
        range: {
          min: 0,
          max: 1,
        },
        start: 1,
        step: 0.1,
      });
    }

    if (imgUploadPreview.classList[1] === 'effects__preview--marvin') {
      effectLevelSlider.noUiSlider.updateOptions({
        range: {
          min: 0,
          max: 100,
        },
        start: 100,
        step: 1,
      });
    }

    if (imgUploadPreview.classList[1] === 'effects__preview--phobos') {
      effectLevelSlider.noUiSlider.updateOptions({
        range: {
          min: 0,
          max: 3,
        },
        start: 3,
        step: 0.1,
      });
    }

    if (imgUploadPreview.classList[1] === 'effects__preview--heat') {
      effectLevelSlider.noUiSlider.updateOptions({
        range: {
          min: 1,
          max: 3,
        },
        start: 3,
        step: 0.1,
      });
    }
  }
}

uploadFile.addEventListener('change', () => {
  imgUploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  scaleControlSmaller.addEventListener('click', makeScaleSmaller);
  scaleControlBigger.addEventListener('click', makeScaleBigger);
  if (effectNoneInput.checked) {
    effectLevelSlider.classList.add('hidden');
  }
  effectLevelSlider.noUiSlider.on('update', getSliderValue);
  effectsList.addEventListener('click', applyEffect);
  uploadCancel.addEventListener('click', closeFormOnClick);
  document.addEventListener('keydown', closeFormOnKeydown);
  form.addEventListener('submit', validateForm);
});

const closeForm = () => {
  imgUploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  scaleControlSmaller.removeEventListener('click', makeScaleSmaller);
  scaleControlBigger.removeEventListener('click', makeScaleBigger);
  effectLevelSlider.noUiSlider.off();
  effectsList.removeEventListener('click', applyEffect);
  uploadCancel.removeEventListener('click', closeFormOnClick);
  document.removeEventListener('keydown', closeFormOnKeydown);
  form.removeEventListener('submit', validateForm);
  if (imgUploadPreview.classList.length > 1) {
    imgUploadPreview.classList.remove(imgUploadPreview.classList[1]);
  }
  imgUploadPreview.firstElementChild.removeAttribute('style');
  pristine.reset();
};

function closeFormOnClick () {
  closeForm();
}

function closeFormOnKeydown (evt) {
  if (isEscapeKey(evt) && document.activeElement !== textDescription && document.activeElement !== textHashtags) {
    closeForm();
    form.reset();
  }
}
