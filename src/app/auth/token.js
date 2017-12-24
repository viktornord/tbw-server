const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;
const algorithm = 'HS512';

module.exports = {
    sign,
    verify,
};

function sign(payload) {

    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, {algorithm}, (error, token) => error ? reject(error) : resolve(token));
    });
}

function verify(token) {

    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {algorithms: [algorithm]}, (error, payload) => error ? reject(error) : resolve(payload));
    });
}
