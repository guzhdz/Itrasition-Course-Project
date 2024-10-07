"use client"
//React imports
import { useContext } from "react";

//Chakra imports
import {
  Box,
} from "@chakra-ui/react";

//Components imports
import Header from '../components/shared/Header'

//Context imports
import { UIContext } from "../context/UIContext";

export default function AdminPanel() {

  const { bg } = useContext(UIContext);

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      flexDirection="column" 
      bg={bg} >

        <Header />
    </Box>
  );
}