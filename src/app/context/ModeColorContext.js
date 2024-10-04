"use client";

//React imports
import { createContext } from "react";

//Chakra imports
import { useColorModeValue } from "@chakra-ui/react";

const ModeColorContext = createContext();

const ModeColorProvider = ({ children }) => {
    const bg = useColorModeValue("blackAlpha.100", "initial");
    const greenColor = useColorModeValue("green.500", "green.300");

    return (
        <ModeColorContext.Provider value={{ bg, greenColor }}>
            {children}
        </ModeColorContext.Provider>
    );
}

export {ModeColorContext, ModeColorProvider}