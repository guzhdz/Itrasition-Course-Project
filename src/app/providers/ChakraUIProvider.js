'use client'

//Chakra imports
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

//Theme imports
import theme from "../theme/theme.js";

export default function ChakraUIProvider({ children }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} disableTransitionOnChange />
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </>
  );
}