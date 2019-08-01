import React from 'react';
import EventListItem from './EventListItem';

const EventList = props => {
    const events = props.events.map(event => {
        return (
            <EventListItem title={event.title} userId={event.userId} key={event._id} price={event.price}/>
        );
    });

    return (
        <ul className="event__list">{events}</ul>
    );
};

export default EventList;
