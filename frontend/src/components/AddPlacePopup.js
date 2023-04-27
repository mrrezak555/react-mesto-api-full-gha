import PopupWithForm from './PopupWithForm';
import React from "react";
//import { CurrentUserContext } from '../contexts/CurrentUserContext';

function AddPlacePopup(props) {
    const inputRefCardName = React.useRef();
    const inputRefCardLink = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();
        props.onAddPlace({
            name: inputRefCardName.current.value,
            link: inputRefCardLink.current.value
        });
    }

    return (
        <PopupWithForm
            isOpen={props.isOpen}
            name={'addPopup'}
            title={'Новое место'}
            textButton={'Создать'}
            handleSubmit={handleSubmit}
            children={
                <>
                    <section className="popup__section">
                        <input type="text" className="popup__input" id="new_name" name="name" placeholder="Название" required minLength="2" maxLength="30" ref={inputRefCardName} />
                        <span className="popup__input-error"></span>
                    </section>
                    <section className="popup__section">
                        <input type="url" className="popup__input" id="new_image" name="job" placeholder="Ссылка на картинку" required ref={inputRefCardLink} />
                        <span className="popup__input-error"></span>
                    </section>
                </>
            }
            onClose={props.onClose}
        />
    )
}

export default AddPlacePopup;