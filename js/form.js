import {isEscapeKey} from './util.js';
import {setData} from './server.js';

const AVAILABLE_FILE_TYPES = ['jpeg', 'jpg', 'png'];
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
const submitButton = form.querySelector('.img-upload__submit');
const selectedImgClassListIndex = selectedImg.classList.length;
const regularExpression = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;


const pristine = window.Pristine(form);

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

const onScaleControlSmallerClick = () => {
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

const onScaleControlBiggerClick = () => {
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

const onEffectsItemClick = (evt) => {
  if (evt.target.closest('.effects__preview')) {
    if (selectedImg.classList.length > selectedImgClassListIndex) {
      selectedImg.classList.remove(selectedImg.classList[selectedImgClassListIndex]);
    }

    evt.target.classList.forEach((item) => {
      if (item.includes('effects__preview--')) {
        selectedImg.classList.add(item);
      }
    });

    switch (selectedImg.classList[selectedImgClassListIndex]) {

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

      default:
        effectLevelSlider.classList.add('hidden');
        selectedImg.style.filter='';
    }
  }
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const onSuccess = () => {

  unblockSubmitButton();
  closeForm();

  body.insertAdjacentHTML('beforeend', `
    <section class="success">
      <div class="success__inner">
        <h2 class="success__title">Изображение успешно загружено</h2>
        <button type="button" class="success__button">Круто!</button>
      </div>
    </section>`);

  const successSection = body.querySelector('.success');
  const successMessage = successSection.querySelector('.success__inner');
  const successButton = successMessage.querySelector('.success__button');

  const onSuccessButtonClick = () => {
    closeSuccessMessage();
  };

  const onSuccessMessageEscKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      closeSuccessMessage();
    }
  };

  const onSuccessSectionClick = (evt) => {
    if (evt.target === successSection) {
      closeSuccessMessage();
    }
  };

  successButton.addEventListener('click', onSuccessButtonClick);
  successSection.addEventListener('click', onSuccessSectionClick);
  document.addEventListener('keydown', onSuccessMessageEscKeydown);

  function closeSuccessMessage () {
    successSection.remove();
    successSection.removeEventListener('click', onSuccessSectionClick);
    document.removeEventListener('keydown', onSuccessMessageEscKeydown);
    form.reset();
  }
};

const onError = () => {

  unblockSubmitButton();
  closeForm();

  body.insertAdjacentHTML('beforeend', `
    <section class="error">
      <div class="error__inner">
        <h2 class="error__title">Ошибка загрузки файла</h2>
        <button type="button" class="error__button">Загрузить другой файл</button>
      </div>
    </section>`);

  const errorSection = body.querySelector('.error');
  const errorMessage = errorSection.querySelector('.error__inner');
  const errorButton = errorMessage.querySelector('.error__button');

  const onErrorButtonClick = () => {
    closeErrorMessage();
  };

  const onErrorMessageEscKeydown = (evt) => {
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
  document.addEventListener('keydown', onErrorMessageEscKeydown);

  function closeErrorMessage () {
    errorSection.remove();
    errorSection.removeEventListener('click', onErrorSectionClick);
    document.removeEventListener('keydown', onErrorMessageEscKeydown);
    form.reset();
  }
};

const onFormSubmit = (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid) {
    blockSubmitButton();
    setData(onSuccess, onError, new FormData(evt.target));
  }
};

uploadFile.addEventListener('change', () => {
  if (body.clientWidth !== window.innerWidth) {
    const scrollbarWidth = window.innerWidth - body.clientWidth;
    body.style.paddingRight = `${scrollbarWidth}px`;
  }
  imgUploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  const file = uploadFile.files[0];
  const fileName = file.name.toLowerCase();
  const matches = AVAILABLE_FILE_TYPES.some((it) => fileName.endsWith(it));
  if (matches) {
    selectedImg.src = URL.createObjectURL(file);
  }
  scaleControlValue.value = `${MAX_SCALE_CONTROL}%`;
  selectedImg.style.transform=`scale(${MAX_SCALE_CONTROL / 100})`;
  scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);
  if (effectNoneInput.checked) {
    effectLevelSlider.classList.add('hidden');
  }
  effectLevelSlider.noUiSlider.on('update', getSliderValue);
  effectsList.addEventListener('click', onEffectsItemClick);
  uploadCancel.addEventListener('click', onUploadCancelClick);
  document.addEventListener('keydown', onFormEscKeydown);
  form.addEventListener('submit', onFormSubmit);
});

function closeForm () {
  imgUploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  body.style.paddingRight = '';
  scaleControlSmaller.removeEventListener('click', onScaleControlSmallerClick);
  scaleControlBigger.removeEventListener('click', onScaleControlBiggerClick);
  effectLevelSlider.noUiSlider.off();
  effectsList.removeEventListener('click', onEffectsItemClick);
  uploadCancel.removeEventListener('click', onUploadCancelClick);
  document.removeEventListener('keydown', onFormEscKeydown);
  form.removeEventListener('submit', onFormSubmit);
  if (selectedImg.classList.length > selectedImgClassListIndex) {
    selectedImg.classList.remove(selectedImg.classList[selectedImgClassListIndex]);
  }
  selectedImg.removeAttribute('style');
  pristine.reset();
}

function onUploadCancelClick () {
  closeForm();
}

function onFormEscKeydown (evt) {
  if (isEscapeKey(evt) && document.activeElement !== textDescription && document.activeElement !== textHashtags) {
    closeForm();
    form.reset();
  }
}
