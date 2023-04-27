//import profilePhoto from '../images/Avatar.png'
import React from "react";
import { api } from '../utils/Api'
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardContext } from '../contexts/CardContext';

function Main(props) {
    const currentUser = React.useContext(CurrentUserContext);
    const cards = React.useContext(CardContext);

    return (
        <>
            <main>
                <section className="profile">
                    <button className="profile__button-avatar" type="button" onClick={props.handleEditAvatarClick} >
                        <img src={currentUser.avatar} alt="Аватар" className="profile__avatar" />
                    </button>
                    <div className="profile__info">
                        <h1 className="profile__name">{currentUser.name}</h1>
                        <button className="profile__edit-button" type="button" onClick={props.handleEditProfileClick}></button>
                        <p className="profile__occupation">{currentUser.about}</p>
                    </div>
                    <button className="profile__add-button" type="button" onClick={props.handleAddPlaceClick}></button>
                </section>
                <section className="grid">
                    {
                        cards.map((item) => {
                            //console.log(item.likes.length)
                            //console.log(item.likes.some(i => i._id === currentUser._id))
                            //console.log(isLikedItem)
                            return (
                                <Card
                                    link={item.link}
                                    key={item._id}
                                    name={item.name}
                                    likesCount={item.likes.length}
                                    onCardClick={props.onCardClick}
                                    onCardLike={props.onCardLike}
                                    onCardDelete={props.onCardDelete}
                                    item={item}
                                />
                            );
                        })

                    }
                </section>
            </main>
        </>
    )
}

export default Main;