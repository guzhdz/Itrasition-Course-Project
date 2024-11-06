"use client"

//React/Next imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
    Flex,
    Box,
    Heading,
    Text,
    IconButton,
    Icon,
    Card,
    Skeleton
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

//Components import
import Header from '../components/shared/Header'
import LoadingPage from '../components/shared/LoadingPage'
import SFForm from "../components/sf-form/SFForm";
import HelpButton from "../components/shared/help/HelpButton";

//Services imports
import { getAccountByAccountNumber } from "../services/salesforceService";

//Library imports
import { FaCheckCircle } from "react-icons/fa";

//Context imports
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";


export default function SfForm() {
    const router = useRouter();
    const {
        bg,
        language,
        openErrorAuthModal,
        openExpiredSessionModal,
        openSimpleErrorModal,
        pageLoaded,
        setPageLoaded,
        greenColor } = useUI();
    const { checkAuth, user } = useAuth();
    const [accountCreated, setAccountCreated] = useState(null);

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

    const getAccount = async () => {
        const response = await getAccountByAccountNumber(user.id_user);
        if (response.ok) {
            if(response.data.length > 0)
                setAccountCreated(true);
            else
                setAccountCreated(false);
            
        } else {
            openSimpleErrorModal(
                language === "es" ? "Error al cargar la cuenta en salesforce" : "Error at loading account in salesforce",
                () => router.push('/dashboard')
            )
        }
    }

    useEffect(() => {
        initializePage();
    }, []);

    useEffect(() => {
        if (user !== null) {
            getAccount();
        }
    }, [user]);

    return (
        <>
            {pageLoaded ?
                <Flex
                    w="100%"
                    minH="100vh"
                    direction="column"
                    bg={bg} >

                    <Header refreshPage={initializePage} />

                    <Box maxW="1400px" mx="auto" width={{ base: "90%", lg: "80%" }} p={3}>
                        <Flex gap={4} align="center" mb="40px">
                            <IconButton
                                onClick={() => {
                                    setPageLoaded(false);
                                    router.back();
                                }}
                                colorScheme="green"
                                variant="ghost"
                                icon={<ArrowBackIcon />} />
                            <Heading>{language === "es" ? "Creación de cuenta de SalesForce" : "SalesForce Account Creation"}</Heading>
                        </Flex>

                        {accountCreated === null && <Skeleton height="700px"/>}

                        {accountCreated !== null && !accountCreated && <>
                            <Text fontSize="lg" mb={5}>
                                {language === "es" ? "Crea una cuenta de Salesforce llenando el formulario de abajo"
                                    : "Create a Salesforce account filling the form below"}
                            </Text>

                            <SFForm
                                checkAuth={checkAuthProcess}
                                setAccountCreated={setAccountCreated} />
                        </>}

                        {accountCreated !== null && accountCreated && <Card w="60%" mx="auto" mt="100px" minW={"300px"}>
                            <Flex direction="column" align="center" h="30vh" justify="center" gap={5}>
                                <Icon as={FaCheckCircle} boxSize={12} color={greenColor} />
                                <Text fontSize="2xl">
                                    {language === "es" ? "Cuenta de Salesforce ya creada"
                                        : "SalesForce account has been already created"}
                                </Text>
                            </Flex>
                        </Card>}
                    </Box>

                    <HelpButton />
                </Flex >
                :
                <LoadingPage />
            }
        </>

    );
}
