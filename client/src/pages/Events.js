import React, { useState, useRef, useContext } from 'react';
import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop';
import AuthContext from '../context/auth-context';

const Events = () => {
    const [creating, setCreating] = useState(false);

    let contextValue = useContext(AuthContext);

    const titleRef = useRef();
    const priceRef = useRef();
    const dateRef = useRef();
    const descriptionRef = useRef();

    const createEventHandler = () => {
        setCreating(!creating);
    };

    const confirmHandler = () => {
        const title = titleRef.current.value;
        const price = +priceRef.current.value;
        const date = dateRef.current.value;
        const description = descriptionRef.current.value;

        if(title.trim().length === 0 ||
            date.trim().length === 0 ||
            price <= 0 ||
            description.trim().length === 0) {
            return;
        }

        const requestBody = {
            query: `
                mutation {
                    createEvent(eventInput:{title:"${title}", description:"${description}", price:${price}, date:"${date}"}){
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            email
                            _id
                        }
                    }
                }
            `
        };

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + contextValue.token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData)
        })
        .catch(err => {
            console.log(err);
        });

        const event = { title, price, date, description };
    };



    return (
        <>
        { creating &&  <Backdrop /> }
        { creating && 
            <Modal 
                canConfirm 
                canCancel 
                onConfirm={confirmHandler} 
                onCancel={createEventHandler}
            >
                <form>
                    <div className="form-control">
                        <label htmlFor="title">Title</label>
                        <input type="text" id='title' ref={titleRef}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="price">Price</label>
                        <input type="number" id='price' ref={priceRef}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input type="datetime-local" id='date' ref={dateRef}/>
                    </div>
                    <div className="form-control">
                        <label htmlFor="description">Description</label>
                        <textarea type="text" id='description' rows='4' ref={descriptionRef}/>
                    </div>
                </form>
            </Modal> 
        }
        
        <div>
            { contextValue.token && (
                <h1>Create your own event!</h1>
                <button onClick={createEventHandler}>Create Event</button>
            )}
        </div>
        </>
    );

};

export default Events;