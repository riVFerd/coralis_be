import {DbHelper} from '../database/db.js';

const users = new DbHelper('users');
const passResets = new DbHelper('password_resets');

export const getUserById = async (userId, includePassword = false) => {
    let columns = ['id', 'name', 'email'];
    if (includePassword) {
        columns.push('password');
    }
    return await users.getById({id: userId, columns: columns});
}

export const getUserByEmail = async (email, includePassword = false) => {
    let columns = ['id', 'name', 'email'];
    if (includePassword) {
        columns.push('password');
    }
    return await users.getByCondition({
        condition: {email: email},
        columns: columns
    });
}

export const createUser = async (userData) => {
    return await users.insert(userData);
}

export const updateUser = async ({userId, idColumn, updateData}) => {
    return await users.update({id: userId, data: updateData, idColumn: idColumn});
}

export const createPasswordResetToken = async (data) => {
    // delete existing tokens for the user
    await passResets.deleteByCondition({email: data.email});

    // 15 minutes expiration
    data.expires_at = new Date(
        Date.now() + 15 * 60 * 1000
    );

    return await passResets.insert(data);
};

export const getPasswordResetToken = async (token) => {
    return await passResets.getByCondition({
        condition: {token: token},
        customConditions: 'expires_at > NOW()'
    });
}

export const deletePasswordResetToken = async (token) => {
    return await passResets.deleteByCondition({token: token});
}