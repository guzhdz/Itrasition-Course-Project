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
    Input,
    FormErrorMessage,
    Textarea,
    FormLabel,
    Select,
    Button,
    Tag,
    TagLabel,
    TagCloseButton,
    Text,
    chakra,
    Avatar
} from "@chakra-ui/react";

//Components imports
import ConfirmModal from "../../shared/ConfirmModal";

//Services imports
import { updateTemplateSettings } from "../../../services/templateService";

//Library imports
import { useForm } from "react-hook-form";
import { Autocomplete } from 'chakra-ui-simple-autocomplete';

//Context imports
import { useUI } from "../../../context/UIContext";

const SettingsForm = ({ templateInfo, tagOptions, topicOptions, userOptions, refreshInfo, checkAuth }) => {
    const { language, greenColor, openToast, textGreenScheme } = useUI();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm();
    const state = watch('state');
    const [tagsSelected, setTagsSelected] = useState(templateInfo.templatetags || []);
    const [usersSelected, setUsersSelected] = useState([]);
    const [tagError, setTagError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const handleTagSelected = (value) => {
        const nueva = value[0].label;
        return validateTag(nueva) ? value : tagsSelected;
    };

    const validateTag = (value) => {
        const maxLength = 255;
        if (value.length > maxLength) {
            setTagError(true);
            return false;
        } else {
            setTagError(false);
            return true;
        }
    };

    const onSubmit = async (data) => {
        setLoadingUpdate(true);
        const isOwner = await checkAuth();
        if (isOwner) {
            const newTemplateInfo = getNewTemplateInfo(data);
            const response = await updateTemplateSettings(newTemplateInfo);
            if (response.ok) {
                openToast(
                    null,
                    language === 'es' ? 'La plantilla se actualizo correctamente' : 'Template updated successfully',
                    'success'
                )
                await refreshInfo();
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

    const getNewTemplateInfo = (data) => {
        const newTags = tagsSelected.filter((tag) => typeof tag.value !== "number");
        const tagsToAdd = tagsSelected.filter((tag) =>
            typeof tag.value === "number" &&
            !templateInfo.templatetags.some(templatetag => templatetag.value === tag.value)
        );
        const tagsToDelete = templateInfo.templatetags.filter((tag) => !tagsSelected.some(tagSelected => tagSelected === tag));
        let usersToAdd = [];
        let usersToDelete = [];
        if(state === "restricted") {
            usersToAdd = usersSelected.filter((user) =>
                !templateInfo.templateaccess.some(templateaccess => templateaccess.value === user.value)
            );
            usersToDelete = templateInfo.templateaccess.filter((user) => !usersSelected.some(userSelected => userSelected.value === user.value));
        } else {
            usersToDelete = templateInfo.templateaccess;
        }
        return {
            id: templateInfo.id,
            title: data.title,
            description: data.description,
            image_url: data.image_url,
            state: data.state,
            topic_id: data.topic,
            tagsToAdd,
            tagsToDelete,
            newTags,
            usersToAdd,
            usersToDelete
        }
    }

    const openConfirmModal = async () => {
        setShowModal(true);
    };

    useEffect(() => {
        reset({
            title: templateInfo.title || "",
            description: templateInfo.description || "",
            image_url: templateInfo.image_url || "",
            state: templateInfo.state || "draft",
            topic: templateInfo.topic_id || "",
        });
        setTagsSelected(templateInfo.templatetags || []);
        setUsersSelected(templateInfo.templateaccess || []);
    }, [templateInfo]);

    return (
        <>
            <chakra.form onSubmit={handleSubmit(onSubmit)} w="100%">
                <Card textAlign="initial" mb={4} px={6}>
                    <CardHeader>
                        <Heading size="md">
                            {language === "es" ? "Configuración general" : "General Settings"}
                        </Heading>
                    </CardHeader>

                    <CardBody py={2}>
                        <FormControl isInvalid={errors.title} mb={8}>
                            <Input
                                id="title"
                                type="text"
                                variant="flushed"
                                size="lg"
                                placeholder={language === "es" ? "Título" : "Title"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {
                                ...register("title",
                                    {
                                        required: language === "es" ? "Se requiere un titulo" : "A title is required",
                                        maxLength: {
                                            value: 255,
                                            message: language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters",
                                        }
                                    })
                                } />
                            <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.description} mb={8}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Descripción (soporte a markdown)" : "Description (support markdown)"}
                            </FormLabel>
                            <Textarea
                                id="description"
                                placeholder={language === "es" ? "Inserta una descripción de la plantilla"
                                    : "Insert a description of the template"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                rows={6}
                                _placeholder={{ color: 'gray.500' }}
                                {
                                ...register("description",
                                    {
                                        required: language === "es" ? "Se requiere una descripción" : "A description is required",
                                        maxLength: {
                                            value: 510,
                                            message: language === "es" ? "Longitud maxima de 510 caracteres" : "Maximum length is 510 characters",
                                        }
                                    })
                                } />
                            <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl mb={8} isInvalid={errors.topic}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Tema" : "Topic"}
                            </FormLabel>
                            <Select
                                placeholder={language === "es" ? "Selecciona un tema" : "Select a topic"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {...register("topic",
                                    {
                                        required: language === "es" ? "Selecciona un tema" : "Please select a topic",
                                    }
                                )}>
                                {
                                    topicOptions.map((topic) => (
                                        <option key={topic.id} value={topic.id}>{topic.name}</option>
                                    ))
                                }
                                {topicOptions.length === 0 &&
                                    <option value="">{language === "es" ? "Sin temas" : "No topics aviable"}</option>
                                }
                            </Select>
                            <FormErrorMessage>{errors.topic && errors.topic.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.image_url} mb={8}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "URL de la imagen (opcional)" : "Image url (optional)"}
                            </FormLabel>
                            <Input
                                id="image_url"
                                type="text"
                                placeholder={language === "es" ? "Inserta la url de una imagen" : "Insert the url of an image"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {
                                ...register("image_url",
                                    {
                                        maxLength: {
                                            value: 510,
                                            message: language === "es" ? "Longitud maxima de 510 caracteres" : "Maximum length is 510 characters",
                                        }
                                    })
                                } />
                            <FormErrorMessage>{errors.image_url && errors.image_url.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl mb={8} isInvalid={tagError}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Etiquetas" : "Tags"}
                            </FormLabel>
                            <Autocomplete
                                options={tagOptions ? tagOptions : []}
                                result={tagsSelected}
                                setResult={(tagOptions) => setTagsSelected(handleTagSelected(tagOptions))}
                                placeholder="Select tags"
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                borderColor={tagError ? "red.300" : "gray.600"}
                                _placeholder={{ color: 'gray.500' }}
                                bgHoverColor="gray"
                                renderBadge={(option) => (
                                    <Tag
                                        key={option.value}
                                        borderRadius='full'
                                        variant='solid'
                                        colorScheme='green'
                                        mx={1}>
                                        <TagLabel>{option.label}</TagLabel>
                                        <TagCloseButton />
                                    </Tag>
                                )}
                            />
                            <FormErrorMessage>
                                {language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters"}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl mb={8} isInvalid={errors.state}>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Estado" : "State"}
                            </FormLabel>
                            <Select
                                placeholder={language === "es" ? "Selecciona un estado" : "Select a state"}
                                disabled={loadingUpdate}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                {...register("state",
                                    {
                                        required: language === "es" ? "Selecciona un estado" : "Please select a state",
                                    }
                                )}>
                                <option value='draft'>{language === "es" ? "Borrador" : "Draft"}</option>
                                <option value='public'>{language === "es" ? "Público" : "Public"}</option>
                                <option value='restricted'>{language === "es" ? "Restringido" : "Restricted"}</option>
                            </Select>
                            <FormErrorMessage>{errors.state && errors.state.message}</FormErrorMessage>
                            <Text py={2} fontSize="sm">
                                {language === "es" ? "Nota: Si el estado de la plantilla es 'Borrador', solo el creador del template podra verlo."
                                    : "Note: If the template state is 'Draft', only the creator of the template can see it."}
                            </Text>
                        </FormControl>

                        <FormControl>
                            <FormLabel
                                color={greenColor}
                                fontWeight="bold" >
                                {language === "es" ? "Usuarios autorizados" : "Authorized users"}
                            </FormLabel>
                            <Autocomplete
                                options={userOptions ? userOptions : []}
                                result={state === "restricted" ? usersSelected : []}
                                setResult={(userOptions) => setUsersSelected(userOptions)}
                                placeholder={language === "es" ? "Selecciona un usuario" : "Select a user"}
                                disabled={loadingUpdate || state !== "restricted"}
                                allowCreation={false}
                                notFoundText={language === "es" ? "No se encontraron resultados" : "No results found"}
                                focusBorderColor={greenColor}
                                _placeholder={{ color: 'gray.500' }}
                                bgHoverColor="gray"
                                renderBadge={(option) => (
                                    <Tag
                                        key={option.value}
                                        borderRadius='full'
                                        variant='solid'
                                        size='lg'
                                        mx={1} >
                                        <Avatar
                                            name={option.label.replace(/\s*\(.*?\)/, '')}
                                            bg={greenColor}
                                            color={textGreenScheme}
                                            size='xs'
                                            ml={-1}
                                            mr={2} />
                                        <TagLabel>{option.label}</TagLabel>
                                        <TagCloseButton />
                                    </Tag>
                                )}
                            />
                            <Text py={2} fontSize="sm">
                                {language === "es" ?
                                    "Nota: Aqui puedes seleccionar los usuarios autorizados para ver y rellenar la plantilla (solo en stado 'restringido)'."
                                    : "Note: Here you can select users authorized to see and fill out the template (only in state 'restricted')."}
                            </Text>
                        </FormControl>

                    </CardBody>

                    <CardFooter display="flex" justifyContent="flex-end">
                        <Button colorScheme="green" type="button" onClick={openConfirmModal} isLoading={loadingUpdate}>
                            {language === "es" ? "Guardar configuración" : "Save settings"}
                        </Button>
                    </CardFooter>
                </Card>
            </chakra.form>

            <ConfirmModal
                showModal={showModal}
                setShowModal={setShowModal}
                confirmCallback={handleSubmit(onSubmit)}
                title={language === "es" ? "Guardar configuración" : "Set settings"}
                message={language === "es" ? "¿Deseas guardar los cambios?" : "Do you want to save the changes?"} />

        </>
    )
}

export default SettingsForm;