import React, { useState, useRef, useContext, useEffect } from 'react';
import Modal from '../components/Modal';
import Backdrop from '../components/Backdrop';
import AuthContext from '../context/auth-context';
import EventList from '../components/EventList';
import Spinner from '../components/Spinner';

const Events = () => {
    const [creating, setCreating] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null); 

    let contextValue = useContext(AuthContext);
    let isActive = true;

    const titleRef = useRef();
    const priceRef = useRef();
    const dateRef = useRef();
    const descriptionRef = useRef();

    useEffect(() => {
        fetchEvents();
    }, [])

    const createEventHandler = () => {
        setCreating(true);
    };

    const modalCancelHandler = () => {
        setCreating(false);
        setSelectedEvent(null)
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
                mutation CreateEvent($title: String!, $description: String!, $price: Float!, $date: String!){
                    createEvent(eventInput:{title: $title, description: $description, price: $price, date: $date}){
                        _id
                        title
                        description
                        price
                        date
                    }
                }
            `,
            variables: {
                title: title,
                description: description,
                price: price,
                date: date
            }
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
                setEvents(prevState => {
                    const updatedEvents = [...prevState];
                    updatedEvents.push({
                        _id: resData.data.createEvent._id,
                        title: resData.data.createEvent.title,
                        description: resData.data.createEvent.description,
                        date: resData.data.createEvent.date,
                        price: resData.data.createEvent.price,
                        creator: {
                            _id: contextValue.userId
                        }
                    });
                    return [...updatedEvents];
                });
            }
        )
        .catch(err => {
            console.log(err);
        });
        setCreating(false);
    };

    const fetchEvents = () => {
        setLoading(true);
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
            if(isActive) {
                setEvents([...events]);
                setLoading(false);
            }
            
        })
        .catch(err => {
            console.log(err);
            if(isActive) {
                setLoading(false);
            }
        });
    };

    const showDetailHandler = eventId => {
        const selectedEvent = events.find(e => e._id === eventId);

        setSelectedEvent(selectedEvent);
    };

    const bookEventHandler = () => {
        if(!contextValue.token) {
            setSelectedEvent(null);
            return; 
        }

        const requestBody = {
            query: `
                mutation BookEvent($id: ID!) {
                    bookEvent(eventId: $id) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: {
                id: selectedEvent._id
            }
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
            console.log(resData);
            setSelectedEvent(null);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        });
    };

    useEffect(() => {
        return () => {
            isActive = false;
        };
    },[]);

    return (
        <>
            { ( creating || selectedEvent ) &&  <Backdrop /> }
            { creating && 
                <Modal 
                    canConfirm 
                    canCancel 
                    onConfirm={confirmHandler} 
                    onCancel={modalCancelHandler}
                    confirmText='confirm'
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

            {selectedEvent && (
                <Modal 
                    canConfirm 
                    canCancel 
                    onConfirm={bookEventHandler} 
                    onCancel={modalCancelHandler}
                    confirmText={contextValue.token ? 'Book' : 'Confirm'}
                >
                    <h1>{selectedEvent.title}</h1>
                    <h2>{selectedEvent.price}</h2>
                    <h3>Date: {new Date(selectedEvent.date).toLocaleDateString('de-DE')}</h3>
                    <p> description: {selectedEvent.description} </p>
                </Modal> 
            )}
            
            { contextValue.token && (
                <div className="events-control">
                    <h1>Create your own event!</h1>
                    <button onClick={createEventHandler}>Create Event</button>
                </div>
            )}
                { loading ? <Spinner /> :
                    <EventList 
                        events={events} 
                        authUserId={contextValue.userId}
                        onViewDetail={showDetailHandler} 
                    />
                }
        </>
    );

};

export default Events;