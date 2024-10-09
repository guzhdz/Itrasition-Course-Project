"use client"
//React imports
import { useContext } from "react";

//Chakra imports
import {
  Box,
  Flex,
  Heading,
} from "@chakra-ui/react";

//Components imports
import Header from '../components/shared/Header'
import TableTabs from "../components/admin-panel/TableTabs";

//Context imports
import { UIContext } from "../context/UIContext";

export default function AdminPanel() {
  const { bg, language } = useContext(UIContext);

  return (
    <Flex
      w="100%"
      h="100vh"
      direction="column"
      bg={bg} >

      <Header />

      <Box maxW="1250px" mx="auto" width="80%" p={3}>
        <Heading mb="60px">{language === "es" ? "Panel de administración" : "Admin Panel"}</Heading>

        <TableTabs />
      </Box>
    </Flex>
  );
}