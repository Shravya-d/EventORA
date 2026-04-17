const jwt = require('jsonwebtoken');
const User = require('../models/User');

//User authentication middleware: this checks whther user is logged in or not
const protect = async (req, res, next) => {
    let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: 'Invalid token' });
        }
    } else {
        return res.status(401).json({ error: 'No token provided' });
    }
};

//ADMIN authorization middleware: this checks whether the logged in user is admin or not
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        return res.status(403).json({ error: 'Forbidden: Admins only' });
    }
}
module.exports = { protect, admin };