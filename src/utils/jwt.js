import jwt from "jsonwebtoken";

export const SignJwt = (userData) => {
    const payload = {
        id: userData.id,
        email: userData.email
    }
    const secretKey = process.env.JWT_SECRET
    const options = {
        expiresIn: '1d'
    }
    return jwt.sign(payload, secretKey, options);
}