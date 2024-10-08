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
                messageError = "User not found";
                return { ok: false, message: messageError };
            } else
                return { ok: true, data: data };
        }
    } catch (error) {
        messageError = {
            en: "Something went wrong. Please try again later.",
            es: "Algo salio mal. Por favor, intentalo de nuevo."
        };
        console.error('Error in the request:', error);
        return { ok: false, message: messageError };
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
        console.error('Error in the request:', error);
        return {
            ok: false, message: {
                en: 'Something went wrong. Please try again later.',
                es: 'Algo salio mal. Por favor, intentalo de nuevo.'
            }
        };
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
        console.error('Error in the request:', error);
        return {
            ok: false, message: {
                en: 'Something went wrong. Please try again later.',
                es: 'Algo salio mal. Por favor, intentalo de nuevo.'
            }
        };
    }
}