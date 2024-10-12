export const getGeneralError = (error) => {
    const message = {
        en: 'Something went wrong. Please try again later.',
        es: 'Algo salio mal. Por favor, intentalo de nuevo.'
    }
    console.error('Error in the request:', error);
    return {
        ok: false, message: message
    };
}

export const getFalseError = (error) => {
    console.error('Error in the request:', error);
    return false;
}