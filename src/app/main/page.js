"use client"

//React/Next imports
import { useEffect } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
  Flex,
} from "@chakra-ui/react";

//Components import
import Header from '../components/shared/Header'
import LoadingPage from '../components/shared/LoadingPage'
import HeroSection from "../components/main/HeroSection";
import LatestTemplates from "../components/main/LatestTemplates";

//Context imports
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext";


export default function Main() {
  const router = useRouter();
  const {
    bg,
    openErrorAuthModal,
    openExpiredSessionModal,
    pageLoaded,
    setPageLoaded
  } = useUI();
  const { checkAuth } = useAuth();

  const authenticate = async (home) => {
    const response = await checkAuth();
    if (response.ok) {
      return { case: 1 };
    } else {
      if (response.message) {
        return { case: 2, message: response.message };
      } else {
        return home ? { case: 3 } : { case: 4 };
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
        return true;

      case 4:
        setPageLoaded(false);
        openExpiredSessionModal(() => router.push('/'));
        return false;

      default:
        router.push('/');
        return false;
    }
  }

  const initializePage = async (home = false) => {
    const authCase = await authenticate(home);
    const isAuth = handleAuthCase(authCase);
    isAuth && setPageLoaded(true);
  }

  const goTo = (path) => {
    setPageLoaded(false);
    router.push(path);
  }

  useEffect(() => {
    initializePage(true);
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
          <HeroSection goTo={goTo} />
          <LatestTemplates />
        </Flex>
        :
        <LoadingPage />
      }
    </>
  );
}
