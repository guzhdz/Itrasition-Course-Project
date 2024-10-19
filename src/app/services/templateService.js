//Shared functions import
import { getGeneralError } from './sharedFunctions.js'

//Library imports
import superjson from 'superjson'

const API_URL = '/api/template';

export const getTemplate = async (templateId, action) => {
    let messageError = "";
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('action', action);
        url.searchParams.append('id', templateId);
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

export const insertDraftTemplate = async (title, description, topic_id, user_id) => {
    const template = {
        title,
        description,
        image_url: null,
        state: 'draft',
        creation_time: new Date().toISOString(),
        topic_id,
        user_id
    };
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(template)
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

export const updateTemplateSettings = async (templateInfo) => {
    const templateInfoBody = {
        id: templateInfo.id.toString(),
        title: templateInfo.title,
        description: templateInfo.description,
        image_url: templateInfo.image_url,
        state: templateInfo.state,
        topic_id: Number.parseInt(templateInfo.topic_id),
        tagsToAdd: templateInfo.tagsToAdd.map((tag) => {return {id: tag.value}}),
        tagsToDelete: templateInfo.tagsToDelete.map((tag) => tag.value),
        newTags: templateInfo.newTags.map((tag) => tag.label),
    }
    const action = "updateTemplateSettings";
    const body = {
        templateInfoBody,
        action
    }
    let messageError = "";
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        const data = superjson.deserialize(await response.json());
        if (response.status !== 200) {
            messageError = data.error;
            return { ok: false, message: messageError };
        } else {
            return { ok: true, data: data };
        }
    } catch (error) {
        const message = {
            en: 'Something went wrong. Please try again later.',
            es: 'Algo salio mal. Por favor, intentalo de nuevo.'
        }
        console.error('Error in the request:', error);
        return {
            ok: false, message: message
        };
    }
}