const DESCRIPTIONS = [
  'Отдыхаю:)',
  'На работе:(',
  'С друзьями:)))',
  'Просто так;)'
];

const COMMENTS_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const COMMENTS_NAMES = [
  'Варвара',
  'Мария',
  'Александр',
  'Василиса',
  'Алиса',
  'Михаил',
  'София',
  'Иван',
  'Андрей',
  'Дмитрий'
];

const getNumbersArray = (min, max) => {
  const numbers = [];
  for (let i = min - 1; i < max; i++) {
    numbers[i] = i + 1;
  }
  return numbers;
};

const descriptionsId = getNumbersArray(1, 25).sort(() => Math.random() - 0.5);

const descriptionsUrl = getNumbersArray(1, 25).sort(() => Math.random() - 0.5);

const commentsId = getNumbersArray(1, 25);

const getRandom = (min, max) => {
  if (min < 0 || max < 0) {
    return 'Отрицательные значения не подходят';
  }
  if (min >= max) {
    return 'Значение max должно быть больше min';
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const checkMaxLength = (check, maxLength) => {
  if (check.length <= maxLength) {
    return true;
  }
  return false;
};

checkMaxLength('123', 5);

const createPhotoComments = () => {
  const comments = [];
  for (let i = 0; i < commentsId.length; i++) {
    comments[i] = {
      id: commentsId[i],
      avatar: `img/avatar-${  getRandom(1, 6)  }.svg`,
      message: COMMENTS_MESSAGES[getRandom(0, 5)],
      name: COMMENTS_NAMES[getRandom(0, 9)],
    };
  }
  return comments;
};

const createPhotoDescriptions = (amount) => {
  const photos = [];
  for (let i = 0; i < amount; i++) {
    photos[i] = {
      id: descriptionsId[i],
      url: `photos/${  descriptionsUrl[i]  }.jpg`,
      description: DESCRIPTIONS[getRandom(0, 3)],
      likes: getRandom(15, 200),
      comments: createPhotoComments()[i],
    };
  }
  return photos;
};

createPhotoDescriptions(25);


