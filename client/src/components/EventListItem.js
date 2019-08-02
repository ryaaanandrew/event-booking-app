import React from 'react';

const EventItem = props => {
    return (
        <li key={props.eventId} className="event__list--item">
            <div>
                <h1>Title: {props.title}</h1>
                <h2>Price: {props.price}</h2>
                <h3>Date: {new Date(props.date).toLocaleDateString('de-DE')}</h3>
            </div> 
            <div>
                
                {props.creatorId === props.userId ? 
                    <p>You're the owner of this event</p> :
                    <button onClick={props.onDetail.bind(this, props.eventId)}>View Details</button> 
                }
            </div>
        </li>
    );
};

export default EventItem
