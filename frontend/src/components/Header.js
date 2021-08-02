import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import headerLogo from '../images/logo.svg';

function Header(props) {

  return (
    <header className="header">
        <div className="header__logo">
          <a className="header__logo-link" href="/" target="_self" title="На главную">
              <img className="header__logo-img" src={headerLogo} alt="Логотип Место" />
          </a>
        </div>
        <div className="header__info">

            <Switch>
              <Route path="/sign-up">
                <Link className="header__link" to="./sign-in">Войти</Link>
              </Route>
              <Route path="/sign-in">
                <Link className="header__link" to="./sign-up">Регистрация</Link>
              </Route>
            </Switch>

            {props.loggedIn && (
              <>
                <p className="header__email">{props.email}</p>
                <button className="auth-button" onClick={props.onSignOut}>Выйти</button>
              </>)
            }

        </div>
    </header>
  );
}

export default Header;
