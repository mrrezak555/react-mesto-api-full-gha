import PopupWithForm from './PopupWithForm';
import React from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {
    const [nameInForm, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const currentUser = React.useContext(CurrentUserContext);
    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    }, [currentUser, props.isOpen]);

    function handleChangeName(e) {
        setName(e.target.value);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value)
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();

        // Передаём значения управляемых компонентов во внешний обработчик
        props.onUpdateUser({
            name: nameInForm,
            about: description,
        });
    }

    //console.log(nameInForm)

    return (
        <PopupWithForm
            isOpen={props.isOpen}
            name={'popupEdit'}
            title={'Редактировать профиль'}
            textButton={'Сохранить'}
            onSubmit={props.onSubmit}

            handleSubmit={handleSubmit}
            children={
                <>
                    <section className="popup__section">
                        <input type="text" className="popup__input" id="name" name="name" placeholder="Имя" required minLength="2" maxLength="40" value={nameInForm || ''} onChange={handleChangeName} />
                        <span className="popup__input-error"></span>
                    </section>
                    <section className="popup__section">
                        <input type="text" className="popup__input" id="job" name="job" placeholder="О себе" required minLength="2" maxLength="200" value={description || ''} onChange={handleChangeDescription} />
                        <span className="popup__input-error"></span>
                    </section>
                </>
            }
            onClose={props.onClose}
        />
    )
}

export default EditProfilePopup;