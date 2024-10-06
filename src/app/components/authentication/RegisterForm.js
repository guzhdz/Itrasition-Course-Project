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
    Link,
    chakra
} from "@chakra-ui/react";

//Services imports
import { insertUser } from "../../services/userService";

//Library imports
import { useForm } from "react-hook-form";
import { IoEye, IoEyeOff } from "react-icons/io5";

//Context imports
import { UIContext } from "../../context/UIContext";

const RegisterForm = ({ toogleForm, setErrorMessage, setLoading, loading, tooglePasswordVisibility, showPassword }) => {
    const { greenColor, language } = useContext(UIContext);
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
            setErrorMessage( language ? response.message[language] : response.message.en);
        }
        setLoading(false);
    };

    return (
        <chakra.form onSubmit={handleSubmit(onSubmit)} w="100%">
            <FormControl isInvalid={errors.name} mb={3}>
                <Input
                    id="name-sign"
                    type="name"
                    placeholder={language === "es" ? "Nombre o usuario" : "Name or username"}
                    isDisabled={loading}
                    focusBorderColor={greenColor}
                    _placeholder={{ color: 'gray.500' }}
                    {
                    ...register("name",
                        {
                            required: language === "es" ? "Se requiere un nombre o usuario" : "Name/username is required",
                            maxLength: {
                                value: 255,
                                message: language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters",
                            }
                        })
                    } />
                <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.email} mb={3}>
                <Input
                    id="email-sign"
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
                        id="password-sign"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        isDisabled={loading}
                        focusBorderColor={greenColor}
                        _placeholder={{ color: 'gray.500' }}
                        {
                        ...register("password",
                            {
                                required: language === "es" ? "Se requiere una contraseña" : "Password is required",
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
                {language === "es" ? "Registrarse" : "Get Started"}
            </Button>

            {!loading && <Text>
                { language === "es" ? "¿Ya tienes una cuenta?" : "Already have an account?"} 
                <Link href="#" color={greenColor} onClick={toogleForm}>{ language === "es" ? " Iniciar Sesion" : " Log In" }</Link>
            </Text>}
        </chakra.form>
    )
}

export default RegisterForm;   