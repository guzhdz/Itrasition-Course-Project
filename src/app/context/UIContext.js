"use client";

//React/Next imports
import { useState, useEffect, createContext, useContext } from "react";

//Chakra imports
import { useToast } from "@chakra-ui/react";

//Chakra imports
import { useColorModeValue } from "@chakra-ui/react";

//Components imports
import SimpleModal from "../components/shared/SimpleModal";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
    //Color settings
    const bg = useColorModeValue("white", "gray.800");
    const greenColor = useColorModeValue("green.600", "green.300");
    const redColor = useColorModeValue("red.600", "red.300");
    const textGreenScheme = useColorModeValue("white", "gray.800");

    //Text Settings
    const [language, setLanguage] = useState('en');
    const markdownStyles = {
        h1: { fontSize: '2em', fontWeight: 'bold', marginBottom: '0.5em' },
        h2: { fontSize: '1.5em', fontWeight: 'bold', marginBottom: '0.5em' },
        h3: { fontSize: '1.2em', fontWeight: 'bold', marginBottom: '0.5em' },
        h4: { fontSize: '1em', fontWeight: 'bold', marginBottom: '0.5em' },
        h5: { fontSize: '0.9em', fontWeight: 'bold', marginBottom: '0.5em' },
        h6: { fontSize: '0.8em', fontWeight: 'bold', marginBottom: '0.5em' },
        ul: { listStyle: 'disc', marginLeft: '1em' },
        'ul ul': { listStyle: 'circle', marginLeft: '2em' },
        'ul ul ul': { listStyle: 'square', marginLeft: '3em' },
        'ul ul ul ul': { listStyle: 'disc', marginLeft: '4em' },
        ol: { listStyle: 'decimal', marginLeft: '1em' },
        'ol ol': { listStyle: 'lower-alpha', marginLeft: '2em' },
        'ol ol ol': { listStyle: 'lower-roman', marginLeft: '3em' },
        'ol ol ol ol': { listStyle: 'decimal', marginLeft: '4em' },
        li: { marginBottom: '0.5em' },
        p: { marginBottom: '1em' },
        a: { textDecoration: 'underline' },
        strong: { fontWeight: 'bold' },
        em: { fontStyle: 'italic' },
        code: { fontFamily: 'monospace', padding: '2px 4px' },
        blockquote: { padding: '10px', borderLeft: { textGreenScheme } }
    }

    //Interactive settings
    const toast = useToast();
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

    const openSimpleErrorModal = (message, callback) => {
        openSimpleModal(
            'Error',
            language ? message[language] : message.en,
            callback
        );
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

    const openToast = (title = null, message, type, isClosable = true) => {
        toast({
            title: title,
            description: message,
            status: type,
            isClosable: isClosable
        });
    }

    return (
        <UIContext.Provider value={{
            bg,
            greenColor,
            redColor,
            textGreenScheme,
            language,
            setLanguage,
            markdownStyles,
            showModal,
            setShowModal,
            modalOptions,
            setModalOptions,
            pageLoaded,
            setPageLoaded,
            changeLanguage,
            getLocalLanguage,
            openSimpleModal,
            openSimpleErrorModal,
            openErrorAuthModal,
            openExpiredSessionModal,
            openAccessDeniedModal,
            openToast
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