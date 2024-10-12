"use client";

//React imports
import { createContext, useState, useContext } from "react";

//Services imports
import { saveCookie, getCookie, deleteCookie } from "../services/cookiesService";
import { getUser } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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

    const getUserInfo = async (id) => {
        return await getUser(id);
    }

    const resetAuth = async () => {
        const response = await deleteId();
        if (response) {
            setUser(null);
        }
    }

    const checkAuth = async () => {
        const response = await getId();
        if (response.ok && response.data.value !== null) {
            return await validateUser(response);
        } else {
            await resetAuth();
            return { ok: false };
        }
    }

    const validateUser = async (response) => {
        const userResponse = await getUser(response.data.value);
        if (userResponse.ok) {
            if (userResponse.data.status) {
                setUser(userResponse.data);
                return { ok: true, data: userResponse.data };
            } else {
                await resetAuth();
                return {
                    ok: false, message: {
                        en: "Your account has been blocked. Please contact support.",
                        es: "Tu cuenta ha sido bloqueada. Por favor, contacta con soporte."
                    }
                };
            }
        } else {
            await resetAuth();
            return {
                ok: false, message: {
                    en: "There was an error retrieving your information. Please log in again.",
                    es: "Hubo un error al recuperar tu información. Por favor, inicia sesión de nuevo."
                }
            };
        }
    }

    return (
        <AuthContext.Provider value={{
            user, getUserInfo,
            saveId, getId, deleteId,
            resetAuth, checkAuth, validateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);