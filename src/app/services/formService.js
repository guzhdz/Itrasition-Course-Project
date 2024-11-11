//Shared functions import
import { getGeneralError } from './sharedFunctions.js'

//Library imports
import superjson from 'superjson'

const API_URL = '/api/form';

export const getUserForm = async (templateId, userId) => {
    let messageError = "";
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('action', 'getUserForm');
        url.searchParams.append('templateId', templateId);
        url.searchParams.append('userId', userId);
        const response = await fetch(url.toString());
        const data = superjson.deserialize(await response.json());
        if (response.status !== 200) {
            messageError = data.error;
            return { ok: false, message: messageError };
        } else {
            return { ok: true, data: data };
        }
    } catch (error) {
        return getGeneralError(error);
    }
}

export const getFormsUser = async (userId) => {
    let messageError = "";
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('action', "getFormsUser");
        url.searchParams.append('userId', userId);
        const response = await fetch(url.toString());
        const data = superjson.deserialize(await response.json());
        if (response.status !== 200) {
            messageError = data.error;
            return { ok: false, message: messageError };
        } else {
            return { ok: true, data: data };
        }
    } catch (error) {
        return getGeneralError(deserializedError);
    }
}

export const getTemplateForms = async (templateId) => {
    let messageError = "";
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('action', "getTemplateForms");
        url.searchParams.append('templateId', templateId.toString());
        const response = await fetch(url.toString());
        const data = superjson.deserialize(await response.json());
        if (response.status !== 200) {
            messageError = data.error;
            return { ok: false, message: messageError };
        } else {
            return { ok: true, data: data };
        }
    } catch (error) {
        return getGeneralError(deserializedError);
    }
}

export const insertFormAndAnswers = async (template_id, user_id, answers) => {
    const form = {
        template_id: template_id.toString(),
        user_id,
        fill_time: new Date().toISOString(),
        answers
    };
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });
        const data = superjson.deserialize(await response.json());
        if (response.status != 200) {
            return { ok: false, message: data.error };
        }
        else {
            return { ok: true, data: data };
        }
    } catch (error) {
        return getGeneralError(error);
    }
}

export const updateFormAndAnswers = async (template_id, user_id, answers) => {
    const form = {
        template_id: template_id.toString(),
        user_id,
        fill_time: new Date().toISOString(),
        answers
    };
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });
        const data = superjson.deserialize(await response.json());
        if (response.status != 200) {
            return { ok: false, message: data.error };
        }
        else {
            return { ok: true, data: data };
        }
    } catch (error) {
        return getGeneralError(error);
    }
}

export const deleteForms = async (ids) => {
    ids = ids.map(id => id.toString());
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