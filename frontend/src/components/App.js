//import logo from './logo.svg';
//import profilePhoto from '../images/Avatar.png'
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import React from "react";
//import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import { api } from '../utils/Api'
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { CardContext } from '../contexts/CardContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import { useState, useEffect } from 'react';
import InfoTooltip from './InfoTooltip';
import { auth } from '../utils/Auth';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [activeMenu, setActiveMenu] = React.useState(false)
  const [width, setWidth] = React.useState(window.innerWidth);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isRightRegistration, setRightRegistration] = React.useState(true);
  const [email, setEmail] = React.useState('');
  const navigate = useNavigate();


  //Размер экрана для бургер-меню
  useEffect(() => {
    const handleResize = (event) => {
      setWidth(event.target.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  React.useEffect(() => {
    if (loggedIn){
      api.getUserInfo()
      .then((data) => {
        setCurrentUser(data.userData)
        //console.log(currentUser.avatar)
      })
      .catch((err) => {
        console.log(`Ошибка. Запрос не выполнен ${err}`);
      })
    }

  }, [loggedIn]);

  React.useEffect(() => {
    if (loggedIn) {
      api.getInitialCards()
        .then((data) => {
          //console.log(data)
          setCards(data)
        })
        .catch((err) => {
          console.log(`Ошибка. Запрос не выполнен ${err}`);
        })
    }
  }, [loggedIn]);

  useEffect(() => {
    tokenCheck();
  }, [])

  function tokenCheck() {
    if (localStorage.getItem('jwt')) {
      const jwt = localStorage.getItem('jwt');
      //console.log(jwt);
      if (jwt) {
        // проверим токен
        auth.checkToken(jwt).then((res) => {
          if (res) {
            // авторизуем пользователя
            api.setToken(jwt);
            setLoggedIn(true);
            setEmail(res.userData.email)
          }
        })
        .catch((err) => {
          console.log(`Ошибка. Запрос не выполнен ${err}`);
        });
      }
    }
  }


  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setInfoTooltipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    //console.log(card)
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api.addLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((err) => {
          console.log(`Ошибка. Запрос не выполнен ${err}`);
        });
    }
    else {
      api.removeLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        }).catch((err) => {
          console.log(`Ошибка. Запрос не выполнен ${err}`);
        })
        .catch((err) => {
          console.log(`Ошибка. Запрос не выполнен ${err}`);
        });
    }
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then((data) => {
        setCards((state) => state.filter((c) => c._id !== card._id))
      })
      .catch((err) => {
        console.log(`Ошибка. Запрос не выполнен ${err}`);
      })
  }

  function handleSubmitProfile(profileInfo) {
    api.editProfile(profileInfo)
      .then((data) => {
        setCurrentUser(data)
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`Ошибка. Запрос не выполнен ${err}`);
      })
  }

  function handleUpdateAvatar(link) {
    api.changeAvatar(link.avatar)
      .then((data) => {
        setCurrentUser(data.data)
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`Ошибка. Запрос не выполнен ${err}`);
      })
  }

  function hadleAddPlace(data) {
    api.addNewCard(data)
      .then((data) => {
        setCards([data.card, ...cards]);
        closeAllPopups()
      })
      .catch((err) => {
        console.log(`Ошибка. Запрос не выполнен ${err}`);
      })
  }

  function handleActiveMenu() {
    setActiveMenu(!activeMenu);
  }

  function handleSubmitRegister(dataReg) {
    auth.register(dataReg)
      .then((data) => {
        setRightRegistration(true);
        setInfoTooltipOpen(true);
        navigate("/sign-in", { replace: true })
      })
      .catch((err) => {
        console.log(`Ошибка. Запрос не выполнен ${err}`);
        setRightRegistration(false);
        setInfoTooltipOpen(true);
      })
  }

  function handleSubmitLogin(data1) {
    auth.login(data1)
      .then((data) => {
        setLoggedIn(true)
        setEmail(data1.email)
        localStorage.setItem('jwt', data.token)
        api.setToken(data.token)
        //console.log(data.token)
      })
      .catch((err) => {
        console.log(`Ошибка. Запрос не выполнен ${err}`);
        setRightRegistration(false);
        setInfoTooltipOpen(true);
      })
  }

  function handleLogOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CardContext.Provider value={cards}>
        {loggedIn ? <Header
          email={email}
          link={"/sign-in"}
          textLink={"Выйти"}
          isMobile={width <= 580}
          handleActiveMenu={handleActiveMenu}
          activeMenu={activeMenu}
          loggedIn={loggedIn}
          onLogOut={handleLogOut}
        /> : ''}
        <Routes>

          <Route path="/" element={<ProtectedRoute element={Main}
            handleEditAvatarClick={handleEditAvatarClick}
            handleEditProfileClick={handleEditProfileClick}
            handleAddPlaceClick={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={loggedIn} />} />
          <Route path="/sign-in" element={loggedIn ? <Navigate to="/" replace /> : <Login onLoginUser={handleSubmitLogin} />} />
          <Route path="/sign-up" element={loggedIn ? <Navigate to="/" replace /> : <Register onRegisterUser={handleSubmitRegister} />} />
        </Routes>
        {loggedIn ? <Footer /> : ''}
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleSubmitProfile} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={hadleAddPlace} />
        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} isRightRegistration={isRightRegistration} />
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups} />
      </CardContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
