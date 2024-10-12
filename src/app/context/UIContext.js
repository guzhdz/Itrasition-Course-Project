"use client";

//React imports
import { useState, useEffect, createContext, useContext } from "react";

//Chakra imports
import { useColorModeValue } from "@chakra-ui/react";

//Components imports
import SimpleModal from "../components/shared/SimpleModal";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    //Color settings
    const bg = useColorModeValue("blackAlpha.50", "initial");
    const greenColor = useColorModeValue("green.600", "green.300");
    const redColor = useColorModeValue("red.600", "red.300");
    const textGreenScheme = useColorModeValue("white", "gray.800");

    //Text Settings
    const [language, setLanguage] = useState('en');

    //Interactive settings
    const [showModal, setShowModal] = useState(false);
    const [modalOptions, setModalOptions] = useState({
        title: '',
        message: '',
        closeCallback: () => { },
        closeOnOverlay: true
    });
    const [pageLoaded, setPageLoaded] = useState(false);

    useEffect(() => {
        getLocalLanguage();
    }, []);

    const getLocalLanguage = () => {
        const storedLanguage = localStorage.getItem("language");
        if (storedLanguage) {
            setLanguage(storedLanguage);
        } else {
            changeLanguage("en");
        }
    }

    const changeLanguage = (value) => {
        setLanguage(value);
        localStorage.setItem("language", value);
    }

    const openSimpleModal = (title, message, closeCallback = () => { }, closeOnOverlay = true) => {
        setModalOptions({ title, message, closeCallback, closeOnOverlay });
        setShowModal(true);
    }

    const openErrorAuthModal = (message, callback) => {
        openSimpleModal(
            language === "es" ? 'Autenticación fallida' : 'Authentication failed',
            language ? message[language] : message.en,
            callback
        );
    }

    const openExpiredSessionModal = (callback) => {
        openSimpleModal(
            language === "es" ? 'Sesión expirada' : 'Session expired',
            language === "es" ? 'La sesión ha expirado, por favor inicia sesión nuevamente' :
                'Your session has expired, please log in again',
            callback
        );
    }

    const openAccessDeniedModal = (callback) => {
        openSimpleModal(
            language === "es" ? 'Acceso denegado' : 'Access denied',
            language === "es" ? 'No eres parte de la administración' : 'You are not part of the administration',
            callback
        );
    }

    return (
        <UIContext.Provider value={{
            bg,
            greenColor,
            redColor,
            textGreenScheme,
            language,
            setLanguage,
            showModal,
            setShowModal,
            modalOptions,
            setModalOptions,
            pageLoaded,
            setPageLoaded,
            changeLanguage,
            getLocalLanguage,
            openSimpleModal,
            openErrorAuthModal,
            openExpiredSessionModal,
            openAccessDeniedModal
        }}>
            {children}

            <SimpleModal
                closeOnOverlay={modalOptions?.closeOnOverlay}
                title={modalOptions.title}
                message={modalOptions.message}
                showModal={showModal}
                setShowModal={setShowModal}
                closeCallback={modalOptions.closeCallback || (() => { })} />
        </UIContext.Provider>
    );
}

export const useUI = () => useContext(UIContext);