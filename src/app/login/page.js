"use client"

//Chakra imports
import { 
    useColorModeValue,
    Box,
    Card,
    CardBody
} from "@chakra-ui/react";

export default function Login() {
    const bg = useColorModeValue("gray.100", "gray.700");
    
    return(
        <Box w="100%" h="100vh" display="flex" justifyContent="center" alignItems="center">
            <Card w="80%" h="750px">
                <CardBody>
                    Login
                </CardBody>
            </Card>
        </Box>
    );
}