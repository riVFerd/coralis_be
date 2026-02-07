import * as authService from "../services/auth-service.js";

export const profile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await authService.getUserById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
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