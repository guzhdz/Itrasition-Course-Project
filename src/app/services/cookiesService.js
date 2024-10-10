const API_URL = '/api/cookies';

export const saveCookie = async (name, value, time = 3600) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, value, time })
        });
        const data = await response.json();
        if (data.status) {
            return { ok: true };
        } else {
            return { ok: false, message: data.error };
        }
    } catch (error) {
        return getFalseError(error);
    }
}

export const deleteCookie = async (name) => {
    try {
        const response = await fetch(API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name })
        });
        const data = await response.json();
        return data.status;
    } catch (error) {
        return getFalseError(error);
    }
};

export const getCookie = async (name) => {
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('name', name);
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
};

const getGeneralError = (error) => {
    const message = {
        en: 'Something went wrong. Please try again later.',
        es: 'Algo salio mal. Por favor, intentalo de nuevo.'
    }
    console.error('Error in the request:', error);
    return {
        ok: false, message: message
    };
}

const getFalseError = (error) => {
    console.error('Error in the request:', error);
    return false;
}