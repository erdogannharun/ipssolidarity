import jwt from 'jsonwebtoken';
import { ACCESS_SECRET } from '../config.js';

export const authorization = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token)
        return res.status(401).send({ error: "Please provide an Access Token in headers." });
    jwt.verify(token, ACCESS_SECRET, (error, payload) => {
        if (error) {
            return res.status(401).send({ error: "Your Access Token is invalid or expired." });;
        }
        req.user = payload
        next()
    });
}