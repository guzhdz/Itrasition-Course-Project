//Shared functions import
import { getGeneralError } from './sharedFunctions.js'

const API_URL = '/api/user';

export const getUser = async (userId) => {
    let messageError = "";
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('action', 'getUser');
        url.searchParams.append('id', userId);
        const response = await fetch(url.toString());
        const data = (await response.json());
        if (response.status !== 200) {
            messageError = data.error;
            return { ok: false, message: messageError };
        } else {
            if (data === null) {
                messageError = {
                    en: "User not found.",
                    es: "Usuario no encontrado.",
                };
                return { ok: false, message: messageError };
            } else
                return { ok: true, data: data };
        }
    } catch (error) {
        return getGeneralError(error);
    }
}

export const insertUser = async ({ email, name, password }) => {
    const user = {
        name,
        email,
        password,
        status: true,
        is_admin: false,
        register_time: new Date().toISOString()
    };
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        const data = await response.json();
        if (response.status != 200) {
            return { ok: false, message: data.error };
        }
        else {
            return { ok: true };
        }
    } catch (error) {
        return getGeneralError(error);
    }
}

export const getUsers = async (action) => {
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('action', action);
        const response = await fetch(url.toString());
        const data = await response.json();
        if (response.status !== 200) {
            return { ok: false, message: data.error };
        } else {
            return { ok: true, data: data };
        }
    } catch (error) {
        return getGeneralError(error);
    }
}

export const deleteUsers = async (ids) => {
    try {
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ids: ids
            })
        });
        if (response.status === 200) {
            return { ok: true };
        } else {
            const data = await response.json();
            return { ok: false, message: data.error };
        }
    } catch (error) {
        return getGeneralError(error);
    }
}

export const updateUsers = async (users) => {
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                users: users
            })
        });
        const data = await response.json();
        if (response.status != 200) {
            return {ok: false, message: data.error};
        } else {
            return {ok: true, data: data.data};
        }
    } catch (error) {
        return getGeneralError(error);
    }
}
