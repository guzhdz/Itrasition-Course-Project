//React/Next imports
import { useState } from "react";

//Chakra imports
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    chakra,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Text,
    Textarea,
    Input,
    Select,
    useToast,
    Flex,
    Link
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'

//Services imports
import { createTicket } from "../../../services/jiraService";

//Library imports
import { useForm } from "react-hook-form";

//Context imports
import { useUI } from "../../../context/UIContext";
import { useAuth } from "../../../context/AuthContext";


const TicketModal = ({ showModal, setShowModal, templateTitle = null }) => {
    const { language, greenColor, openToast } = useUI();
    const { user } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const toast = useToast();

    const onSubmit = async (data) => {
        setLoadingUpdate(true);
        const newTicket = await getNewTicket(data);
        const response = await createTicket(newTicket);
        if (response.ok) {
            const url = response.data;
            closeModal();
            openUrlToast(url);
        } else {
            openToast(
                "Error",
                language === "es" ? response.message[language] : response.message.en,
                "error"
            );
        }
        setLoadingUpdate(false);
    }

    const openUrlToast = (url) => {
        toast({
            description: (
                <Flex gap={2} alignItems="center">
                    <Text>
                        {language === "es" ? "Se ha enviado el ticket correctamente"
                            : "Ticket sent successfully"}
                    </Text>
                    <Link href={url} isExternal fontWeight={"semibold"}>
                        View in jira <ExternalLinkIcon mx='2px' />
                    </Link>
                </Flex>
            ),
            status: "success",
            duration: 9000,
            isClosable: true,
        });
    }

    const closeModal = () => {
        reset();
        setShowModal(false);
    }

    const getNewTicket = async (data) => {
        const description = {
            content: [
              {
                content: [
                  {
                    text: data.description,
                    type: "text"
                  }
                ],
                type: "paragraph"
              }
            ],
            type: "doc",
            version: 1
        }
        const ticket = {
            summary: data.summary,
            description: description,
            priority: data.priority,
            templateTitle: templateTitle,
            link: window.location.href,
            reportedBy: user.email
        }
        return ticket;
    }

    return (
        <Modal
            closeOnOverlayClick={false}
            isOpen={showModal}
            isCentered
            returnFocusOnClose={false}
            onClose={closeModal}
            size={{ base: "xs", md: "sm", lg: "md" }}>
            <ModalOverlay />
            <ModalContent>
                <chakra.form onSubmit={handleSubmit(onSubmit)} w="100%">
                    <ModalHeader>
                        {language === "es" ? "Reportar un problema" : "Report issue"}
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <Text fontSize="sm" mb={4}>
                            {language === "es" ? "Ingresa un breve resumen del problema y selecciona su prioridad"
                                : "Enter a brief summary of the problem and select its priority"}
                        </Text>

                        <FormControl isInvalid={errors.summary} mb={4}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Resumen" : "Summary"}
                            </FormLabel>
                            <Input
                                id="summary"
                                type="text"
                                placeholder={language === "es" ? "Ingresa un resumen" : "Enter a brief summary"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {
                                ...register("summary",
                                    {
                                        required: language === "es" ? "Se requiere un resumen" : "A summary is required",
                                        maxLength: {
                                            value: 255,
                                            message: language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters",
                                        }
                                    })
                                } />
                            <FormErrorMessage>{errors.summary && errors.summary.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.description} mb={4}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Descripción" : "Description"}
                            </FormLabel>
                            <Textarea
                                id="description"
                                placeholder={language === "es" ? "Inserta una descripción del problema"
                                    : "Insert a description of the issue"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                rows={4}
                                _placeholder={{ color: 'gray.500' }}
                                {
                                ...register("description",
                                    {
                                        required: language === "es" ? "Se requiere una descripción" : "A description is required",
                                        maxLength: {
                                            value: 2000,
                                            message: language === "es" ? "Longitud maxima de 2000 caracteres" : "Maximum length is 2000 characters",
                                        }
                                    })
                                } />
                            <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.priority}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Prioridad" : "Priority"}
                            </FormLabel>
                            <Select
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {...register("priority",
                                    {
                                        required: language === "es" ? "Selecciona una prioridad" : "Please select a priority",
                                    }
                                )}>
                                <option value='Lowest'>{language === "es" ? "Muy Baja" : "Lowest"}</option>
                                <option value='Low'>{language === "es" ? "Baja" : "Low"}</option>
                                <option value='Medium'>{language === "es" ? "Media" : "Medium"}</option>
                                <option value='High'>{language === "es" ? "Alta" : "High"}</option>
                                <option value='Highest'>{language === "es" ? "Muy Alta" : "Highest"}</option>
                            </Select>
                            <FormErrorMessage>{errors.priority && errors.priority.message}</FormErrorMessage>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            type="button"
                            colorScheme="green"
                            variant="outline"
                            mr={3}
                            isLoading={loadingUpdate}
                            onClick={() => reset()} >
                            {language === "es" ? "Reiniciar" : "Reset"}
                        </Button>
                        <Button
                            type="submit"
                            colorScheme="green"
                            isLoading={loadingUpdate}>
                            {language === "es" ? "Reportar" : "Report"}
                        </Button>
                    </ModalFooter>
                </chakra.form>
            </ModalContent>
        </Modal >
    )
}

export default TicketModal;