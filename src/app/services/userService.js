const API_URL = '/api/user';

export const insertUser = async ({email, name, password}) => {
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
        return { ok: false, message: 'Something went wrong. Please try again later.' };
    }
}