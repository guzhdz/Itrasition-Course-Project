"use client"

//React/Next imports
import { useContext } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
  Button,
  useColorMode,
  Flex
} from "@chakra-ui/react";

//Components import
import Header from './components/shared/Header'

//Context imports
import { UIContext } from "./context/UIContext";

export default function Main() {
  const router = useRouter();
  const { bg } = useContext(UIContext);

  return (
    <Flex
      w="100%"
      h="100vh"
      direction="column" 
      bg={bg} >

        <Header />
    </Flex>
  );
}
