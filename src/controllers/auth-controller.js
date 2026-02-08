import {validateInput} from "../utils/utils.js";
import * as authService from "../services/auth-service.js";
import bcrypt from "bcrypt";
import {SignJwt} from "../utils/jwt.js";

export const register = async (req, res) => {
    try {
        if (!validateInput(req.body, ['email', 'name', 'password'])) {
            return res.status(400).json({
                success: false,
                message: 'Email, name, and password are required',
            });
        }

        const {email, name, password} = req.body;

        const existingEmail = await authService.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                errors: {email: 'Email is already registered'},
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await authService.createUser({
            email: email,
            name: name,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const login = async (req, res) => {
    try {
        if (!validateInput(req.body, ['email', 'password'])) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        const {email, password} = req.body;
        const user = await authService.getUserByEmail(email, true);
        if (!user) {
            return res.status(400).json({
                success: false,
                errors: {email: 'Email is not registered'},
                message: 'Invalid email',
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                errors: {password: 'Incorrect password'},
                message: 'Invalid password',
            });
        }

        const token = SignJwt(user);
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        const user = await authService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Email is not registered',
            });
        }

        const resetToken = crypto.randomUUID();
        await authService.createPasswordResetToken({
            email: email,
            token: resetToken,
        });

        return res.status(200).json({
            success: true,
            message: 'Password reset token created',
            reset_token: resetToken, // In real case, send this via email
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}


export const resetPassword = async (req, res) => {
    try {
        if (!validateInput(req.body, ['reset_token', 'new_password'])) {
            return res.status(400).json({
                success: false,
                message: 'Reset token and new password are required',
            });
        }

        const {reset_token, new_password} = req.body;
        const resetRecord = await authService.getPasswordResetToken(reset_token);
        if (!resetRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token',
            });
        }

        const hashedPassword = bcrypt.hashSync(new_password, 10);
        await authService.updateUser({
            userId: resetRecord.email,
            idColumn: 'email',
            updateData: {password: hashedPassword}
        });

        await authService.deletePasswordResetToken(reset_token);

        return res.status(200).json({
            success: true,
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}