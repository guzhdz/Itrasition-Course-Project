//React imports
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "next/navigation";

//Chakra imports
import {
    Heading,
    Text,
    Box,
    Alert,
    AlertIcon,
    SlideFade
} from "@chakra-ui/react";

//Components imports
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import CenterSpinner from "../shared/CenterSpinner";

//Context imports
import { UIContext } from "../../context/UIContext";

const FormComponent = () => {
    const searchParams = useSearchParams();
    const form = searchParams.get("form");
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
    const { language } = useContext(UIContext);

    const toogleForm = () => {
        setShowForm(false);
        setTimeout(() => {
            setFormType(formType === 0 ? 1 : 0);
            setErrorMessage("");
            setShowPassword(false);
            setShowForm(true);
        }, 500);
    };

    const tooglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (form) {
            setFormType(form === "signup" ? 1 : 0);
        }
    }, []);

    return (
        <>
            <Box
                my={4}
                display="flex"
                flexDirection="column"
                alignItems={"center"}
                w={{ base: '80%', lg: '60%' }}
                maxWidth="350px" >

                <SlideFade in={showForm} transition={{ enter: { duration: 0.3 } }}>
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
                </SlideFade>
            </Box>
        </>
    )
}

export default FormComponent;