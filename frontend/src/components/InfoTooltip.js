import authOk from '../images/Auth_ok_big.svg'
import authErr from '../images/Auth_er_big.svg'


function InfoTooltip(props) {

    return (
      <div className={`popup ${props.isOpen ? `popup_opened` : ''}`} id={`${props.name}`} >
        <div className="popup__container popup__container_auth">
          <button className="popup__close" type="button" onClick={props.onClose}></button>
          <img src={props.isRightRegistration ? `${authOk}`:`${authErr}`} alt="Статус проверки" className="popup__validation-auth" />
          <h2 className="popup__title popup__title_auth">{props.isRightRegistration ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так!Попробуйте ещё раз.'}</h2>
        </div>
      </div>
    )
  }
  
  export default InfoTooltip;
