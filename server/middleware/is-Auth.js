const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('authorization');

    if(!authHeader) {
        req.isAuth = false;
        return next();
    };

    const token = authHeader.split(' ')[1]; // bearer '12312312321312rq3dedqwdasd'

    if(!token || token === '') {
        req.isAuth = false;
        return next();
    };

    let decodedToken = jwt.verify(token, 'tokenSecretKey');

    try {

    } catch(err) {
        req.isAuth = false;
        return next();
    }

    if(!decodedToken) {
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};