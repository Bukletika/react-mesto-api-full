import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {

  const cardTitle = React.useRef();
  const cardLink = React.useRef();

  function handleSubmit(e) {

    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    props.onAddPlace({
      name:cardTitle.current.value,
      link: cardLink.current.value,
    });

    cardTitle.current.value = '';
    cardLink.current.value = '';
  }

  return (
    <PopupWithForm
        title="Новое место"
        name="card"
        isSubmitting={props.isSubmitting}
        submitBtnText="Создать"
        submitBtnLoadText="Сохранение..."
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}
      >
        <fieldset className="form__card">
          <input className="form__item popup__input form__item_el_title" ref={cardTitle} id="card-title" name="name" type="text" placeholder="Название" minLength="2" maxLength="30" required />
          <span id="card-title-error" className="popup__error"></span>
          <input className="form__item popup__input form__item_el_link" ref={cardLink} id="card-link" name="link" type="url" placeholder="Ссылка на картинку" required />
          <span id="card-link-error" className="popup__error"></span>
        </fieldset>
      </PopupWithForm>
  );
}

export default AddPlacePopup;
