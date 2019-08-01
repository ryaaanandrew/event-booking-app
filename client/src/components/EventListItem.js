import React from 'react';

const EventItem = props => {
    return (
        <li key={props.userId} className="event__list--item">
            <div>
                <h1>{props.title}</h1>
                <h2>{props.price}</h2>
            </div> 
            <div>
                <button>View Details</button>
            </div>
        </li>
    );
};

export default EventItem
