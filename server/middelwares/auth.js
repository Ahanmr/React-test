const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ message: "Authentication failed, Token missing" });
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        
        if (!token) {
            return res.status(401).json({ message: "Authentication failed, Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }
}

module.exports = auth;