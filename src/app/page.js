"use client"

//React/Next imports
import { useRouter } from "next/navigation";

//Styles import
import styles from "./page.module.css";

//Chakra imports
import { Button, useColorMode } from "@chakra-ui/react";

export default function Main() {
  const router = useRouter();
  const {colorMode, toggleColorMode} = useColorMode();

  return (
    <>
    <h1>Hello World!</h1>
    <Button colorScheme="green" onClick={() => router.push("/authentication")}>Log in</Button>
    <Button colorScheme="green">Sign up</Button>
    <Button colorScheme="green" onClick={toggleColorMode}>Toggle color mode</Button>
    </>
  );
}
