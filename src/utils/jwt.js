import JWT from 'jsonwebtoken'

export default {
    sign: payload => JWT.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    }),
    verify: token => JWT.verify(token, process.env.JWT_SECRET),
}