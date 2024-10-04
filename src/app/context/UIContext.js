"use client";

//React imports
import { createContext, useState, useEffect } from "react";

//Chakra imports
import { useColorModeValue } from "@chakra-ui/react";

const UIContext = createContext();

const UIProvider = ({ children }) => {
    const bg = useColorModeValue("blackAlpha.100", "initial");
    const greenColor = useColorModeValue("green.600", "green.300");
    const [language, setLanguage] = useState('');

    useEffect(() => {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLanguage(storedLanguage);
        } else {
            setLanguage("en");
        }
    }, []);

    useEffect(() => {
        if(language !== '')
            localStorage.setItem("language", language);
    }, [language]);

    return (
        <UIContext.Provider value={{ bg, greenColor, language, setLanguage }}>
            {children}
        </UIContext.Provider>
    );
}

export {UIContext, UIProvider}