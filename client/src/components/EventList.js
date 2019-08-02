import React from 'react';
import EventListItem from './EventListItem';

const EventList = props => {
    const events = props.events.map(event => {
        return (
            <EventListItem 
                title={event.title} 
                eventId={event._id} 
                key={event._id} 
                price={event.price} 
                userId={props.authUserId} 
                creatorId={event.creator._id}
                description={event.description}
                date={event.date}
                onDetail={props.onViewDetail}
            x/>
        );
    });

    return (
        <ul className="event__list">{events}</ul>
    );
};

export default EventList;
