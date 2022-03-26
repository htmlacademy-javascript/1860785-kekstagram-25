import {isEscapeKey} from './util.js';

const MAX_HASHTAGS_NUMBER = 5;
const MIN_SCALE_CONTROL = 25;
const MAX_SCALE_CONTROL = 100;
const SCALE_CONTROL_STEP = 25;

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
const effectsList = form.querySelector('.effects__list');
const effectLevelSlider = form.querySelector('.effect-level__slider');
const effectLevelValue = form.querySelector('.effect-level__value');
const effectNoneInput = form.querySelector('#effect-none');
const selectedImg = form.querySelector('img');
const selectedImgClassListIndex = selectedImg.classList.length;
const regularExpression = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;


const pristine = new Pristine(form);

pristine.addValidator(textHashtags, () => {
  const arrayHashtags = textHashtags.value.split(' ');
  if (arrayHashtags.length > MAX_HASHTAGS_NUMBER) {
    return false;
  }
  return true;
}, `Максимальное количество хэш-тегов ${MAX_HASHTAGS_NUMBER}`, 1, true);

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

const validateForm = (evt) => {
  const isValid = pristine.validate();
  if (!isValid) {
    evt.preventDefault();
  }
};

const makeScaleSmaller = () => {
  let scaleControlNumberValue = scaleControlValue.value.slice(0, scaleControlValue.value.length - 1);
  scaleControlNumberValue = Number(scaleControlNumberValue);
  scaleControlNumberValue -= SCALE_CONTROL_STEP;
  if (scaleControlNumberValue >= MIN_SCALE_CONTROL) {
    scaleControlValue.value = `${scaleControlNumberValue}%`;
    selectedImg.style.transform=`scale(${scaleControlNumberValue / 100})`;
  } else {
    scaleControlValue.value = `${MIN_SCALE_CONTROL}%`;
  }
};

const makeScaleBigger = () => {
  let scaleControlNumberValue = scaleControlValue.value.slice(0, scaleControlValue.value.length - 1);
  scaleControlNumberValue = Number(scaleControlNumberValue);
  scaleControlNumberValue += SCALE_CONTROL_STEP;
  if (scaleControlNumberValue < MAX_SCALE_CONTROL) {
    scaleControlValue.value = `${scaleControlNumberValue}%`;
    selectedImg.style.transform=`scale(${scaleControlNumberValue / 100})`;
  } else {
    scaleControlValue.value = `${MAX_SCALE_CONTROL}%`;
    selectedImg.style.transform=`scale(${MAX_SCALE_CONTROL / 100})`;
  }
};

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

const getSliderValue = () => {
  effectLevelValue.value = effectLevelSlider.noUiSlider.get();
  switch (selectedImg.classList[selectedImgClassListIndex]) {
    case 'effects__preview--chrome':
      selectedImg.style.filter=`grayscale(${effectLevelValue.value})`;
      break;
    case 'effects__preview--sepia':
      selectedImg.style.filter=`sepia(${effectLevelValue.value})`;
      break;
    case 'effects__preview--marvin':
      selectedImg.style.filter=`invert(${effectLevelValue.value}%)`;
      break;
    case 'effects__preview--phobos':
      selectedImg.style.filter=`blur(${effectLevelValue.value}px)`;
      break;
    case 'effects__preview--heat':
      selectedImg.style.filter=`brightness(${effectLevelValue.value})`;
      break;
  }
};

const applyEffect = (evt) => {
  if (evt.target.closest('.effects__preview')) {
    if (selectedImg.classList.length > selectedImgClassListIndex) {
      selectedImg.classList.remove(selectedImg.classList[selectedImgClassListIndex]);
    }
    selectedImg.classList.add(evt.target.classList[1]);

    switch (selectedImg.classList[selectedImgClassListIndex]) {

      case 'effects__preview--none':
        effectLevelSlider.classList.add('hidden');
        selectedImg.style.filter='';
        break;

      case 'effects__preview--chrome':
        effectLevelSlider.classList.remove('hidden');
        effectLevelSlider.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: 1,
          },
          start: 1,
          step: 0.1,
        });
        break;

      case 'effects__preview--sepia':
        effectLevelSlider.classList.remove('hidden');
        effectLevelSlider.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: 1,
          },
          start: 1,
          step: 0.1,
        });
        break;

      case 'effects__preview--marvin':
        effectLevelSlider.classList.remove('hidden');
        effectLevelSlider.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: 100,
          },
          start: 100,
          step: 1,
        });
        break;

      case 'effects__preview--phobos':
        effectLevelSlider.classList.remove('hidden');
        effectLevelSlider.noUiSlider.updateOptions({
          range: {
            min: 0,
            max: 3,
          },
          start: 3,
          step: 0.1,
        });
        break;

      case 'effects__preview--heat':
        effectLevelSlider.classList.remove('hidden');
        effectLevelSlider.noUiSlider.updateOptions({
          range: {
            min: 1,
            max: 3,
          },
          start: 3,
          step: 0.1,
        });
        break;
    }
  }
};

uploadFile.addEventListener('change', () => {
  imgUploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  scaleControlValue.value = `${MAX_SCALE_CONTROL}%`;
  selectedImg.style.transform=`scale(${MAX_SCALE_CONTROL / 100})`;
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
  if (selectedImg.classList.length > selectedImgClassListIndex) {
    selectedImg.classList.remove(selectedImg.classList[selectedImgClassListIndex]);
  }
  selectedImg.removeAttribute('style');
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
