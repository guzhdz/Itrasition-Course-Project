"use client"

//React/Next imports
import { useEffect } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
    Flex,
    Box,
    Heading,
    IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

//Components import
import Header from '../components/shared/Header'
import LoadingPage from '../components/shared/LoadingPage'
import TemplatesResults from "../components/search-results/TemplatesResults";
import HelpButton from "../components/shared/help/HelpButton";

//Context imports
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";


export default function SearchResults() {
    const router = useRouter();
    const {
        bg,
        openErrorAuthModal,
        openExpiredSessionModal,
        pageLoaded,
        setPageLoaded,
        language
    } = useUI();
    const { checkAuth, user } = useAuth();

    const authenticate = async (initial) => {
        const response = await checkAuth();
        if (response.ok) {
            return { case: 1 };
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
                openErrorAuthModal(authCase.message, () => router.push('/main'));
                return false;

            case 3:
                return true;

            case 4:
                setPageLoaded(false);
                openExpiredSessionModal(() => router.push('/main'));
                return false;

            default:
                router.push('/main');
                return false;
        }
    }

    const initializePage = async (initial = false) => {
        const authCase = await authenticate(initial);
        const isAuth = handleAuthCase(authCase);
        isAuth && setPageLoaded(true);
    }

    useEffect(() => {
        initializePage(true);
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
                    <Box maxW="1400px" mx="auto" width={{ base: "90%", lg: "85%" }} mb={10}>
                        <Flex gap={4} align="center" mb="40px">
                            <IconButton
                                onClick={() => {
                                    setPageLoaded(false);
                                    router.back();
                                }}
                                colorScheme="green"
                                variant="ghost"
                                icon={<ArrowBackIcon />} />
                            <Heading>{language === "es" ? "Resultados de búsqueda" : "Search Results"}</Heading>
                        </Flex>

                        <TemplatesResults />
                    </Box>

                    {user !== null && <HelpButton />}
                </Flex>
                :
                <LoadingPage />
            }
        </>
    );
}
