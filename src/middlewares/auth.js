import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1].trim();
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            message: "Authentication Failed"
        });
    }
}
