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
} from "@chakra-ui/react";

//Services imports
import { authUser } from "../../services/authService";

//Library imports
import { useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";

//Context imports
import { ModeColorContext } from "../../context/ModeColorContext";

const LoginForm = ({ toogleForm, setErrorMessage, setLoading, loading, tooglePasswordVisibility, showPassword }) => {
    const { greenColor } = useContext(ModeColorContext);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.email} mb={3}>
                <Input
                    id="email-log"
                    type="email"
                    placeholder="Email"
                    isDisabled={loading}
                    color="gray.400"
                    focusBorderColor={greenColor}
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
                    <Input
                        id="password-log"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        isDisabled={loading}
                        color="gray.400"
                        focusBorderColor={greenColor}
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
                isDisabled={loading} >
                Log In
            </Button>
            <Button
                type="button"
                colorScheme="green"
                w="100%"
                variant="outline"
                onClick={toogleForm}
                isDisabled={loading}>
                Register
            </Button>
        </form>
    )
}

export default LoginForm;   