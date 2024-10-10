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
import SimpleModal from "../components/shared/SimpleModal";

//Context imports
import { UIContext } from "../context/UIContext";
import { AuthContext } from "../context/AuthContext";

export default function AdminPanel() {
  const router = useRouter();
  const { bg, language, openSimpleModal, showModal, setShowModal, modalInfo, pageLoaded, setPageLoaded } = useContext(UIContext);
  const { checkAuth, user } = useContext(AuthContext);

  const callCheckAuth = async () => {
    const response = await checkAuth();
    if (!response?.ok) {
      setPageLoaded(false);
      handleResponse(response);
      return false;
    } else {
      if(response?.data?.is_admin) {
        setPageLoaded(true);
        return true;
      } else {
        router.push('/');
      }
    }
  }

  const handleResponse = (response) => {
    if (response?.message) {
      openSimpleModal(
        language === "es" ? 'Autenticación fallida' : 'Authentication failed',
        language ? response.message[language] : response.message.en,
        () => router.push('/')
      )
    } else {
      openSimpleModal(
        language === "es" ? 'Sesión expirada' : 'Session expired',
        language === "es" ? 'La sesión ha expirado, por favor inicia sesión nuevamente' :
          'Your session has expired, please log in again',
        () => router.push('/')
      );
    }
  }

  const initializePage = async() => {
    await callCheckAuth();
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

            <TableTabs callCheckAuth={callCheckAuth} />
          </Box>
        </Flex>
        :
        <LoadingPage />
      }

      <SimpleModal
        title={modalInfo.title}
        message={modalInfo.message}
        showModal={showModal}
        setShowModal={setShowModal}
        closeCallback={modalInfo.closeCallback} />
    </>

  );
}