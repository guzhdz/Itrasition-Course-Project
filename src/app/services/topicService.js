//Shared functions import
import { getGeneralError } from './sharedFunctions.js'

const API_URL = '/api/topic';

export const getTopics = async (action) => {
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