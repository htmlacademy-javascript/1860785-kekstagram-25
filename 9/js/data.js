import {getRandom, getRandomArrayElement} from './util.js';

const DESCRIPTIONS_ID_MAX = 25;

const DESCRIPTIONS_URL_MAX = 25;

const DESCRIPTIONS = [
  'Отдыхаю:)',
  'На работе:(',
  'С друзьями:)))',
  'Просто так;)',
];

const DESCRIPTIONS_LIKES_MIN = 15;
const DESCRIPTIONS_LIKES_MAX = 200;

const COMMENTS_ID_MAX = 800;

const COMMENTS_AVATARS_MAX = 6;

const COMMENTS_MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
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
  'Дмитрий',
];

const COMMENTS_MIN = 0;
const COMMENTS_MAX = 50;

const getNumbersArray = (min, max) => {
  const numbers = [];
  for (let i = min - 1; i < max; i++) {
    numbers.push(i + 1);
  }
  return numbers;
};

const descriptionsId = getNumbersArray(1, DESCRIPTIONS_ID_MAX).sort(() => Math.random() - 0.5);

const descriptionsUrl = getNumbersArray(1, DESCRIPTIONS_URL_MAX).sort(() => Math.random() - 0.5);

const commentsId = getNumbersArray(1, COMMENTS_ID_MAX);

const createPhotoComments = () => {
  const comments = [];
  for (let i = 0; i < commentsId.length; i++) {
    comments.push({
      id: commentsId[i],
      avatar: `img/avatar-${getRandom(1, COMMENTS_AVATARS_MAX)}.svg`,
      message: getRandomArrayElement(COMMENTS_MESSAGES),
      name: getRandomArrayElement(COMMENTS_NAMES),
    }
    );
  }
  return comments;
};

const addRandomCountElements = (elements) => elements.splice(0, getRandom(COMMENTS_MIN, COMMENTS_MAX));

const createPhotoDescriptions = (amount) => {
  const photos = [];
  const photoComments = createPhotoComments();
  for (let i = 0; i < amount; i++) {
    photos.push({
      id: descriptionsId[i],
      url: `photos/${descriptionsUrl[i]}.jpg`,
      description: getRandomArrayElement(DESCRIPTIONS),
      likes: getRandom(DESCRIPTIONS_LIKES_MIN, DESCRIPTIONS_LIKES_MAX),
      comments: addRandomCountElements(photoComments),
    });
  }
  return photos;
};

export {createPhotoDescriptions};
