import { optionsApi } from './utils';

class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  /* Проверить ответ сервера */
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject("Произошла ошибка");
  }

  /* Получить данные пользователя */
  getInitialProfile() {
    const token = localStorage.getItem('jwt');

    return fetch(`${this._url}/users/me`, {
      headers: {
        ...this._headers,
        'authorization': `Bearer ${token}`,
      }
    })
    .then(this._checkResponse);
  }

  /* Получить карточки с сервера */
  getInitialCards() {
    const token = localStorage.getItem('jwt');

    return fetch(`${this._url}/cards`, {
      headers: {
        ...this._headers,
        'authorization': `Bearer ${token}`,
      }
    })
    .then(this._checkResponse);
  }

  /* Изменить профиль пользователя */
  editProfile(data) {
    const token = localStorage.getItem('jwt');

    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: {
        ...this._headers,
        'authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    })
    .then(this._checkResponse);
  }

  /* Изменить аватар пользователя */
  editProfileAvatar(data) {
    const token = localStorage.getItem('jwt');

    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        ...this._headers,
        'authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data)
    })
    .then(this._checkResponse);
  }

  /* Добавить новую карточку */
  addCard(data) {
    const token = localStorage.getItem('jwt');

    return fetch(`${this._url}/cards`, {
        method: "POST",
        headers: {
          ...this._headers,
          'authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
    .then(this._checkResponse);
  }

  /* Удалить карточку */
  deleteCard(id) {
    const token = localStorage.getItem('jwt');

    return fetch(`${this._url}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        ...this._headers,
        'authorization': `Bearer ${token}`,
      },
    })
    .then(this._checkResponse);
  }

  /* Поставить/убрать лайк */
  changeLikeCardStatus(dataId, isLiked) {
    const token = localStorage.getItem('jwt');

    if(isLiked) {
      return fetch(`${this._url}/cards/${dataId}/likes`, {
        method: "PUT",
        headers: {
          ...this._headers,
          'authorization': `Bearer ${token}`,
        },
      })
      .then(this._checkResponse);
    }else{
      return fetch(`${this._url}/cards/${dataId}/likes`, {
        method: "DELETE",
        headers: {
          ...this._headers,
          'authorization': `Bearer ${token}`,
        },
      })
      .then(this._checkResponse);
    }
  }

}

const api = new Api(optionsApi);

export default api;
