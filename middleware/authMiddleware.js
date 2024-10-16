// const jwt = require('jsonwebtoken');

// // Middleware to handle JWT authentication and token expiry
// const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers.authorization?.trim(); // Ensure no extra spaces

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Unauthorized: No token provided' });
//     }

//     const token = authHeader.split(' ')[1]; // Extract token

//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized: Token is missing' });
//     }

//     if (!process.env.JWT_SECRET) {
//         console.error('JWT_SECRET is not defined in environment variables');
//         return res.status(500).json({ message: 'Internal server error: JWT secret not set' });
//     }

//     try {
//         // Verify token and decode it
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.admin = decoded; // Attach decoded token to request object
//         next(); // Token verified successfully, proceed to the next middleware or route

//     } catch (err) {
//         console.error('Token verification error:', err.message);

//         // Handle specific token errors
//         if (err.name === 'TokenExpiredError') {
//             // Token has expired
//             return res.status(401).json({
//                 message: 'Token expired, please log in again',
//                 expiredAt: err.expiredAt // You can send the expiration time as part of the response
//             });
//         } else if (err.name === 'JsonWebTokenError') {
//             // Invalid token
//             return res.status(403).json({ message: 'Invalid token' });
//         } else if (err.name === 'NotBeforeError') {
//             // Token not valid yet
//             return res.status(403).json({ message: 'Token not valid yet' });
//         } else {
//             // Other unexpected errors
//             return res.status(500).json({ message: 'Token verification failed' });
//         }
//     }
// };

// module.exports = authMiddleware;
