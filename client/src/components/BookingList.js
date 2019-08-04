import React from 'react';

const BookingList = props => {
    return (
        <ul>
            {props.bookings.map(booking => (
                <li key={booking._id}>
                    <h1 >{`${booking.event.title} - created at: ${new Date(booking.createdAt).toLocaleDateString()}`}</h1>
                </li>
            ))}
        </ul>
    );
};

export default BookingList;
