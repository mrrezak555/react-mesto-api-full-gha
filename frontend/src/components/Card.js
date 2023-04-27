import { CurrentUserContext } from '../contexts/CurrentUserContext';
import React from "react";

function Card(props) {
    const currentUser = React.useContext(CurrentUserContext);
    const isOwn = props.item.owner._id === currentUser._id;
    const isLiked = props.item.likes.some(i => i._id === currentUser._id);
    function handleClick() {
        props.onCardClick(props.item);
    }

    function handleLikeClick() {
        props.onCardLike(props.item);
    }

    function handleDeleteClick() {
        props.onCardDelete(props.item)
    }
    const cardLikeButtonClassName = (`grid__like ${isLiked && 'grid__like_active'}`);
    return (
        <div className="grid__item">
            {isOwn && <button className='grid__trash' onClick={handleDeleteClick} />}
            <img src={props.link} alt={props.name} className="grid__image" onClick={handleClick} />
            <div className="grid__box">
                <h2 className="grid__title">{props.name}</h2>
                <div className="grid__contaner">
                    <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
                    <p className="grid__like-count">{props.likesCount}</p>
                </div>
            </div>
        </div>
    )
}

export default Card;