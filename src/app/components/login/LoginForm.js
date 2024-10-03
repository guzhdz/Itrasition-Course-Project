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
    IconButton
} from "@chakra-ui/react";

//Library imports
import { useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";

//Components imports
import Logo from "../shared/Logo";

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    const tooglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box w="100%">
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