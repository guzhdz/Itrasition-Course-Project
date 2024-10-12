//Shared functions import
import { getGeneralError, getFalseError } from './sharedFunctions.js'

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