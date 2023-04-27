import Header from "./Header";
import { NavLink } from 'react-router-dom';
import React from "react";

function Register(props) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    function handleChangeEmail(e) {
        setEmail(e.target.value);
    }

    function handleChangePassword(e) {
        setPassword(e.target.value)
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();
        setEmail('')
        setPassword('')
        // Передаём значения управляемых компонентов во внешний обработчик
        props.onRegisterUser({
            "password": password,
            "email": email
        });
    }

    return (
        <>
            <Header
                email={""}
                link={"/sign-in"}
                textLink={"Войти"}
            />
            <div className="form-in">
                <h1 className="form-in__title">Регистрация</h1>
                <form className="form-in__form" onSubmit={handleSubmit}>
                    <section className="form-in__section">
                        <input type="text" className="form-in__input" id="email_sign-in" name="email_sign-in" placeholder="Email" required minLength="2" maxLength="40" onChange={handleChangeEmail} value={email || ''}/>
                        <span className="form-in__input-error"></span>
                    </section>
                    <section className="form-in__section">
                        <input type="password" className="form-in__input" id="password_sign-in" name="password_sign-in" placeholder="Пароль" required minLength="2" maxLength="200" onChange={handleChangePassword} value={password || ''} />
                        <span className="form-in__input-error"></span>
                    </section>
                    <button type="submit" className="form-in__submit">Зарегистрироваться</button>
                </form>
                <NavLink to="/sign-in" className="form-in__link">Уже зарегистрированы? Войти</NavLink>
            </div>
        </>
    )
}

export default Register;