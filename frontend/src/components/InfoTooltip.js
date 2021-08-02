import React from 'react';
import successImg from '../images/success.svg';
import errorImg from '../images/error.svg';
import closePopup from '../images/close.svg';

function InfoTooltip(props) {

    const className = `${props.isOpen  ? ' popup_opened' : ''}`;

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
      <div className={`popup popup_type_info ${className}`} onClick={props.onClose}>
        <div className="popup__container" onClick={(evt)=> {evt.stopPropagation()}}>
            <button className="popup__close" type="button" onClick={props.onClose}><img className="popup__close-img" src={closePopup} alt="Закрыть окно" /></button>
            {props.authInfoStatus ? (
              <div className="popup__information">
                <img className="popup__info-image" src={successImg} alt="Успешная регистрация"/>
                <p className="popup__text">Вы успешно зарегистрировались</p>
              </div>
            ) : (
              <div className="popup__information">
                <img className="popup__info-image" src={errorImg} alt="Ошибка при регистрации или авторизации"/>
                <p className="popup__text">Что-то пошло не так! Попробуйте еще раз!</p>
              </div>
            )}

        </div>
      </div>
    );
  }

export default InfoTooltip;
