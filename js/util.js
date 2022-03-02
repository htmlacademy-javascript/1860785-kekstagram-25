const checkMaxLength = (check, maxLength) => {
  if (check.length <= maxLength) {
    return true;
  }
  return false;
};

checkMaxLength('123', 5);

const getRandom = (min, max) => {
  if (min < 0 || max < 0) {
    return 'Отрицательные значения не подходят';
  }
  if (min >= max) {
    return 'Значение max должно быть больше min';
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayElement = (elements) => elements[getRandom(0, elements.length - 1)];

export {getRandom, getRandomArrayElement};
