import { optionsApi } from './utils';

/* Проверка ответа сервера */
const handleResponse = res => res.ok ? res.json() : Promise.reject(`Ошибка ${res.status}`);

/* Регистрация */
export const register = (password, email) => {
  return fetch(`${optionsApi.url}/signup`, {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  })
  .then(handleResponse)
};

/* Авторизация */
export const login = (password, email) => {
  return fetch(`${optionsApi.url}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  })
  .then(handleResponse)
};

/* Проверка токена */
export const checkToken = (token) => {
  return fetch(`${optionsApi.url}/users/me`, {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': "application/json",
      'Authorization': `Bearer ${token}`,
    },
  })
  .then(handleResponse)
};

