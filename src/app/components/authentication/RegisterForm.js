//React imports
import { useContext } from "react";

//Chakra imports
import {
    FormControl,
    FormErrorMessage,
    Input,
    Button,
    InputRightElement,
    InputGroup,
    IconButton,
    Text,
    Link
} from "@chakra-ui/react";

//Services imports
import { insertUser } from "../../services/userService";

//Library imports
import { useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";

//Context imports
import { ModeColorContext } from "../../context/ModeColorContext";

const RegisterForm = ({ toogleForm, setErrorMessage, setLoading, loading, tooglePasswordVisibility, showPassword }) => {
    const { greenColor } = useContext(ModeColorContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setErrorMessage("");
        setLoading(true);
        const response = await insertUser(data);
        if (response.ok) {
            console.log("Ingresado correctamente");
        } else {
            setErrorMessage(response.message);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.name} mb={3}>
                <Input
                    id="name-sign"
                    type="name"
                    placeholder="Name or username"
                    isDisabled={loading}
                    focusBorderColor={greenColor}
                    _placeholder={{ color: 'gray.400' }}
                    {
                    ...register("name",
                        {
                            required: "Name/username is required",
                            maxLength: {
                                value: 255,
                                message: "Maximum length is 255 characters",
                            }
                        })
                    } />
                <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email} mb={3}>
                <Input
                    id="email-sign"
                    type="email"
                    placeholder="Email"
                    isDisabled={loading}
                    focusBorderColor={greenColor}
                    _placeholder={{ color: 'gray.400' }}
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
                    <Input
                        id="password-sign"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        isDisabled={loading}
                        focusBorderColor={greenColor}
                        _placeholder={{ color: 'gray.400' }}
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
                        onClick={tooglePasswordVisibility}
                        isDisabled={loading} >
                    </IconButton>
                </InputRightElement>
            </InputGroup>

            <Button
                type="submit"
                colorScheme="green"
                w="100%"
                mb={3}
                isDisabled={loading}>
                Get Started
            </Button>

            {!loading && <Text>Already have an account? <Link href="#" color={greenColor} onClick={toogleForm}>Log in</Link></Text>}
        </form>
    )
}

export default RegisterForm;   