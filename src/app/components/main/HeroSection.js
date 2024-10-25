"use client"

//Chakra imports
import {
    Flex,
    Box,
    Heading,
    Image,
    Button,
    Text,
    Show
} from "@chakra-ui/react";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";

function HeroSection({ goTo }) {
    const { language } = useUI();
    const { user } = useAuth();


    return (
        <Box maxW="2000px" mx="auto" width="85%" height="90vh" p={3}>
            <Flex align="center" height="100%" >
                <Box w={{ base: "100%", lg: "50%" }} h={{ base: "100%", lg: "80%" }} >
                    <Flex direction="column" justify="center" align={{ base: "center", lg: "flex-start" }} height="100%" gap={10}>
                        <Heading as='h1' size='3xl' textAlign={{ base: "center", lg: "left" }}>
                            {language === "es" ? "Crea, Configura y Comparte Tus Plantillas Facilmente"
                                : "Create, Configure, and Share Your Templates Easily."}
                        </Heading>

                        <Text fontSize="xl" width="70%" textAlign={{ base: "center", lg: "left" }}>
                            {language === "es" ? "Diseña, comparte y recopila respuestas en solo unos pocos clics. Simple, flexible, y poderoso."
                                : "Design, share, and collect responses in just a few clicks. Simple, flexible, and powerful."}
                        </Text>

                        {user === null && <Button
                            colorScheme="green"
                            width="150px"
                            onClick={() => goTo('/authentication?form=signup')}>
                            {language === "es" ? "Comenzar" : "Get Started"}
                        </Button>}

                        {user !== null && <Button
                            colorScheme="green"
                            width="150px"
                            onClick={() => goTo('/dashboard')}>
                            Dashboard
                        </Button>}
                    </Flex>
                </Box>

                <Show above='lg'>
                    <Box w="50%" h="70%">
                        <Image
                            src="https://res.cloudinary.com/da7gnzwis/image/upload/v1729740418/main-image_qldod3.png"
                            alt="Login image"
                            w="100%"
                            h="100%"
                            objectFit="contain" />
                    </Box>
                </Show>

            </Flex>
        </Box>
    );
}

export default HeroSection;