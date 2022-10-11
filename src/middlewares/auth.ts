import * as jwt from 'jsonwebtoken';

import config from '../config/config';

const auth = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    if (!token) {
        return res.status(403).send("User is not authorized");
    }

    try {
        const decodedToken = jwt.verify(token, config.TOKEN_KEY);
        req.user = decodedToken;
    } catch(err) {
        return res.status(401).send("invalid token");
    }
    return next();
}

export default auth;