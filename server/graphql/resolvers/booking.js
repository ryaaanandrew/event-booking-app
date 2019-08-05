const { dateToString } = require('../../helpers/date');
const { user, singleEvent, transformEvent, transformBooking } = require('./merge');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

module.exports = {
    bookings: async (args, req) => {
      if(!req.isAuth) {
        throw new Error('Not authenticated')
      }

      try {
        const bookings = await Booking.find({ user: req.userId });
        return bookings.map(booking => transformBooking(booking));
      } catch (err) {
        throw err;
      }
    },
    bookEvent: async (args, req) => {
      if(!req.isAuth) {
        throw new Error('Not authenticated')
      }
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
          user: req.userId,
          event: fetchedEvent
      });

      const result = await booking.save();
      return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
      if(!req.isAuth) {
        throw new Error('Not authenticated')
      }

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