import React from 'react';

const BookingList = props => {
    return (
        <ul>
            {props.bookings.map(booking => (
                <li key={booking._id}>
                    <div>
                        <h1>{`${booking.event.title} - created at: ${new Date(booking.createdAt).toLocaleDateString()}`}</h1>
                    </div>    
                    <div>
                        <button onClick={ () => props.onDelete(booking._id)}>Cancel</button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default BookingList;
