"use client"

//React/Next imports
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
  Flex
} from "@chakra-ui/react";

//Components import
import Header from '../components/shared/Header'
import LoadingPage from '../components/shared/LoadingPage'

//Context imports
import { UIContext } from "../context/UIContext";
import { AuthContext } from "../context/AuthContext";


export default function Main() {
  const router = useRouter();
  const { bg, language, openSimpleModal, pageLoaded, setPageLoaded } = useContext(UIContext);
  const { checkAuth } = useContext(AuthContext);

  const authenticate = async (initial = false) => {
    const response = await checkAuth();
    if (response.ok) {
      return true;
    } else {
      if (response.message) {
        setPageLoaded(false);
        openSimpleModal(
          language === "es" ? 'Autenticación fallida' : 'Authentication failed',
          language ? response.message[language] : response.message.en,
          () => router.push('/')
        );
      } else if (!initial) {
        setPageLoaded(false);
        openSimpleModal(
          language === "es" ? 'Sesión expirada' : 'Session expired',
          language === "es" ? 'La sesión ha expirado, por favor inicia sesión nuevamente' :
            'Your session has expired, please log in again',
          () => router.push('/')
        );
      } else {
        return true;
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
        </Flex>
        :
        <LoadingPage />
      }
    </>

  );
}
