import React from 'react';
import { Route, Switch, Redirect, useHistory  } from "react-router-dom";
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Register from './Register';
import Login from './Login';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';
import api from '../utils/api';
import * as auth from "../utils/auth.js";

import {CurrentUserContext} from '../contexts/CurrentUserContext';


function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);

  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  const [authInfoStatus,setAuthInfoStatus ] = React.useState(false);

  const [selectedCard, setSelectedCard] =  React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  const [loggedIn, setLoggedIn] = React.useState(false);

  const [userData, setUserData] = React.useState({
    email: ''
  });

  const history = useHistory();

  /* Получить данные с сервера */
  React.useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getInitialProfile(), api.getInitialCards()])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(cardsData);
        })
        .catch((err) => {
          console.log(`Ошибка: ${err}`)
        })
    }
  }, [loggedIn]);

  /* Проверить токен на уникальность */
  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if(jwt) {
      auth.checkToken(jwt)
        .then((res) => {
          if(res.email) {
            setUserData({
              email: res.email
            });
            setLoggedIn(true);
            history.push('/main');
          }
        })
        .catch((err) => {
          console.log(`Ошибка удаления карточки: ${err}`)
        })
    }
  }, [history])

  /* Открыть окно редактирования аватара пользователя  */
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  /* Открыть окно редактирования профиля пользователя */
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  /* Открыть окно добавления новой карточки */
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  /* Информационный попап */
  function handleAuthInfoOpen() {
    setIsInfoOpen(true);
  }

  /* Закрыть все попапы */
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoOpen(false);
    setSelectedCard({});
  }

  /* Открыть увеличенное фото */
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  /* Удалить карточку */
  function handleCardDelete(id) {
    api.deleteCard(id)
    .then(() => {
      setCards((cards) => cards.filter(card => card._id !== id));
    })
    .catch((err) => {
      console.log(`Ошибка удаления карточки: ${err}`)
    })
  }

  /* Поставить/убрать лайк */
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => console.log(err));
  }

  /* Обновить профиль пользователя */
  function handleUpdateUser(data) {
    setIsSubmitting(true);
    api.editProfile(data)
    .then((result) => {
      setCurrentUser(result);
      closeAllPopups();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setIsSubmitting(false);
    })
  }

  /* Обновить аватар */
  function handleUpdateAvatar(data) {
    setIsSubmitting(true);
    api.editProfileAvatar(data)
    .then((result) => {
      setCurrentUser(result);
      closeAllPopups();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setIsSubmitting(false);
    })
  }

  /* Добавить новую карточку */
  function handleAddPlaceSubmit(data) {
    setIsSubmitting(true);
    api.addCard(data)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => console.log(err))
    .finally(() => {
      setIsSubmitting(false);
    })
  }

  /* Авторизоваться */
  const handleLogin = (password, email) => {
    auth.login(password, email)
      .then(data => {
        if(data.token) {
          setUserData({
            email: email
          });
          setLoggedIn(true);
          localStorage.setItem('jwt', data.token);

          history.push("/main");

        }
      })
      .catch(err => {
        setAuthInfoStatus(false);
        handleAuthInfoOpen();
      });
  }

  /* Зарегистрироваться */
  const handleRegister = (password, email) => {
    auth.register(password, email)
      .then(data => {
        setUserData({
          email: data.email
        });
        setAuthInfoStatus(true);
        handleAuthInfoOpen();
        history.push('/sign-in');
      })
      .catch(err => {
        setAuthInfoStatus(false);
        handleAuthInfoOpen();
      });
  }

  /* Выйти из аккаунта */
  const onSignOut = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push('/sign-in');
  }

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page__container">
          <Header email={userData.email} loggedIn={loggedIn} onSignOut={onSignOut}/>

          <Switch>
            <ProtectedRoute
              path="/main"
              loggedIn={loggedIn}
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardDelete={handleCardDelete}
              handleCardClick={handleCardClick}
              handleCardLike={handleCardLike}
              cards={cards}
            />
            <Route path="/sign-up">
              <Register handleRegister={handleRegister} />
            </Route>
            <Route path="/sign-in">
              <Login handleLogin={handleLogin} />
            </Route>
            <Route exact path="/">
              {loggedIn ? (
                <Redirect to="/main" />
              ) : (
                <Redirect to="/sign-in" />
              )}
            </Route>
          </Switch>
          <Footer />
        </div>

        <InfoTooltip onClose={closeAllPopups} isOpen={isInfoOpen} authInfoStatus={authInfoStatus} />
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isSubmitting={isSubmitting}/>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isSubmitting={isSubmitting}/>
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} isSubmitting={isSubmitting}/>
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

      </CurrentUserContext.Provider>
  );
}

export default App;
