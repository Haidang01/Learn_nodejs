import jwt from 'jsonwebtoken';
require('dotenv').config();
const nonSecurePaths = ['/logout', 'register', '/login', 'account', '/user/create', '/user/delete', '/role/create', 'role/read'];
const createJWT = (payload) => {
    console.log('c1');
    let key = process.env.JWT_SECRET
    let token = null;
    try {
        token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPRIRES_IN });
        // console.log(token);

    } catch (e) {
        console.log(e);
    }

    return token;

}

const verifyToken = (token) => {
    console.log('c2');

    let key = process.env.JWT_SECRET
    let decoded = null;
    try {
        decoded = jwt.verify(token, key);
        // console.log('>>>>>>', decoded);
    } catch (err) {
        console.log('>>> err verifyToken ', err);

    }

    return decoded;
}

const checkUserJWT = (req, res, next) => {
    console.log('c3');
    // console.log('jwt', req.query);
    // return next()
    if (nonSecurePaths.includes(req.path)) return next();
    let cookie = req.cookies;
    if (cookie && cookie.jwt) {
        let token = cookie.jwt;


        let decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
            // console.log('>>> dtata', data);
            res.token = token;
            next()
        } else {
            return res.status(401).json({
                EC: -1,
                EM: 'Not authenticated  the user',
                DT: ''
            })
        }
        // console.log('>> check with cookies', cookie.jwt);
    } else {
        return res.status(401).json({
            EC: -1,
            EM: 'Not authenticated  the user',
            DT: ''
        })
    }
}

const checkUserPermission = (req, res, next) => {
    // console.log('c4');
    // return next()
    if (nonSecurePaths.includes(req.path) || req.path === '/account') return next();
    if (req.user) {
        // console.log(req.user);
        let email = req.user.email;
        let roles = req.user.groupWithRoles.Roles;
        let currentURL = req.path;
        if (!roles || roles.length === 0) {
            return res.status(403).json({
                EC: -1,
                EM: 'You do not have permission to sccess this resource...',
                DT: ''
            })
        }
        let canAccess = roles.some(item => item.url === currentURL);
        if (canAccess == true) {
            next();
        } else {
            return res.status(403).json({
                EC: -1,
                EM: 'You do not have permission to sccess this resource...',
                DT: ''
            })
        }
    } else {
        return res.status(401).json({
            EC: -1,
            EM: 'Not authenticated  the user',
            DT: ''
        })
    }
}

module.exports = {
    createJWT, verifyToken, checkUserJWT, checkUserPermission
}