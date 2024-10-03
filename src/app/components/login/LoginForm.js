//React imports
import { useState } from "react";

//Chakra imports
import {
    Box,
    FormControl,
    FormErrorMessage,
    Input,
    Button,
    InputRightElement,
    InputGroup,
    IconButton,
    Alert,
    AlertIcon
} from "@chakra-ui/react";

//Components imports
import CenterSpinner from "../shared/CenterSpinner";

//Services imports
import { authUser } from "../../services/authService";

//Library imports
import { useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async(data) => {
        setErrorMessage("");
        setLoading(true);
        const response = await authUser(data);
        if (response.ok) {
            console.log(response.data);
        } else {
            setErrorMessage(response.message);
        }
        setLoading(false);
    };

    const tooglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box w="100%">
            { loading && <CenterSpinner size="lg"/> }

            { errorMessage && (
                <Alert status="error" mb={3} variant='left-accent'>
                    <AlertIcon />
                    {errorMessage}
                </Alert>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.email} mb={3}>
                    <Input id="email" type="email" placeholder="Email"
                        color="gray.400"
                        focusBorderColor="green.300"
                        _placeholder={{ color: 'inherit' }}
                        {
                        ...register("email",
                            {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email address",
                                },
                                maxLength: {
                                    value: 255,
                                    message: "Maximum length is 255 characters",
                                }
                            })
                        } />
                        <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                </FormControl>

                <InputGroup mb={8}>
                    <FormControl isInvalid={errors.password}>
                        <Input id="password" type={showPassword ? "text" : "password"} placeholder="Password"
                            color="gray.400"
                            focusBorderColor="green.300"
                            _placeholder={{ color: 'inherit' }}
                            {
                            ...register("password",
                                {
                                    required: "Password is required",
                                })
                            } />
                            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                    </FormControl>

                    <InputRightElement>
                        <IconButton
                            icon={showPassword ? <IoEyeOff /> : <IoEye />}
                            onClick={tooglePasswordVisibility} >
                        </IconButton>
                    </InputRightElement>
                </InputGroup>

                <Button type="submit" colorScheme="green" w="100%" mb={3}>Log In</Button>
                <Button type="button" colorScheme="green" w="100%" variant="outline">Register</Button>
            </form>
        </Box>
    )
}

export default LoginForm;   