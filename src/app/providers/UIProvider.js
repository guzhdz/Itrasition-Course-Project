'use client'

import { ChakraProvider } from '@chakra-ui/react'

export default function UIProvider({ children }) {
  return <ChakraProvider>{children}</ChakraProvider>
}