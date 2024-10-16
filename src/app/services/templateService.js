//Shared functions import
import { getGeneralError } from './sharedFunctions.js'

//Library imports
import superjson from 'superjson'

const API_URL = '/api/template';

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