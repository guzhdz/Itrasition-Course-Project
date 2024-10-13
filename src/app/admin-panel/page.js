"use client"

//React/Next imports
import { useEffect } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
  Box,
  Flex,
  Heading,
} from "@chakra-ui/react";

//Components imports
import Header from '../components/shared/Header'
import TableTabs from "../components/admin-panel/TableTabs";
import LoadingPage from "../components/shared/LoadingPage";

//Context imports
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";

export default function AdminPanel() {
  const router = useRouter();
  const {
    bg,
    language,
    openErrorAuthModal,
    openExpiredSessionModal,
    openAccessDeniedModal,
    pageLoaded,
    setPageLoaded
  } = useUI();
  const { checkAuth } = useAuth();

  const authenticate = async () => {
    const response = await checkAuth();
    if (response.ok) {
      return checkAdmin(response);
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
        openErrorAuthModal(authCase.message, () => router.push('/main'));
        return false;

      case 3:
        setPageLoaded(false);
        openExpiredSessionModal(() => router.push('/main'));
        return false

      case 4:
        setPageLoaded(false);
        openAccessDeniedModal(() => router.push('/main'));
        return false;

      default:
        router.push('/');
        return false;
    }
  }

  const checkAdmin = (response) => {
    if (response?.data?.is_admin) {
      return { case: 1 };
    } else {
      return { case: 4 };
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
          direction="column"
          bg={bg} >

          <Header refreshPage={initializePage} />

          <Box maxW="1400px" mx="auto" width="80%" p={3}>
            <Heading mb="60px">{language === "es" ? "Panel de administración" : "Admin Panel"}</Heading>

            <TableTabs checkAuth={async () => {
              const authCase = await authenticate();
              return handleAuthCase(authCase);
            }} />
          </Box>
        </Flex>
        :
        <LoadingPage />
      }
    </>

  );
}