import React from 'react';

function Login({ handleLogin }) {

  const [data, setData] = React.useState({
    email: "",
    password: "",
  })

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setData({
      ...data,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const { password, email } = data;
    handleLogin(password, email);
  }

  return (
    <div className='auth'>
      <form className="form auth__form" name={`edit-login`} onSubmit={handleSubmit} >
        <div className="auth__container">
          <h2 className="form__heading form__heading_type_auth">Вход</h2>
          <input className="form__item form__item_el_mail" id="login-mail" value={data.email || ''} onChange={handleChange} name="email" type="email" placeholder="Email" minLength="2" required />
          <input className="form__item form__item_el_password"  id="login-password" value={data.password || ''} onChange={handleChange} name="password" type="password" autoComplete="off" placeholder="Пароль" minLength="2" maxLength="200" required />
        </div>
        <button className="form__button auth__button" type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;
