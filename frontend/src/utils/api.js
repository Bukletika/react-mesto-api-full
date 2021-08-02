class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Произошла ошибка");
  }

  getInitialProfile() {
    return fetch(`${this._url}/users/me`, {
      headers: this._headers
    })
    .then(this._checkResponse);
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._headers
    })
    .then(this._checkResponse);
  }

  editProfile(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data)
    })
    .then(this._checkResponse);
  }

  editProfileAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify(data)
    })
    .then(this._checkResponse);
  }

  addCard(data) {
    return fetch(`${this._url}/cards`, {
        method: "POST",
        headers: this._headers,
        body: JSON.stringify(data),
    })
    .then(this._checkResponse);
  }

  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
        method: "DELETE",
        headers: this._headers,
    })
    .then(this._checkResponse);
  }

  changeLikeCardStatus(dataId, isLiked) {
    if(isLiked) {
      return fetch(`${this._url}/cards/likes/${dataId}`, {
        method: "PUT",
        headers: this._headers
      })
      .then(this._checkResponse);
    }else{
      return fetch(`${this._url}/cards/likes/${dataId}`, {
        method: "DELETE",
        headers: this._headers
      })
      .then(this._checkResponse);
    }
  }

  likeCard(dataId) {
    return fetch(`${this._url}/cards/likes/${dataId}`, {
        method: "PUT",
        headers: this._headers
    })
    .then(this._checkResponse);
  }

  dislikeCard(dataId) {
    return fetch(`${this._url}/cards/likes/${dataId}`, {
        method: "DELETE",
        headers: this._headers
    })
    .then(this._checkResponse);
  }

}

const api = new Api({
  url: "https://mesto.nomoreparties.co/v1/cohort-23",
  headers: { authorization: '528d5e73-a9a5-4772-abda-cd25c7cb79ab', 'Content-Type': 'application/json'},
});

export default api;
