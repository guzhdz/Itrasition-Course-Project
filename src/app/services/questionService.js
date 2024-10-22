//Shared functions import
import { getGeneralError } from './sharedFunctions.js'

//Library imports
import superjson from 'superjson'

const API_URL = '/api/question';

export const getQuestionsTemplate = async (idTemplate) => {
    let messageError = "";
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('action', "getQuestionsTemplate");
        url.searchParams.append('idTemplate', idTemplate);
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