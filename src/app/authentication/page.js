"use client"

//React/Next imports
import { useEffect } from "react";

//Chakra imports
import {
    Box,
    Card,
    CardBody,
    Image,
    Show,
    Flex
} from "@chakra-ui/react";

//Components imports
import FormComponent from "../components/authentication/FormComponent";
import LoadingPage from "../components/shared/LoadingPage";

//Context imports
import { useUI } from "../context/UIContext";

export default function Authentication() {
    const { bg, pageLoaded, setPageLoaded } = useUI();

    useEffect(() => {
        setPageLoaded(true);
    }, []);

    return (
        <>
            {pageLoaded ?
                <Flex
                    w="100%"
                    h="100vh"
                    minH="100vh"
                    justify="center"
                    align="center"
                    bg={bg} >
                    <Card w="80%" minW="300px" h={{ base: "500", lg: "750px" }} p={0} >
                        <CardBody display="flex" flexDirection="row" p={0} >

                            <Show above="lg">
                                <Box w="50%" h="100%">
                                    <Image
                                        src="https://res.cloudinary.com/da7gnzwis/image/upload/v1729101437/login-image_aqao0z.jpg"
                                        alt="Login image"
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        borderLeftRadius="md" />
                                </Box>
                            </Show>

                            <Flex
                                w={{ base: '100%', lg: '50%' }}
                                h="100%"
                                justify="center"
                                align="center"
                                direction="column" >
                                <FormComponent />
                            </Flex>
                        </CardBody>
                    </Card>
                </Flex>
                :
                <LoadingPage />
            }
        </>
    );
}