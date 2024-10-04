"use client"

//React imports
import { useContext } from "react";

//Chakra imports
import {
    Box,
    Card,
    CardBody,
    Image,
    Show
} from "@chakra-ui/react";

//Components imports
import FormComponent from "../components/authentication/FormComponent";

//Context imports
import { ModeColorContext } from "../context/ModeColorContext";

export default function Authentication() {
    const { bg } = useContext(ModeColorContext);

    return (
        <Box
            w="100%"
            h="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
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

                    <Box
                        w={{ base: '100%', lg: '50%' }}
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