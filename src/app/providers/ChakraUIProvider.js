'use client'

//Theme imports
import theme from "../theme/theme.js";

//Chakra imports
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

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