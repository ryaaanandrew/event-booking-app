import React, { useEffect, useState, useContext } from 'react';
import authContext from '../context/auth-context';
import Spinner from '../components/Spinner';    
import BookingList from '../components/BookingList';

const Bookings = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [bookings, setBookings] = useState([]);

    const context = useContext(authContext);

    useEffect(() => {
        fetchBookings();
    },[]);

    const fetchBookings = () => {
        setIsLoading(true);
  
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
            setBookings([...resData.data.bookings]);
            setIsLoading(false);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
        });
    };

    const onDelete = bookingId => {
        setIsLoading(true);

        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!){
                    cancelBooking(bookingId: $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
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
            const updatedBookings = bookings.filter(booking => {
                return booking._id !== bookingId;
            });
            setBookings([...updatedBookings]);
            setIsLoading(false);
        })
        .catch(err => {
            console.log(err);
            setIsLoading(false);
        });
    };

    return (
        <>
            {
                isLoading ? <Spinner /> : <BookingList bookings={bookings} onDelete={onDelete}/>
            }
        </>
    );

};

export default Bookings;