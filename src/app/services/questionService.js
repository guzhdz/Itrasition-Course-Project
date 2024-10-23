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

export const updateTemplateQuestions = async (templateId, newQuestions, changedQuestions, deletedQuestions) => {
    const questionsBody = {
        templateId: templateId.toString(),
        newQuestions: newQuestions,
        changedQuestions: changedQuestions.map(question => {
            return {
                ...question,
                id: question.id.toString(),
                template_id: templateId.toString()
            }
        }),
        deletedQuestions: deletedQuestions.map(question => question.id.toString())
    }
    const action = "updateTemplateQuestions";
    const body = {
        questionsBody,
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