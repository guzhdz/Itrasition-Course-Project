"use client"

//React/Next imports
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
  Flex
} from "@chakra-ui/react";

//Components import
import Header from './components/shared/Header'
import LoadingPage from './components/shared/LoadingPage'

//Context imports
import { UIContext } from "./context/UIContext";
import { AuthContext } from "./context/AuthContext";

export default function Main() {
  const router = useRouter();
  const { bg, language, openSimpleModal, pageLoaded, setPageLoaded } = useContext(UIContext);
  const { checkAuth } = useContext(AuthContext);

  const callCheckAuth = async () => {
    return await checkAuth();
  }

  const handleResponse = (response) => {
    if (!response?.ok && response?.message) {
      setPageLoaded(false);
      openSimpleModal(
        language === "es" ? 'Autenticación fallida' : 'Authentication failed',
        language ? response.message[language] : response.message.en,
        () => router.push('/')
      );
      setPageLoaded(true);
    } else 
      setPageLoaded(true);
  }

  const initializePage = async() => {
    const response = await callCheckAuth();
    return handleResponse(response);
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

          <Header initializePage={initializePage}/>
        </Flex>
        :
        <LoadingPage />
      }
    </>

  );
}
