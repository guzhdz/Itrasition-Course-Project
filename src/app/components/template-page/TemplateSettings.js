//React/Next imports
import { useState} from "react";

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
    chakra
} from "@chakra-ui/react";

//Components imports

//Library imports
import { useForm } from "react-hook-form";
import { Autocomplete } from 'chakra-ui-simple-autocomplete';

//Context imports
import { useUI } from "../../context/UIContext";

const TemplateSettings = ({ id }) => {
    const { language, greenColor } = useUI();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm({
        defaultValues: {
            title: "Untitle template",
            description: "This is a default description. You can use markdown here.",
        }
    });
    const tagOptions = [
        { value: 0, label: "School" },
        { value: 1, label: "Work" },
        { value: 2, label: "Personal" },
        { value: 3, label: "Social" },
        { value: 4, label: "Study" },
        { value: 5, label: "Web" },
        { value: 6, label: "Portfolio" },
        { value: 7, label: "Contact" }
    ];
    const [tagsSelected, setTagsSelected] = useState([]);
    const [tagError, setTagError] = useState(false);

    const handleTagSelected = (value) => {
        const nueva = value[0].label;
        if (validateTag(nueva)) {
            setValue("tags", value);
            return value;
        } else {
            return tagsSelected;
        }
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
        console.log(data);
    }

    return (
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
                            {language === "es" ? "Descripción (soporte markdown)" : "Description (support markdown)"}
                        </FormLabel>
                        <Textarea
                            id="description"
                            placeholder={language === "es" ? "Inserta una descripción de la plantilla"
                                : "Insert a description of the template"}
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
                            }
                        />
                        <FormErrorMessage>{errors.description && errors.description.message}</FormErrorMessage>
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
                            options={tagOptions}
                            result={tagsSelected}
                            setResult={(tagOptions) => setTagsSelected(handleTagSelected(tagOptions))}
                            placeholder="Select tags"
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
                        <FormErrorMessage>{language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters"}</FormErrorMessage>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel
                            color={greenColor}
                            fontWeight="bold" >
                            {language === "es" ? "Estado" : "State"}
                        </FormLabel>
                        <Select
                            focusBorderColor={greenColor}
                            _placeholder={{ color: 'gray.500' }}
                            {...register("state")}>
                            <option value='draft'>Draft</option>
                            <option value='public'>Public</option>
                            <option value='restricted'>Restricted</option>
                        </Select>
                    </FormControl>

                    <Text mb={4} fontSize="sm">
                        {language === "es" ? "Nota: si el estado de la plantilla es 'Draft', solo el creador del template podran verlo"
                            : "Note: If the template state is 'Draft', only the creator of the template can see it"}
                    </Text>
                </CardBody>

                <CardFooter display="flex" justifyContent="flex-end">
                    <Button colorScheme="green" type="submit">
                        {language === "es" ? "Guardar configuración" : "Save settings"}
                    </Button>
                </CardFooter>
            </Card>
        </chakra.form>
    )
}

export default TemplateSettings;