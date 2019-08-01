import React, { useState, useRef, useContext, useEffect } from 'react';
import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/EventList';

const Events = () => {
    const [creating, setCreating] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    let contextValue = useContext(AuthContext);

    const titleRef = useRef();
    const priceRef = useRef();
    const dateRef = useRef();
    const descriptionRef = useRef();

    useEffect(() => {
        fetchEvents();
    }, [])

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
            fetchEvents();
        })
        .catch(err => {
            throw new Error('Error creating new event');
        });

        setCreating(false);
    };

    const fetchEvents = () => {
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        price
                        date
                        creator {
                            _id
                            email
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
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData => {
            const events = resData.data.events;
            setEvents([...events]);
        })
        .catch(err => {
            throw new Error('Error fetching events');
        });
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
        
        { contextValue.token && (
            <div className="events-control">
                <h1>Create your own event!</h1>
                <button onClick={createEventHandler}>Create Event</button>
            </div>
        )}
            <EventList events={events}/>
        </>
    );

};

export default Events;