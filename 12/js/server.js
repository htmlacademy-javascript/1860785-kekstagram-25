const getData = (onSucsessFirst, onSucsessSecond, onFailure) => {
  fetch('https://25.javascript.pages.academy/kekstagram/data')
    .then((response) => response.json())
    .then((data) => {
      onSucsessFirst(data);
      onSucsessSecond(data);
    })
    .catch(() => {
      onFailure();
    });
};

const setData = (onSuccess, onFailure, body) => {
  fetch('https://25.javascript.pages.academy/kekstagram', {
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
