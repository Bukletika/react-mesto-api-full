import React from 'react';
import closePopup from '../images/close.svg';

function PopupWithForm(props) {

    const className = `${props.isOpen  ? ' popup_opened' : ''}`;
    let buttonText = props.submitBtnText;

    if(props.isSubmitting) {
      buttonText = props.submitBtnLoadText;
    }

    React.useEffect(() => {

      if(props.isOpen) {
        function handleEscClose (evt) {
          if(evt.key === 'Escape'){
            props.onClose()
          }
        }

        document.addEventListener('keydown', handleEscClose);

        return () => {
          document.removeEventListener('keydown', handleEscClose);
        };
      }

    }, [props.isOpen]);

    return (
      <div className={`popup popup_type_${props.name} ${className}`} onClick={props.onClose}>
        <div className="popup__container" onClick={(evt)=> {evt.stopPropagation()}}>
            <button className="popup__close" type="button" onClick={props.onClose}><img className="popup__close-img" src={closePopup} alt="Закрыть окно" /></button>
            <form className={`form form-${props.name} popup__form`} onSubmit={props.onSubmit} name={`edit-${props.name}`} >
            <h2 className="form__heading">{props.title}</h2>
            {props.children}
            <button className="form__button popup__button" disabled={props.isSubmitting} type="submit">{buttonText}</button>
          </form>
        </div>
      </div>
    );
  }

export default PopupWithForm;
