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

  const callCheckAuth = async () => {
    return await checkAuth();
  }

  const checkAdmin = (response) => {
    if (response?.data?.is_admin) {
      setPageLoaded(true);
      return true;
    } else {
      setPageLoaded(false);
      openSimpleModal(
        language === "es" ? 'No tienes los permisos necesarios' : 'You do not have the necessary permissions',
        language === "es" ? 'No eres parte de la administración' : 'You are not part of the administration',
        () => router.push('/')
      );
      router.push('/');
      return false;
    }
  }

  const handleResponse = (response) => {
    if (!response?.ok) {
      setPageLoaded(false);
      if (response?.message) {
        openSimpleModal(
          language === "es" ? 'Autenticación fallida' : 'Authentication failed',
          language ? response.message[language] : response.message.en,
          () => router.push('/')
        );
      } else {
        openSimpleModal(
          language === "es" ? 'Sesión expirada' : 'Session expired',
          language === "es" ? 'La sesión ha expirado, por favor inicia sesión nuevamente' :
            'Your session has expired, please log in again',
          () => router.push('/')
        );
      }
      return false;
    } else {
      return checkAdmin(response);
    }
  }

  const initializePage = async () => {
    const response = await callCheckAuth();
    return handleResponse(response);
  };

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

          <Header initializePage={initializePage} />

          <Box maxW="1400px" mx="auto" width="80%" p={3}>
            <Heading mb="60px">{language === "es" ? "Panel de administración" : "Admin Panel"}</Heading>

            <TableTabs callCheckAuth={initializePage} />
          </Box>
        </Flex>
        :
        <LoadingPage />
      }
    </>

  );
}