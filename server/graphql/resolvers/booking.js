const { dateToString } = require('../../helpers/date');
const { user, singleEvent, transformEvent, transformBooking } = require('./merge');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

module.exports = {
    bookings: async () => {
      try {
        const bookings = await Booking.find();
        return bookings.map(booking => transformBooking(booking));
      } catch (err) {
        throw err;
      }
    },
    bookEvent: async args => {
          const fetchedEvent = await Event.findOne({ _id: args.eventId });
          const booking = new Booking({
              user: '5d4078f2d26d21f7335c6737',
              event: fetchedEvent
          });
          console.log(fetchedEvent)
      const result = await booking.save();
      return transformBooking(result);
    },
    cancelBooking: async args => {
      try {
        const booking = await Booking.findById(args.bookingId).populate('event');
        const event = transformEvent(booking.event);
        await Booking.deleteOne({ _id: args.bookingId });
        return event;
      } catch (err) {
        throw err;
      }
    }
};