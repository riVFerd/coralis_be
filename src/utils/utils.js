import jwt from "jsonwebtoken";

export const SignJwt = (userInfo) => {
    const payload = {
        id: userInfo.id,
        email: userInfo.email
    }
    const secretKey = process.env.JWT_SECRET
    const options = {
        expiresIn: '1d'
    }
    return jwt.sign(payload, secretKey, options);
}

/**
 * Validates the input object against a given schema.
 *
 * @param {any} input - The input object to be validated.
 * @param {string[]} schema - An array of strings representing the required keys in the input object.
 * @returns {boolean} - Returns true if the input object contains all the keys specified in the schema, otherwise false.
 */
export const validateInput = (input, schema) => {
    for (let key of schema) {
        if (!input[key]) return false
    }
    return true;
}