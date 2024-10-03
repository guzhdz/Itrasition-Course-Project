//React imports
import { useState } from "react";

//Chakra imports
import {
    Heading,
    Text,
    Box
} from "@chakra-ui/react";

//Components imports
import LoginForm from "./LoginForm";

const FormComponent = () => {
    const [formsTexts, setFormsTexts] = useState([
        {
            title: "Log In",
            subtitle: "Enter your credentials to access your account"
        },
        {
            
        }
    ]);
    const [formType, setFormType] = useState(0);

    return (
        <>
            <Box
                my={4}
                display="flex"
                flexDirection="column"
                alignItems={"center"}
                width="55%" >
                <Heading as="h1" size="2xl" mb={4}>Log In</Heading>
                <Text mb={10}>Log in to access your account</Text>

                <LoginForm />
            </Box>
        </>
    )
}

export default FormComponent;