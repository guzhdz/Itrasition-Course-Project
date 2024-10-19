"use client"

//React/Next imports
import { useEffect } from "react";
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
        setPageLoaded } = useUI();
    const { checkAuth } = useAuth();

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

    const initializePage = async () => {
        const authCase = await authenticate();
        const isAuth = handleAuthCase(authCase);
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
                    h="100vh"
                    minH="100vh"
                    direction="column"
                    bg={bg} >

                    <Header refreshPage={initializePage} />

                    <Box maxW="1400px" mx="auto" width="80%" p={3}>
                        <Heading mb="40px">{language === "es" ? "Mi Dashboard" : "My Dashboard"}</Heading>
                        
                        <UserBanner />

                        <DashboardTabs checkAuth={async () => {
                            const authCase = await authenticate();
                            return handleAuthCase(authCase);
                        }}/>
                    </Box>
                </Flex >
                :
                <LoadingPage />
            }
        </>

    );
}
