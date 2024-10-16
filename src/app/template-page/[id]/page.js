"use client"

//React/Next imports
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

//Chakra imports
import {
  Flex,
  Box,
  Heading,
  Button
} from "@chakra-ui/react";

//Components import
import Header from '../../components/shared/Header'
import LoadingPage from '../../components/shared/LoadingPage'
import TemplatePageTabs from "../../components/template-page/TemplatePageTabs";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";


export default function TemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = BigInt(params.id);
  const {
    bg,
    openErrorAuthModal,
    openExpiredSessionModal,
    pageLoaded,
    setPageLoaded,
    language } = useUI();
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
    console.log(id);
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
            <Heading mb="40px">{language === "es" ? "Personaliza tu plantilla" : "Customize your template"}</Heading>

            <Flex justify="flex-end" gap={4}>
              <Button colorScheme="green">{language === "es" ? "Guardar cambios" : "Save changes"}</Button>
              <Button colorScheme="green" variant="outline">{language === "es" ? "Vista previa" : "Preview"}</Button>
            </Flex>

            <TemplatePageTabs id={id} />
          </Box>
        </Flex>
        :
        <LoadingPage />
      }
    </>

  );
}
