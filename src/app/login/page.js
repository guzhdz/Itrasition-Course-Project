"use client"

//Chakra imports
import {
    useColorModeValue,
    Box,
    Card,
    CardBody,
    Image,
} from "@chakra-ui/react";

//Components imports
import FormComponent from "../components/login/FormComponent";

export default function Login() {
    const bg = useColorModeValue("gray.100", "gray.700");

    return (
        <Box
            w="100%"
            h="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center" >
            <Card w="80%" h={750} p={0} >
                <CardBody display="flex" flexDirection="row"p={0} >   
                    <Box w="50%" h="100%">
                        <Image
                            src="/login-image.jpg"
                            alt="Login image"
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            borderLeftRadius="md" />
                    </Box>

                    <Box
                        w="50%"
                        h="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column" >
                        <FormComponent />
                    </Box>
                </CardBody>
            </Card>
        </Box>
    );
}