import React from 'react';

const Modal = (props) => {
    return (
        <div className='modal'>
            <header className='modal__header'>{props.title}</header>
            <section className='modal__content'>
                {props.children}
            </section>
            <section className='modal__actions'>
                {props.canCancel && <div className='button' onClick={props.onCancel}>Cancel</div>}
                {props.canConfirm && <div className='button' onClick={props.onConfirm}>{props.confirmText}</div>}
            </section>
        </div>
    )
};

export default Modal;