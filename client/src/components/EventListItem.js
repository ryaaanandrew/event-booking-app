import React from 'react';

const EventItem = props => {
    return (
        <li key={props.eventId} className="events__item">
            <div>
                <h1>{props.title}</h1>
                <h2>Price: ${props.price}</h2>
            </div> 

            <div> 
                {props.creatorId === props.userId ? 
                    <p className='events__owner'>You're the owner of this event</p> :
                    <div className='button' onClick={(e) => props.onDetail(props.eventId)}>View Details</div> 
                }
            </div>
        </li>
    );
};

export default EventItem

// props.onDetail.bind(this, props.eventId)