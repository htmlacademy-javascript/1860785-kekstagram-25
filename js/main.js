function getRandom (min, max) {
  if (min < 0 || max < 0) {
    return 'Отрицательные значения не подходят';
  }
  if (min >= max) {
    return 'Значение max должно быть больше min';
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chechMaxLength (check, maxLength) {
  if (check.length <= maxLength) {
    return true;
  }
  return false;
}

