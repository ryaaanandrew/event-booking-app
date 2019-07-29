const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

const app = express();
const PORT = 4000;

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
           return Event.find()
           .then(events => {
               return events
           })
           .catch(err => {
               throw err 
           })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '5d3e7584a8a251dab937b7e9'
            });
            let createdEvent;
            return event.save()
                .then(result => {
                    createdEvent = { ...result._doc };
                    return User.findById('5d3e7584a8a251dab937b7e9')
                })
                .then(user => {
                    if(!user) {
                        throw new Error('User not found');
                    }
                    user.createdEvents.push(event);
                    return user.save()
                })
                .then(results => {
                    return createdEvent
                })
                .catch(err => {
                    console.log(err);
                    throw err;
                });
        },
        createUser: (args) => {
            return User.findOne({ email: args.userInput.email}).then(user => {
                if(user) throw new Error('User already exists');

                return bcrypt.hash(args.userInput.password, 12);
            })
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                });
                return user.save();
            })
            .catch(err => {
                throw err;
            })
        }
    },
    graphiql: true
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-8nozd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true }
    )
    .then(app.listen(PORT, () => console.log(`Connected to MongoDB and now listening on port ${PORT}`)))
    .catch(err => console.log(err));
