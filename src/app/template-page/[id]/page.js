"use client"

//React/Next imports
import { useEffect, useState } from "react";
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

//Services imports
import { getTemplate } from "../../services/templateService";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";


export default function TemplatePage() {
  const router = useRouter();
  const params = useParams();
  const id = BigInt(params.id);
  const {
    bg,
    openSimpleErrorModal,
    openErrorAuthModal,
    openExpiredSessionModal,
    openSimpleModal,
    pageLoaded,
    setPageLoaded,
    language } = useUI();
  const { checkAuth } = useAuth();
  const [isSavingChanges, setIsSavingChanges] = useState(false);


  const authenticate = async () => {
    const response = await checkAuth();
    if (response.ok) {
      return { case: 1, user: response.data };
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
    setIsSavingChanges(true);
    const authCase = await authenticate();
    const isAuth = handleAuthCase(authCase);
    if (isAuth) {
      const isOwner = await validateTemplate(authCase.user);
      isOwner && setPageLoaded(true);
    }
    setIsSavingChanges(false);
  }

  const validateTemplate = async (user) => {
    const response = await getTemplate(id, "getTemplateOwner");
    if (response.ok) {
      if (response.data.user_id === user.id_user || user.is_admin) {
        return true;
      } else {
        setPageLoaded(false);
        openSimpleModal(
          language === "es" ? 'Acceso denegado' : 'Access denied',
          language === "es" ? 'No tienes permiso para acceder a este formulario'
            : 'You do not have permission to access this form',
          () => router.push('/dashboard')
        );
        return false;
      }
    } else {
      setPageLoaded(false);
      openSimpleErrorModal(
        response.message,
        () => router.push('/dashboard')
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
          minH="100vh"
          direction="column"
          bg={bg} >

          <Header refreshPage={initializePage} />
          <Box maxW="1400px" mx="auto" width="80%">
            <Heading mb="40px">{language === "es" ? "Personaliza tu plantilla" : "Customize your template"}</Heading>

            <Flex justify="flex-end" gap={4}>
              <Button
                colorScheme="green"
                isLoading={isSavingChanges}
                onClick={() => setIsSavingChanges(true)} >
                {language === "es" ? "Guardar cambios" : "Save changes"}
              </Button>
              <Button colorScheme="green" variant="outline">{language === "es" ? "Vista previa" : "Preview"}</Button>
            </Flex>

            <TemplatePageTabs
              id={id}
              isSavingChanges={isSavingChanges}
              setIsSavingChanges={setIsSavingChanges}
              checkAuth={
                async () => {
                  const authCase = await authenticate();
                  const isAuth = handleAuthCase(authCase);
                  return isAuth ? await validateTemplate(authCase.user) : false;
                }
              } />
          </Box>
        </Flex>
        :
        <LoadingPage />
      }
    </>

  );
}
