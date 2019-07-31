const express = require('express');
const graphqlHTTP = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./graphql/schema');
const graphQLResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-8nozd.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true }
    )
    .then(app.listen(PORT, () => console.log(`Connected to MongoDB and now listening on port ${PORT}`)))
    .catch(err => console.log(err));
