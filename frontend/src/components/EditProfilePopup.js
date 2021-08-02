import React from 'react';
import PopupWithForm from './PopupWithForm';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {

  const currentUserData = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  React.useEffect(() => {
    setName(currentUserData.name);
    setDescription(currentUserData.about);
  }, [currentUserData, props.isOpen]);

  function handleChangeName(e) {
    setName(e.target.value);
  }

  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onUpdateUser({
      name,
      about: description,
    });
  }

    return (
      <PopupWithForm
        title="Редактировать профиль"
        name="profile"
        isSubmitting={props.isSubmitting}
        submitBtnText="Сохранить"
        submitBtnLoadText="Сохранение..."
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}
      >
        <fieldset className="form__author">
          <input className="form__item popup__input form__item_el_name" value={name || ''} onChange={handleChangeName} id="profile-name" name="name" type="text" placeholder="Имя" minLength="2"  maxLength="40" required />
          <span id="profile-name-error" className="popup__error">Вы пропустили это поле</span>
          <input className="form__item popup__input form__item_el_about" onChange={handleChangeDescription} value={description || ''} id="profile-about" name="about" type="text" placeholder="О себе" minLength="2" maxLength="200" required />
          <span id="profile-about-error" className="popup__error"></span>
        </fieldset>
      </PopupWithForm>

    );
}

export default EditProfilePopup;
