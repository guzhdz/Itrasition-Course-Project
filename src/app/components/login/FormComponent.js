//Chakra imports
import {
    Heading,
    Text,
    Box
} from "@chakra-ui/react";

//Components imports
import LoginForm from "./LoginForm";

const FormComponent = () => {
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