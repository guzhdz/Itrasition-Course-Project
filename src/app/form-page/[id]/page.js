"use client"

//React/Next imports
import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

//Chakra imports
import {
    Flex,
    Box
} from "@chakra-ui/react";

//Components import
import Header from '../../components/shared/Header'
import LoadingPage from '../../components/shared/LoadingPage'
import Form from "../../components/form-page/Form";
import HelpButton from "../../components/shared/help/HelpButton";

//Services imports
import { getTemplate } from "../../services/templateService";
import { getUser } from "../../services/userService";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";


export default function TemplatePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const id = BigInt(params.id);
    const submitterId = searchParams.get('submitter');
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
    const [submitter, setSubmitter] = useState(null);
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
                openErrorAuthModal(authCase.message, () => router.back());
                return false;

            case 3:
                return true;

            case 4:
                setPageLoaded(false);
                openExpiredSessionModal(() => router.back());
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
                router.back();
                return false
            } else {
                setTemplateInfo(template);
                return true;
            }
        } else {
            setPageLoaded(false);
            openSimpleErrorModal(
                response.message,
                () => router.back()
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

    const getSubmitterInfo = async () => {
        const submitterInfo = await getUser(parseInt(submitterId));
        if (submitterInfo.ok) {
            return submitterInfo.data;
        } else {
            setPageLoaded(false);
            openSimpleErrorModal(
                submitterInfo.message,
                () => router.back()
            );
            return null;
        }
    }

    const initializePage = async () => {
        if (submitterId !== null) {
            const submitterInfo = await getSubmitterInfo();
            console.log(submitterInfo);
            if (submitterInfo !== null)
                setSubmitter(submitterInfo);
            else
                return;
        }
        const isAuth = await checkAuthProcess(true);
        isAuth && setPageLoaded(true);
    }

    useEffect(() => {
        initializePage();
    }, []);


    return (
        <>
            {pageLoaded ?
                <Flex
                    w="100%"
                    minH="100vh"
                    direction="column"
                    bg={bg} >

                    <Header refreshPage={initializePage} />
                    <Box maxW="1400px" mx="auto" width="80%">
                        <Form templateInfo={templateInfo} checkAuth={checkAuthProcess} submitter={submitter} />
                    </Box>

                    <HelpButton />
                </Flex>
                :
                <LoadingPage />
            }
        </>

    );
}
