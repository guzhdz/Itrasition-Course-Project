"use client";

//React imports
import { createContext, useState } from "react";

//Services imports
import { saveCookie, getCookie, deleteCookie } from "../services/cookiesService";
import { getUser } from "../services/userService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const saveId = async (id) => {
        return await saveCookie('authToken', id, 3600);
    }

    const getId = async () => {
        return await getCookie('authToken');
    }

    const deleteId = async () => {
        return await deleteCookie('authToken');
    }

    const resetAuth = async () => {
        const response = await deleteId();
        if (response) {
            setUser(null);
        }
    }

    const getUserInfo = async (id) => {
        return await getUser(id);
    }

    const checkAuth = async () => {
        const response = await getId();
        if (response.ok && response.data.value !== null) {
            const userResponse = await getUser(response.data.value);
            if (userResponse.ok) {
                if (userResponse.data.status) {
                    setUser(userResponse.data);
                    return { ok: true, data: userResponse.data };
                } else {
                    await resetAuth();
                    return { ok: false, message: { 
                        en: "Your account has been blocked. Please contact support.",
                        es: "Tu cuenta ha sido bloqueada. Por favor, contacta con soporte."
                    } };
                }
            } else {
                await resetAuth();
                return { ok: false, message: {
                    en: "There was an error retrieving your information. Please log in again.",
                    es: "Hubo un error al recuperar tu información. Por favor, inicia sesión de nuevo."
                } };
            }
        } else {
            await resetAuth();
            return { ok: false };
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, checkAuth, resetAuth, saveId, getId, deleteId, getUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider }