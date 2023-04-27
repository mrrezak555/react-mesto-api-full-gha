import PopupWithForm from './PopupWithForm';
import React from "react";
//import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditAvatarPopup(props) {
    const inputRef = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();
        //console.log(inputRef.current.value)
        props.onUpdateAvatar({
            avatar: inputRef.current.value
        });
    }

    return (
        <PopupWithForm
            isOpen={props.isOpen}
            name={'putchAvatar'}
            title={'Обновить аватар'}
            textButton={'Сохранить'}
            handleSubmit={handleSubmit}
            children={
                <>
                    <section className="popup__section popup__section_putch-avatar">
                        <input type="url" className="popup__input" id="avatar" name="avatar" placeholder="Ссылка на аватар" required ref={inputRef} />
                        <span className="popup__input-error"></span>
                    </section>
                </>
            }
            onClose={props.onClose}
        />
    )
}

export default EditAvatarPopup;