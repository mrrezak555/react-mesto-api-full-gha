import Header from "./Header";
import React from "react";

function Login(props) {
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
        setPassword('')
        // Передаём значения управляемых компонентов во внешний обработчик
        props.onLoginUser({
            "password": password,
            "email": email
        });
    }

    return (
        <>
            <Header
                email={""}
                link={"/sign-up"}
                textLink={"Регистрация"}
            />
            <div className="form-in">
                <h1 className="form-in__title">Вход</h1>
                <form className="form-in__form" onSubmit={handleSubmit}>
                    <section className="form-in__section">
                        <input type="text" className="form-in__input" id="email_sign-in" name="email_sign-in" placeholder="Email" required minLength="2" maxLength="40" onChange={handleChangeEmail} />
                        <span className="form-in__input-error"></span>
                    </section>
                    <section className="form-in__section">
                        <input type="password" className="form-in__input" id="password_sign-in" name="password_sign-in" placeholder="Пароль" required minLength="2" maxLength="200" onChange={handleChangePassword} value={password || ''}/>
                        <span className="form-in__input-error"></span>
                    </section>
                    <button type="submit" className="form-in__submit">Войти</button>
                </form>
            </div>
        </>
    )
}

export default Login;