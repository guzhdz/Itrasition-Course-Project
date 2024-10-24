"use client"
//React/Next imports
import { useEffect } from "react";

//Chakra imports
import {
    Flex,
    Box,
    Heading,
    Image,
    Button,
    Text
} from "@chakra-ui/react";

//Services imports
import { getLatestTemplates } from "../../services/templateService";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";

function LatestTemplates() {
    const { language } = useUI();
    const { user } = useAuth();

    const getTemplates = async () => {
        const response = await getLatestTemplates();
        if (response.ok) {
            console.log(response.data);
        } else {
            console.log("Error");
        }
    };

    useEffect(() => {
        getTemplates();
    }, []);


    return (
        <Box maxW="2000px" mx="auto" width="85%" p={3} >
            <Heading>{language === "es" ? "Plantillas Recientes" : "Latest Templates"}</Heading>
        </Box>
    );
}

export default LatestTemplates;