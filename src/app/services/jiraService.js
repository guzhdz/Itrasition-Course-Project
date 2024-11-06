//Shared functions import
import { getGeneralError } from './sharedFunctions.js'

const API_URL = '/api/jira';

export const getUserIssues = async (email) => {
    let messageError = "";
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('action', 'getUserIssues');
        url.searchParams.append('email', email);
        const response = await fetch(url.toString());
        const data = await response.json();
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

export const createTicket= async ({summary, priority, templateTitle, link, reportedBy, description}) => {
    const body = {
        summary,
        description,
        priority,
        templateTitle,
        link,
        reportedBy
    }
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
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