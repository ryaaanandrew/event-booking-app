const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');


const app = express();
const PORT = 4000;

const mango = 'mongodb+srv://<username>:<password>@cluster0-8nozd.mongodb.net/test?retryWrites=true&w=majority'

const events = [];

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    trueValue: {},
    rootValue: {
        events: () => {
            return events
        },
        createEvent: (args) => {
            // const event = {
            //     _id: Math.random().toString(),
            //     title: args.eventInput.title,
            //     description: args.eventInput.description,
            //     price: +args.eventInput.price,
            //     date: args.eventInput.date
            // }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            events.push(event);
            return event;
        }
    },
    graphiql: true
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-8nozd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true }
    )
    .then(app.listen(PORT, () => console.log(`Connected to MongoDB and now listening on port ${PORT}`)))
    .catch(err => console.log(err));
