//React/Next imports
import { useRouter } from "next/navigation";

//Chakra imports
import {
    FormControl,
    FormErrorMessage,
    Input,
    Button,
    InputRightElement,
    InputGroup,
    IconButton,
    chakra
} from "@chakra-ui/react";

//Services imports
import { authUser } from "../../services/authService";

//Library imports
import { useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({ toogleForm, setErrorMessage, setLoading, loading, tooglePasswordVisibility, showPassword }) => {
    const router = useRouter();
    const { greenColor, language, setPageLoaded } = useUI();
    const { saveId } = useAuth();
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
            await saveAuthToken(response.data);
        } else {
            setErrorMessage(language ? response.message[language] : response.message.en);
        }
        setLoading(false);
    };

    const saveAuthToken = async (data) => {
        const response = await saveId(data);
        if (response.ok) {
            setPageLoaded(false);
            router.push("/main");
        } else {
            const messageError = language === "es" ?
                "Algo salio mal. Por favor, intenta de nuevo." : "Something went wrong. Please try again later.";
            setErrorMessage(messageError);
        }
    }

    return (
        <chakra.form onSubmit={handleSubmit(onSubmit)} w="100%">
            <FormControl isInvalid={errors.email} mb={3}>
                <Input
                    id="email-log"
                    type="email"
                    placeholder={language === "es" ? "Correo" : "Email"}
                    isDisabled={loading}
                    focusBorderColor={greenColor}
                    _placeholder={{ color: 'gray.500' }}
                    {
                    ...register("email",
                        {
                            required: language === "es" ? "Se requiere un correo" : "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: language === "es" ? "Dirección de correo no válida" : "Invalid email address",
                            },
                            maxLength: {
                                value: 255,
                                message: language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters",
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
                        placeholder={language === "es" ? "Contraseña" : "Password"}
                        isDisabled={loading}
                        focusBorderColor={greenColor}
                        _placeholder={{ color: 'gray.500' }}
                        {
                        ...register("password",
                            {
                                required: language === "es" ? "Se requiere una contraseña" : "Password is required",
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
                isLoading={loading} >
                {language === "es" ? "Ingresar" : "Log In"}
            </Button>
            <Button
                type="button"
                colorScheme="green"
                w="100%"
                variant="outline"
                onClick={toogleForm}
                isDisabled={loading}>
                {language === "es" ? "Registrarse" : "Sign Up"}
            </Button>
        </chakra.form>
    )
}

export default LoginForm;   