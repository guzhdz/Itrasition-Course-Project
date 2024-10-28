"use client"

//React/Next imports
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

//Chakra imports
import {
    Flex,
    Box
} from "@chakra-ui/react";

//Components import
import Header from '../../components/shared/Header'
import LoadingPage from '../../components/shared/LoadingPage'
import Form from "../../components/form-page/Form";

//Services imports
import { getTemplate } from "../../services/templateService";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";


export default function TemplatePage() {
    const router = useRouter();
    const params = useParams();
    const id = BigInt(params.id);
    const {
        bg,
        openSimpleErrorModal,
        openToast,
        openErrorAuthModal,
        openExpiredSessionModal,
        pageLoaded,
        setPageLoaded,
        language
    } = useUI();
    const [templateInfo, setTemplateInfo] = useState({});
    const { checkAuth } = useAuth();


    const authenticate = async (initial) => {
        const response = await checkAuth();
        if (response.ok) {
            return { case: 1, user: response.data };
        } else {
            if (response.message) {
                return { case: 2, message: response.message };
            } else {
                return initial ? { case: 3 } : { case: 4 };
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
                return true;

            case 4:
                setPageLoaded(false);
                openExpiredSessionModal(() => router.push('/'));
                return false;

            default:
                return false;
        }
    }

    const validateTemplate = async () => {
        const response = await getTemplate(id, "getTemplateForFill");
        if (response.ok) {
            const template = response.data;
            if (template === null) {
                setPageLoaded(false);
                openToast(
                    'Error',
                    language === "es" ? 'No existe este formulario' : 'This form does not exist',
                    'error'
                )
                router.push('/main');
                return false
            } else {
                setTemplateInfo(template);
                return true;
            }
        } else {
            setPageLoaded(false);
            openSimpleErrorModal(
                response.message,
                () => router.push('/main')
            );
            return false;
        }

    }

    const checkAuthProcess = async (inital = false) => {
        const isOk = await validateTemplate();
        if (isOk) {
            const authCase = await authenticate(inital);
            const isAuth = handleAuthCase(authCase);
            return isAuth;
        }
        else
            return false;
    }

    const initializePage = async () => {
        const isAuth = await checkAuthProcess(true);
        if (isAuth) {
            setPageLoaded(true);
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
                    <Box maxW="1400px" mx="auto" width="80%">
                        <Form templateInfo={templateInfo} checkAuth={checkAuthProcess} />
                    </Box>
                </Flex>
                :
                <LoadingPage />
            }
        </>

    );
}
