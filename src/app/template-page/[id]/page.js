"use client"

//React/Next imports
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

//Chakra imports
import {
  Flex,
  Box,
  Heading,
  Button,
  Show,
  IconButton
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

//Components import
import Header from '../../components/shared/Header'
import LoadingPage from '../../components/shared/LoadingPage'
import TemplatePageTabs from "../../components/template-page/TemplatePageTabs";
import ConfirmModal from "../../components/shared/ConfirmModal";
import HelpButton from "../../components/shared/help/HelpButton";

//Services imports
import { getTemplate } from "../../services/templateService";

//Library imports
import { FaSave } from "react-icons/fa";

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
    language,
    openToast
  } = useUI();
  const { checkAuth } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(true);


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

  const checkAuthProcess = async () => {
    const authCase = await authenticate();
    const isAuth = handleAuthCase(authCase);
    return isAuth ? await validateTemplate(authCase.user) : false;
  }

  const initializePage = async () => {
    const isOwner = await checkAuthProcess();
    isOwner && setPageLoaded(true);
  }

  const validateTemplate = async (user) => {
    const response = await getTemplate(id, "getTemplateOwner");
    if (response.ok) {
      const template = response.data;
      if (template === null) {
        setPageLoaded(false);
        openToast(
          'Error',
          language === "es" ? 'No existe este formulario' : 'This form does not exist',
          'error'
        );
        router.push('/dashboard');
        return false
      }
      if (template.user_id === user.id_user || user.is_admin) {
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

  const openConfirmModal = async () => {
    setShowModal(true);
  };


  useEffect(() => {
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
          <Box maxW="1400px" mx="auto" width={{ base: "90%", lg: "85%" }}>
            <Flex gap={4} align="center" mb="40px">
              <IconButton
                onClick={() => {
                  setPageLoaded(false);
                  router.back();
                }}
                colorScheme="green"
                variant="ghost"
                icon={<ArrowBackIcon />} />
              <Heading>{language === "es" ? "Personaliza tu plantilla" : "Customize your template"}</Heading>
            </Flex>

            <Flex justify="flex-end">
              <Show above="sm">
                <Button
                  colorScheme="green"
                  isLoading={isSavingChanges}
                  onClick={openConfirmModal} >
                  {language === "es" ? "Guardar cambios" : "Save changes"}
                </Button>
              </Show>

              <Show below="sm">
                <IconButton
                  colorScheme="green"
                  isLoading={isSavingChanges}
                  icon={<FaSave />}
                  onClick={openConfirmModal} />
              </Show>
            </Flex>

            <TemplatePageTabs
              id={id}
              isSavingChanges={isSavingChanges}
              setIsSavingChanges={setIsSavingChanges}
              checkAuth={checkAuthProcess} />
          </Box>

          <HelpButton />
        </Flex>
        :
        <LoadingPage />
      }

      <ConfirmModal
        showModal={showModal}
        setShowModal={setShowModal}
        confirmCallback={() => setIsSavingChanges(true)}
        title={language === "es" ? "Guardar todos los cambios" : "Save all changes"}
        message={language === "es" ? "¿Deseas guardar todos los cambios?" : "Do you want to save all the changes?"} />
    </>

  );
}
