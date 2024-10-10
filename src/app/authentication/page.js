"use client"

//React imports
import { useContext, Suspense, useState, useEffect } from "react";

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
import { UIContext } from "../context/UIContext";

export default function Authentication() {
    const { bg, pageLoaded, setPageLoaded } = useContext(UIContext);

    useEffect(() => {
        setPageLoaded(true);
    }, []);

    return (
        <>
            {pageLoaded ?
                <Flex
                    w="100%"
                    h="100vh"
                    justify="center"
                    align="center"
                    bg={bg} >
                    <Card w="80%" h={750} p={0} >
                        <CardBody display="flex" flexDirection="row" p={0} >
                            <Show above="lg">
                                <Box w="50%" h="100%">
                                    <Image
                                        src="/login-image.jpg"
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
                                <Suspense>
                                    <FormComponent />
                                </Suspense>
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