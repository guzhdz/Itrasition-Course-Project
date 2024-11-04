//React/Next imports
import { useState, useEffect } from "react";

//Chakra imports
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Heading,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Button,
    chakra,
} from "@chakra-ui/react";

//Components imports
import ConfirmModal from "../shared/ConfirmModal";

//Services imports
import { createAccountAndContact } from "../../services/salesforceService";

//Library imports
import { useForm } from "react-hook-form";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";

const SFForm = ({ checkAuth, setAccountCreated }) => {
    const { language, greenColor, openToast } = useUI();
    const { user } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [showModal, setShowModal] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const onSubmit = async (data) => {
        setLoadingUpdate(true);
        const isAuth = await checkAuth();
        if (isAuth) {
            const newAccount = getNewAccount(data);
            const response = await createAccountAndContact(newAccount);
            if (response.ok) {
                openToast(
                    null,
                    language === 'es' ? 'La cuenta y el contacto han sido creados correctamente'
                        : 'The account and contact have been created successfully',
                    'success'
                );
                setAccountCreated(true);
            } else {
                openToast(
                    'Error',
                    language === 'es' ? response.message[language] : response.message.en,
                    'error'
                );
            }
        }
        setLoadingUpdate(false);
    }

    const getNewAccount = (data) => {
        return {
            accountName: data.accountName,
            contactFirstName: data.name,
            contactLastName: data.lastName,
            contactEmail: data.email,
            phone: data.phone,
            id: user.id_user
        }
    }

    const openConfirmModal = async () => {
        setShowModal(true);
    };

    return (
        <>
            <chakra.form onSubmit={handleSubmit(onSubmit)} w="100%">
                <Card textAlign="initial" mb={4} px={6}>
                    <CardHeader>
                        <Heading size="md">
                            {language === "es" ? "Información personal" : "Personal data"}
                        </Heading>
                    </CardHeader>

                    <CardBody py={2}>
                        <FormControl isInvalid={errors.accountName} mb={8}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Nombre de la cuenta" : "Account name"}
                            </FormLabel>
                            <Input
                                id="account-name"
                                type="text"
                                placeholder={language === "es" ? "Ingrese el nombre de la cuenta" : "Input account name"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {
                                ...register("accountName",
                                    {
                                        required: language === "es" ? "Se requiere un nombre de cuenta" : "An account name is required",
                                        maxLength: {
                                            value: 255,
                                            message: language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters",
                                        }
                                    })
                                } />
                            <FormErrorMessage>{errors.accountName && errors.accountName.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.name} mb={8}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Nombre personal" : "Personal name"}
                            </FormLabel>
                            <Input
                                id="name"
                                type="text"
                                placeholder={language === "es" ? "Ingrese su nombre" : "Input your name"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {
                                ...register("name",
                                    {
                                        required: language === "es" ? "Se requiere un nombre" : "A name is required",
                                        maxLength: {
                                            value: 255,
                                            message: language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters",
                                        }
                                    })
                                } />
                            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.lastName} mb={8}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Apellido" : "Last name"}
                            </FormLabel>
                            <Input
                                id="lastName"
                                type="text"
                                placeholder={language === "es" ? "Ingrese su apellido" : "Input your last name"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {
                                ...register("lastName",
                                    {
                                        required: language === "es" ? "Se requiere un apellido" : "A last name is required",
                                        maxLength: {
                                            value: 255,
                                            message: language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters",
                                        }
                                    })
                                } />
                            <FormErrorMessage>{errors.lastName && errors.lastName.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.email} mb={8}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Correo" : "Email"}
                            </FormLabel>
                            <Input
                                id="email"
                                type="text"
                                placeholder={language === "es" ? "Ingrese su correo" : "Input your email"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {
                                ...register("email",
                                    {
                                        required: language === "es" ? "Se requiere un correo" : "An email is required",
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

                        <FormControl isInvalid={errors.phone}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Telefono" : "Phone number"}
                            </FormLabel>
                            <Input
                                id="phone"
                                type="text"
                                placeholder={language === "es" ? "Ingrese su telefono" : "Input your phone number"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {
                                ...register("phone",
                                    {
                                        required: language === "es" ? "Se requiere un telefono" : "A phone number is required",
                                        pattern: {
                                            value: /^\+?[1-9]\d{1,14}$/,
                                            message: language === "es" ? "Numero de telefono no valido" : "Invalid phone number",
                                        },
                                        maxLength: {
                                            value: 15,
                                            message: language === "es" ? "Longitud maxima de 15 caracteres" : "Maximum length is 15 characters",
                                        },
                                        minLength: {
                                            value: 7,
                                            message: language === "es" ? "Longitud minima de 7 caracteres" : "Minimum length is 7 characters",
                                        }
                                    })
                                } />
                            <FormErrorMessage>{errors.phone && errors.phone.message}</FormErrorMessage>
                        </FormControl>
                    </CardBody>

                    <CardFooter display="flex" justifyContent="flex-end">
                        <Button colorScheme="green" type="button" onClick={openConfirmModal} isLoading={loadingUpdate}>
                            {language === "es" ? "Crear" : "Create"}
                        </Button>
                    </CardFooter>
                </Card>
            </chakra.form>

            <ConfirmModal
                showModal={showModal}
                setShowModal={setShowModal}
                confirmCallback={handleSubmit(onSubmit)}
                title={language === "es" ? "Crear cuenta" : "Create account"}
                message={language === "es" ? "¿Esta seguro de que desea crear la cuenta?" : "Are you sure you want to create the account?"} />


        </>
    )
}

export default SFForm;