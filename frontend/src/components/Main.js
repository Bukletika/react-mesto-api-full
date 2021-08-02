import React from 'react';
import Card from './Card';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function Main(props) {

    const currentUserData = React.useContext(CurrentUserContext);
    const handleCardClick = props.handleCardClick;
    const handleCardLike = props.handleCardLike;
    const handleDeleteClick = props.onCardDelete;

    return (
      <>
      <main className="content">
        <section className="profile">
          <div className="profile__avatar">
            <img className="profile__img" src={currentUserData.avatar} alt="Аватар пользователя" />
            <button className="profile__button" onClick={props.onEditAvatar}></button>
          </div>
          <div className="profile__info">
            <h1 className="profile__title">{currentUserData.name}</h1>
            <p className="profile__subtitle">{currentUserData.about}</p>
            <button className="profile__edit-button" id="profile-edit" type="button" title="Редактировать профиль" onClick={props.onEditProfile}></button>
          </div>
          <button className="profile__add-button" id="card-add" type="button" title="Добавить карточку" onClick={props.onAddPlace}></button>
        </section>

        <section className="elements">
          <ul className="elements__list">
            {
              props.cards.map((props)=> {
                return(
                  <Card
                  key={props._id}
                  card={props}
                  onCardLike={handleCardLike}
                  onCardClick={handleCardClick}
                  onCardDelete={handleDeleteClick}
                  />
                )
              })
            }
          </ul>
        </section>

      </main>

     </>
    );
  }

export default Main;


