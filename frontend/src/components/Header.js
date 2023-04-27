import logo from '../images/logo.svg'
import { NavLink } from 'react-router-dom';
import React from "react";



function Header(props) {
  const [activeMenu, setActiveMenu] = React.useState(false)

  function openMenu() {
    props.handleActiveMenu();
  }

  return (
    <header className="header">
      {(props.activeMenu && props.isMobile) ? (
        <div className="header__info header__info_active">
          <p className='header__email header__email_active'>{props.email}</p>
          <NavLink to={props.link} className="header__change header__change_active">{props.textLink}</NavLink>
        </div>
      ) : ('')}
      <div className='header__container'>
        <img src={logo} alt="Лого Место" className="header__logo" />
        {props.isMobile ? (<><button className={`header__burger-menu ${props.activeMenu ? `header__burger-menu_close` : ''}`} type="button" onClick={openMenu}></button></>)
          :
          (<>
            <div className="header__info">
              <p className='header__email'>{props.email}</p>
              <NavLink to={props.link} className="header__change" onClick={props.onLogOut}>{props.textLink}</NavLink>
            </div>
          </>)}
      </div>
    </header>
  );
}

export default Header;