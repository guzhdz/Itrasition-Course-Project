"use client"

//React/Next imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
    Flex,
    Box,
    Heading
} from "@chakra-ui/react";

//Components import
import Header from '../components/shared/Header'
import LoadingPage from '../components/shared/LoadingPage'
import UserBanner from "../components/dashboard/UserBanner";
import DashboardTabs from "../components/dashboard/DashboardTabs";

//Services imports
import { getTemplatesUser } from "../services/templateService";
import { getFormsUser } from "../services/formService";

//Context imports
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";


export default function Dashboard() {
    const router = useRouter();
    const {
        bg,
        language,
        openErrorAuthModal,
        openExpiredSessionModal,
        pageLoaded,
        openToast,
        setPageLoaded } = useUI();
    const { checkAuth, user } = useAuth();
    const [templatesNumber, setTemplatesNumber] = useState(0);
    const [formsNumber, setFormsNumber] = useState(0);

    const authenticate = async () => {
        const response = await checkAuth();
        if (response.ok) {
            return { case: 1 };
        } else {
            if (response.message) {
                return { case: 2, message: response.message };
            } else {
                return { case: 3 };
            }
        }
    }

    const handleAuthCase = (authCase) => {
        switch (authCase.case) {
            case 1:
                return true;

            case 2:
                setPageLoaded(false);
                openErrorAuthModal(authCase.message, () => router.push('/'));
                return false;

            case 3:
                setPageLoaded(false);
                openExpiredSessionModal(() => router.push('/'));
                return false;

            default:
                return false;
        }
    }

    const checkAuthProcess = async () => {
        const authCase = await authenticate();
        return handleAuthCase(authCase);
    }

    const initializePage = async () => {
        const isAuth = await checkAuthProcess();
        isAuth && setPageLoaded(true);
    }

    const loadTemplates = async () => {
        const response = await getTemplatesUser(user.id_user);
        if (response.ok) {
            setTemplatesNumber(response.data.length);
            return response.data;
        } else {
            let messageError = language === "es" ? "Error al cargar las plantillas. Por favor, intenta de nuevo."
                : "Error loading templates. Please try again later.";
            if (response.message) {
                messageError = language === "es" ? response.message[language] : response.message.en;
            }
            openToast("Error", messageError, "error");
            setTemplatesNumber(0);
            return [];
        }
    }

    const loadForms = async () => {
        const response = await getFormsUser(user.id_user);
        if (response.ok) {
            setFormsNumber(response.data.length);
            return response.data;
        } else {
            let messageError = language === "es" ? "Error al cargar los formularios. Por favor, intenta de nuevo."
                : "Error loading forms. Please try again later.";
            if (response.message) {
                messageError = language === "es" ? response.message[language] : response.message.en;
            }
            openToast("Error", messageError, "error");
            setFormsNumber(0);
            return [];
        }
    }

    useEffect(() => {
        initializePage();
    }, []);


    return (
        <>
            {pageLoaded ?
                <Flex
                    w="100%"
                    h="100vh"
                    minH="100vh"
                    direction="column"
                    bg={bg} >

                    <Header refreshPage={initializePage} />

                    <Box maxW="1400px" mx="auto" width={{ base: "90%", lg: "80%" }} p={3}>
                        <Heading mb="40px">{language === "es" ? "Mi Dashboard" : "My Dashboard"}</Heading>

                        <UserBanner templatesNumber={templatesNumber} formsNumber={formsNumber} />

                        <DashboardTabs
                            checkAuth={checkAuthProcess}
                            loadTemplates={loadTemplates}
                            loadForms={loadForms} />
                    </Box>
                </Flex >
                :
                <LoadingPage />
            }
        </>

    );
}
