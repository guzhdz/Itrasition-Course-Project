"use client";

//React imports
import { createContext, useState, useEffect } from "react";

//Chakra imports
import { useColorModeValue } from "@chakra-ui/react";

const UIContext = createContext();

const UIProvider = ({ children }) => {
    const bg = useColorModeValue("blackAlpha.50", "initial");
    const greenColor = useColorModeValue("green.600", "green.300");
    const redColor = useColorModeValue("red.600", "red.300");
    const textGreenScheme = useColorModeValue("white", "gray.800");
    const [language, setLanguage] = useState('en');
    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '', closeCallback: () => {} });
    const [pageLoaded, setPageLoaded] = useState(false);
    

    useEffect(() => {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLanguage(storedLanguage);
        } else {
            setLanguage("en");
            localStorage.setItem("language", "en");
        }
    }, []);

    const changeLanguage = (value) => {
        setLanguage(value);
        localStorage.setItem("language", value);
    }

    const openSimpleModal = (title, message, closeCallback = () => {}) => {
        setModalInfo({ title, message, closeCallback });
        setShowModal(true);
      }

    return (
        <UIContext.Provider value={{ 
            bg, 
            greenColor, 
            language, 
            setLanguage,
             textGreenScheme, 
             redColor, 
             changeLanguage,
             showModal,
             setShowModal,
             modalInfo,
             openSimpleModal,
             pageLoaded,
             setPageLoaded }}>
            {children}
        </UIContext.Provider>
    );
}

export {UIContext, UIProvider}