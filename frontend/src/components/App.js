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

  const [historyAuth, setHistoryAuth] = React.useState(false);

  const history = useHistory();

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleAuthInfoOpen() {
    setIsInfoOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoOpen(false);
    setSelectedCard({});
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardDelete(id) {
    api.deleteCard(id)
    .then(() => {
      setCards((cards) => cards.filter(card => card._id !== id));
    })
    .catch((err) => {
      console.log(`Ошибка удаления карточки: ${err}`)
    })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      setCards((cards) => cards.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => console.log(err));
  }

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

  function tokenCheck() {
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
  }


  React.useEffect(() => {
    tokenCheck();

    if(localStorage.getItem('jwt')) {
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

  const handleLogin = (password, email) => {
    auth.login(password, email)
      .then(data => {
        if(data.token) {
          setUserData({
            email: email
          });
          localStorage.setItem('jwt', data.token);

          setLoggedIn(true);
          history.push("/main");

        }
      })
      .catch(err => {
        setAuthInfoStatus(false);
        handleAuthInfoOpen();
      });
  }

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
        console.log(err);
        setAuthInfoStatus(false);
        handleAuthInfoOpen();
      });
  }

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
            <Route exact path="*">
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

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
      </CurrentUserContext.Provider>
  );
}

export default App;
