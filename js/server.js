const GET_URL = 'https://25.javascript.pages.academy/kekstagram/data';
const POST_URL = 'https://25.javascript.pages.academy/kekstagram';

const getData = (onSucsess, onFailure) => {
  fetch(GET_URL)
    .then((response) => response.json())
    .then((data) => {
      onSucsess(data);
    })
    .catch(() => {
      onFailure();
    });
};

const setData = (onSuccess, onFailure, body) => {
  fetch(POST_URL, {
    method: 'POST',
    body,
  })
    .then((response) => {
      if (response.ok === true) {
        onSuccess();
      } else {
        onFailure();
      }
    }).catch(() => {
      onFailure();
    });
};

export {getData, setData};
