import React from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function Card({card, onCardClick, onCardLike, onCardDelete}) {

  const currentUserData = React.useContext(CurrentUserContext);

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card._id);
  }

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id === currentUserData._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    `element__trash ${isOwn ? '' : 'element__trash_hidden'}`
  );


  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some(i => i._id === currentUserData._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (
    `element__like ${isLiked ? 'element__like_active' : ''}`
  );

    return (
      <li className="elements__item element">
        <button className={cardDeleteButtonClassName} aria-label="Удалить" title="Удалить" onClick={handleDeleteClick}></button>
        <img className="element__image" src={card.link} onClick={handleClick} alt={card.name} />
        <div className="element__info">
          <h2 className="element__title">{card.name}</h2>
          <div className="element__like-container">
            <button className={cardLikeButtonClassName} type="button" aria-label="Нравится" title="Нравится" onClick={handleLikeClick}></button>
            <p className="element__like-counter">{card.likes.length}</p>
          </div>
        </div>
      </li>
    );
  }

export default Card;
