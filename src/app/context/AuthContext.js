"use client";

//React imports
import { createContext, useState, useEffect } from "react";

//Services imports
import { saveCookie, getCookie } from "../services/cookiesService";
import { getUser } from "../services/userService";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const saveId = async (id) => {
        const response = await saveCookie('authToken', id, 3600);
        return response;
    }

    const getId = () => {
        return getCookie('authToken');
    }

    const checkAuth = async () => {
        const response = await getCookie('authToken');
        if (response.ok) {
            if(response.data.value === null) {
                return {ok: false};
            } else {
                const response2 = await getUser(response.data.value);
                if(response2.ok) {
                    setUser(response2.data);
                    return {ok: true};
                } else {
                    return {ok: false, message: response2.message};
                }
            }
        } else {
            return {ok: false, message: "Something went wrong. Please try to log in again."};
        }
    }

    const getUserInfo = async (id) => {
        return await getUser(id);
    }

    return (
        <AuthContext.Provider value={{ saveId, getId, checkAuth, getUserInfo, user }}>
            {children}
        </AuthContext.Provider>
    );
}

export {AuthContext, AuthProvider}