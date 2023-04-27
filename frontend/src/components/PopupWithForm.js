

function PopupWithForm(props) {


  return (
    <div className={`popup ${props.isOpen ? `popup_opened` : ''}`} id={`${props.name}`} >
      <div className="popup__container">
        <button className="popup__close" type="button" onClick={props.onClose}></button>
        <h2 className="popup__title">{props.title}</h2>
        <form className="popup__form" name={props.name} method="post" onSubmit={props.handleSubmit}>
          {props.children}
          <button type="submit" className="popup__submit">{props.textButton}</button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm;