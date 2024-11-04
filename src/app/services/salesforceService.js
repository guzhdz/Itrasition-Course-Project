//Shared functions import
import { getGeneralError } from './sharedFunctions.js'

const API_URL = '/api/salesforce';

export const getAccountByAccountNumber = async (accountNumber) => {
    let messageError = "";
    try {
        const url = new URL(API_URL, window.location.origin);
        url.searchParams.append('action', "getAccountByAccountNumber");
        url.searchParams.append('accountNumber', accountNumber);
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


export const createAccountAndContact = async ({id, accountName, contactFirstName, contactLastName, contactEmail, phone}) => {
    const body = {
        id: id.toString(),
        accountName,
        contactFirstName,
        contactLastName,
        contactEmail,
        phone
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
