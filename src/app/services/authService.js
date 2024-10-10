const API_URL = '/api/auth';
export const authUser = async (form) => {
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('email', form.email);
        url.searchParams.append('password', form.password);
        const response = await fetch(url.toString());
        const data = await response.json();
        if (response.status != 200) {
            return { ok: false, message: data.error };
        } else {
            return { ok: true, data: data };
        }
    } catch (error) {
        return getGeneralError(error);
    }
}

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