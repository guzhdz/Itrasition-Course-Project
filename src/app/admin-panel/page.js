"use client"
//React imports
import { useContext, useEffect } from "react";
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
import { UIContext } from "../context/UIContext";
import { AuthContext } from "../context/AuthContext";

export default function AdminPanel() {
  const router = useRouter();
  const { bg, language, openSimpleModal, pageLoaded, setPageLoaded } = useContext(UIContext);
  const { checkAuth } = useContext(AuthContext);

  const authenticate = async (chefForAdmin = false) => {
    const response = await checkAuth();
    if (response.ok) {
      if (chefForAdmin) {
        return checkAdmin(response);
      }
      return true;
    } else {
      if (response.message) {
        setPageLoaded(false);
        openSimpleModal(
          language === "es" ? 'Autenticación fallida' : 'Authentication failed',
          language ? response.message[language] : response.message.en,
          () => router.push('/main')
        );
      } else {
        setPageLoaded(false);
        openSimpleModal(
          language === "es" ? 'Sesión expirada' : 'Session expired',
          language === "es" ? 'La sesión ha expirado, por favor inicia sesión nuevamente' :
            'Your session has expired, please log in again',
          () => router.push('/main')
        );
      }
      return false;
    }
  }

  const initializePage = async () => {
    const isAuth = await authenticate(true);
    if (isAuth) {
      setPageLoaded(true);
    }
  }

  const checkAdmin = (response) => {
    if (response?.data?.is_admin) {
      return true;
    } else {
      setPageLoaded(false);
      openSimpleModal(
        language === "es" ? 'Acceso denegado' : 'Access denied',
        language === "es" ? 'No eres parte de la administración' : 'You are not part of the administration',
        () => router.push('/main')
      );
      return false;
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
          direction="column"
          bg={bg} >

          <Header checkAuth={authenticate} refreshPage={initializePage} />

          <Box maxW="1400px" mx="auto" width="80%" p={3}>
            <Heading mb="60px">{language === "es" ? "Panel de administración" : "Admin Panel"}</Heading>

            <TableTabs checkAuth={authenticate} />
          </Box>
        </Flex>
        :
        <LoadingPage />
      }
    </>

  );
}