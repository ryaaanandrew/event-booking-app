import React, { useEffect, useState, useContext } from 'react';
import authContext from '../context/auth-context';

const Bookings = () => {
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);

    const context = useContext(authContext);

    useEffect(() => {
        fetchBookings();
    },[]);

    const fetchBookings = () => {
        setLoading(true);
  
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        updatedAt
                        event {
                            _id
                            title
                            date
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
                'Authorization': 'Bearer ' + context.token
            }
        })
        .then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('failed');
            }
            return res.json();
        })
        .then(resData => {
            setBookings([...resData.data.bookings])
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <ul>
            {bookings.map(booking => (
                <li key={booking._id}>
                    <h1 >{`${booking.event.title} - created at: ${new Date(booking.createdAt).toLocaleDateString()}`}</h1>
                </li>
            ))}
        </ul>
    );

};

export default Bookings;