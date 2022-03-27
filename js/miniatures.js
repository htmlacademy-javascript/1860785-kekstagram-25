const templatePicture = document.querySelector('#picture').content.querySelector('.picture');
const picturesBlock = document.querySelector('.pictures');

const picturesFragment = document.createDocumentFragment();

const addThumbnails = (photoDescriptions) => {
  photoDescriptions.forEach(({url, likes, comments}) => {
    const picture = templatePicture.cloneNode(true);
    picture.querySelector('.picture__img').src = url;
    picture.querySelector('.picture__likes').textContent = likes;
    picture.querySelector('.picture__comments').textContent = comments.length;
    picturesFragment.append(picture);
  });
  picturesBlock.append(picturesFragment);
};

export {addThumbnails};
