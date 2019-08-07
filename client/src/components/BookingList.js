import React from 'react';

const BookingList = props => {
    return (
        <ul className='bookingsList'>
            {props.bookings.map(booking => (
                <li key={booking._id} className='bookingsList__item'>
                    <div className="bookingList__content">
                        <h1 className='bookingList__header'>{booking.event.title}</h1>
                        <h3>Created at: ${new Date(booking.createdAt).toLocaleDateString()}</h3>
                    </div>
                    <div className='bookingList__control'>
                        <div className='button' onClick={ () => props.onDelete(booking._id)}>Cancel</div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default BookingList;

// <div>
//                         <h1>{`${booking.event.title} - created at: ${new Date(booking.createdAt).toLocaleDateString()}`}</h1>
//                     </div>    
//                     <div>
//                         <button onClick={ () => props.onDelete(booking._id)}>Cancel</button>
//                     </div>
