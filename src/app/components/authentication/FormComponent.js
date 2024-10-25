//React/Next imports
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

//Chakra imports
import {
    Heading,
    Text,
    Box,
    Alert,
    AlertIcon,
    SlideFade,
    Flex
} from "@chakra-ui/react";

//Components imports
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import CenterSpinner from "../shared/CenterSpinner";

//Context imports
import { useUI } from "../../context/UIContext";

const FormComponent = () => {
    const searchParams = useSearchParams();
    const form = searchParams.get("form");
    const { language } = useUI();
    const formsTexts = [
        {
            title: "Log In",
            subtitle: "Enter your credentials to access your account",
            titulo: "Iniciar Sesion",
            subtitulo: "Ingresa tus datos para acceder a tu cuenta",
        },
        {
            title: "Create an Account",
            subtitle: "Create your account to get started.",
            titulo: "Crear Cuenta",
            subtitulo: "Crea tu cuenta para comenzar.",
        }
    ];
    const [formType, setFormType] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showForm, setShowForm] = useState(true);

    const toogleForm = () => {
        setShowForm(false);
        setErrorMessage("");
        setShowPassword(false);
        setTimeout(() => {
            setFormType(formType === 0 ? 1 : 0);
            setShowForm(true);
        }, 500);
    };

    const tooglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        form && setFormType(form === "signup" ? 1 : 0);
    }, []);

    return (
        <>
            <Flex
                my={4}
                direction="column"
                align={"center"}
                w={{ base: '80%', lg: '60%' }}
                maxWidth="350px" >

                <SlideFade in={showForm} transition={{ enter: { duration: 0.3 } }} >
                    <Box w={{base: 'auto', sm: '340px', lg: '300px'}}>
                    <Heading
                        as="h1"
                        size="xl"
                        mb={4}
                        textAlign={"center"}>
                        {formsTexts[formType][language === "es" ? "titulo" : "title"]}
                    </Heading>
                    <Text
                        mb={10}
                        textAlign={"center"}>
                        {formsTexts[formType][language === "es" ? "subtitulo" : "subtitle"]}
                    </Text>

                    <Box w="100%">
                        {loading && <CenterSpinner size="lg" />}

                        {errorMessage && (
                            <Alert status="error" mb={3} variant='left-accent'>
                                <AlertIcon />
                                {errorMessage}
                            </Alert>
                        )}

                        {formType === 0 &&
                            <LoginForm
                                toogleForm={toogleForm}
                                setErrorMessage={setErrorMessage}
                                setLoading={setLoading}
                                loading={loading}
                                tooglePasswordVisibility={tooglePasswordVisibility}
                                showPassword={showPassword}
                            />
                        }
                        {formType === 1 &&
                            <RegisterForm
                                toogleForm={toogleForm}
                                setErrorMessage={setErrorMessage}
                                setLoading={setLoading}
                                loading={loading}
                                tooglePasswordVisibility={tooglePasswordVisibility}
                                showPassword={showPassword} />
                        }
                    </Box>
                    </Box>
                </SlideFade>
            </Flex>
        </>
    )
}

export default FormComponent;