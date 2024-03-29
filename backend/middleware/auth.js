import ErrorResponse from '../utils/errorResponse.js';
import jwt from 'jsonwebtoken';
import {User} from '../models/userModel.js';



export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorResponse('You must Log In...', 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();

    } catch (error) {
        return next(new ErrorResponse('You must Log In', 401));
    }
}

