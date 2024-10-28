"use client"

//React/Next imports
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
    Flex,
    Box,
    Heading,
    Card,
    CardHeader,
    CardBody,
    Image,
    Text,
    Tag,
    TagLabel,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Textarea,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Checkbox,
    Button,
    Badge,
    chakra,
    Skeleton,
    IconButton
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

//Components imports
import ConfirmModal from "../shared/ConfirmModal";

//Styles imports
import styles from "../shared/styles.module.css";

//Services imports
import { insertFormAndAnswers, getUserForm, updateFormAndAnswers } from "../../services/formService";

//Library imports
import Markdown from 'markdown-to-jsx'
import { useForm, Controller, set } from "react-hook-form";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";


function Form({ templateInfo, modePassed = null, adminRequest = null, checkAuth }) {
    const router = useRouter();
    const { user } = useAuth();
    const {
        greenColor,
        language,
        openToast,
        setPageLoaded
    } = useUI();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm();
    const [mode, setMode] = useState(0);
    const [formAnswered, setFormAnswered] = useState(null);
    const [loadingComp, setLoadingComp] = useState(true);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [confirmModalInfo, setConfirmModalInfo] = useState({
        title: "",
        message: "",
        confirmCallback: () => { }
    });
    const owner = templateInfo.user_id === user?.id_user ? true : false

    const getMode = () => {
        if (modePassed) {
            return modePassed;
        } else if (owner) {
            return 0;
        } else {
            if (templateInfo.state === "draft") {
                setPageLoaded(false);
                openToast(
                    'Error',
                    language === "es" ? 'Esta plantilla no se encuentra disponible' : 'This form is not available',
                    'error'
                );
                router.back();
            } else {
                if (templateInfo.state === "public") {
                    return user === null ? 0 : 1
                } else {
                    if (user !== null) {
                        return templateInfo.templateaccess.some((userAccess => userAccess.user.id_user === user.id_user)) ? 1 : 0
                    } else {
                        return 0;
                    }
                }
            }
        }
    }

    const getPossibleAnswers = async () => {
        const response = await getUserForm(templateInfo.id, user?.id_user);
        if (response.ok) {
            const form = response.data;
            if (form !== null) {
                setFormAnswered(form);
                const answers = {};
                templateInfo.questions.forEach((question) => {
                    let answer = form.answers.find((answer) => answer.question_id === question.id).answer_value;
                    if (question.type === "checkbox") {
                        answer = answer == "true" ? true : false;
                    }
                    answers[`question_${question.index_order}`] = answer;
                });
                reset(answers);
            } else {
                setFormAnswered(null);
            }
        } else {
            setPageLoaded(false);
            openToast(
                'Error',
                language === "es" ? response.message[language] : response.message.en,
                'error'
            );
            router.back();
        }
    }

    const getStateColor = (state) => {
        if (state === "draft") {
            return "yellow";
        } else if (state === "public") {
            return "green";
        } else {
            return "blue";
        }
    }

    const getStateText = (state) => {
        if (state === "draft") {
            return language === "es" ? "Borrador" : "Draft";
        } else if (state === "public") {
            return language === "es" ? "Público" : "Public";
        } else {
            return language === "es" ? "Restringido" : "Restricted";
        }
    }

    const getFillDate = () => {
        if (user !== null) {
            let date;
            if (formAnswered !== null) {
                date = new Date(formAnswered.fill_time);
            } else {
                date = new Date();
            }
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        } else {
            return "";
        }
    }


    const onSubmit = async (data) => {
        setLoadingUpdate(true);
        const isAuth = await checkAuth();
        if (isAuth) {
            formAnswered === null ? await insertForm(data) : await updateForm(data);
        }
        setLoadingUpdate(false);
    }

    const insertForm = async (data) => {
        const answers = templateInfo.questions.map((question) => {
            return {
                question_id: question.id.toString(),
                answer_value: data[`question_${question.index_order}`].toString(),
            }
        });
        const response = await insertFormAndAnswers(templateInfo.id, user?.id_user, answers);
        if (response.ok) {
            openToast(
                null,
                language === "es" ? 'Formulario enviado con éxito' : 'Form sent successfully',
                'success'
            );
        } else {
            setPageLoaded(false);
            openToast(
                'Error',
                language === "es" ? "Error al enviar el formulario" : "Error at sending the form",
                'error'
            );
            router.back();
        }
        await getPossibleAnswers();
    }

    const updateForm = async (data) => {
        const updatedAnswers = templateInfo.questions.filter((question) =>
            data[`question_${question.index_order}`].toString()
            !== formAnswered.answers.find((answer) => answer.question_id === question.id).answer_value);
        const answers = updatedAnswers.map((question) => {
            return {
                id: formAnswered.answers.find((answer) => answer.question_id === question.id).id.toString(),
                answer_value: data[`question_${question.index_order}`].toString(),
            }
        });
        const response = await updateFormAndAnswers(templateInfo.id, user?.id_user, answers);
        if (response.ok) {
            openToast(
                null,
                language === "es" ? 'Formulario actualizado con éxito' : 'Form updated successfully',
                'success'
            );
        } else {
            setPageLoaded(false);
            openToast(
                'Error',
                language === "es" ? "Error al actualizar el formulario" : "Error at updating the form",
                'error'
            );
            router.back();
        }
        await getPossibleAnswers();
    }

    const resetForm = () => {
        const resetAnswers = {};
        templateInfo.questions.forEach((question) => {
            question.type === "checkbox" ? resetAnswers[`question_${question.index_order}`] = false
                : resetAnswers[`question_${question.index_order}`] = "";
        });
        reset(resetAnswers);
    }

    const openConfirmModal = (title, message, confirmCallback) => {
        setConfirmModalInfo({
            title,
            message,
            confirmCallback
        });
        setShowModal(true);
    }

    const initializeComponent = async () => {
        setLoadingComp(true);
        const stateMode = await getMode();
        setMode(stateMode);
        if (user !== null && stateMode === 1) {
            await getPossibleAnswers();
        }
        setLoadingComp(false);
    }

    useEffect(() => {
        initializeComponent();
    }, []);

    return (
        <>
            {loadingComp ? <Skeleton height="900px" /> :
                <>
                    <Box mb="40px" >
                        <Flex gap={4} align="center">
                            <IconButton
                                onClick={() => {
                                    setPageLoaded(false);
                                    router.back();
                                }}
                                colorScheme="green"
                                variant="ghost"
                                icon={<ArrowBackIcon />} />
                            <Heading mb={2}>
                                {mode ?
                                    language === "es" ? "Completa el formulario" : "Complete the form"
                                    : language === "es" ? "Plantilla (Vista previa solo lectura)" : "Template (Preview read only)"}
                            </Heading>
                        </Flex>


                        {owner && <Text fontSize={"sm"}>
                            {language === "es" ? "Este es lo que otros usuarios verán en tu plantilla"
                                : "This is how other users will see your template"}
                        </Text>}
                    </Box>


                    <Flex direction="column" mb={6}>
                        <Card p={2} mb={4}>
                            <CardHeader>
                                <Heading size="lg" color={greenColor} mb={2}>
                                    {templateInfo.title}
                                </Heading>

                                <Flex mb={4} gap={4} align="center">
                                    <Text fontSize="md">
                                        {language === "es" ? "Tema: " : "Topic: "}{templateInfo.topic.name}
                                    </Text>
                                    <Badge colorScheme={getStateColor(templateInfo.state)}>
                                        {getStateText(templateInfo.state)}
                                    </Badge>
                                </Flex>

                                <Flex>
                                    {templateInfo.templatetags.map((tag) => (
                                        <Tag
                                            size="md"
                                            key={tag.tag.name}
                                            borderRadius='full'
                                            variant='solid'
                                            mr={2}
                                            colorScheme='green'
                                        >
                                            <TagLabel>{tag.tag.name}</TagLabel>
                                        </Tag>
                                    ))}
                                </Flex>
                            </CardHeader>
                            <CardBody>
                                <Box className={styles.markdown} mb={8}>
                                    <Markdown>
                                        {templateInfo.description}
                                    </Markdown>
                                </Box>

                                {templateInfo.image_url && <Box w="70%" minW={"300px"} h="500px" mx="auto" mb={8}>
                                    <Image
                                        src={templateInfo.image_url}
                                        alt="Template image"
                                        w="100%"
                                        h="100%"
                                        borderRadius={"md"}
                                        objectFit="cover" />
                                </Box>}

                                <FormControl>
                                    <FormLabel color={greenColor}>User</FormLabel>
                                    <Input
                                        readOnly
                                        defaultValue={user !== null ? formAnswered !== null ? formAnswered.user.name : user.name : ""}
                                        type="text"
                                        focusBorderColor={greenColor}
                                        _placeholder={{ color: 'gray.500' }}
                                        placeholder={language === "es" ? "Tu nombre" : "Your name"}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel color={greenColor}>Date</FormLabel>
                                    <Input
                                        readOnly
                                        defaultValue={getFillDate()}
                                        type="date"
                                        focusBorderColor={greenColor}
                                        _placeholder={{ color: 'gray.500' }}
                                        placeholder={language === "es" ? "La fecha" : "The date"}
                                    />
                                </FormControl>
                            </CardBody>
                        </Card>
                        <chakra.form onSubmit={handleSubmit(onSubmit)} w="100%">

                            {templateInfo.questions.map((question) => (
                                <Card mb={4} pb={2} key={question.id}>
                                    <CardBody>
                                        <Heading size="md" color={greenColor} mb={2}>{question.title}</Heading>
                                        <FormControl isInvalid={errors[`question_${question.index_order}`]}>
                                            <FormLabel fontWeight="normal">{question.description}</FormLabel>
                                            {question.type === "text" && (
                                                <Input
                                                    readOnly={!mode}
                                                    disabled={loadingUpdate}
                                                    type="text"
                                                    focusBorderColor={greenColor}
                                                    _placeholder={{ color: 'gray.500' }}
                                                    placeholder={language === "es" ? "Tu respuesta" : "Your answer"}
                                                    {
                                                    ...register(`question_${question.index_order}`,
                                                        {
                                                            required: language === "es" ? "Este campo es requerido" : "This field is required",
                                                            maxLength: {
                                                                value: 510,
                                                                message: language === "es" ? "Longitud maxima de 510 caracteres"
                                                                    : "Maximum length is 510 characters",
                                                            }
                                                        })
                                                    }
                                                />
                                            )}
                                            {question.type === "textarea" && (
                                                <Textarea
                                                    readOnly={!mode}
                                                    disabled={loadingUpdate}
                                                    focusBorderColor={greenColor}
                                                    _placeholder={{ color: 'gray.500' }}
                                                    placeholder={language === "es" ? "Tu respuesta" : "Your answer"}
                                                    rows={4}
                                                    {
                                                    ...register(`question_${question.index_order}`,
                                                        {
                                                            required: language === "es" ? "Este campo es requerido" : "This field is required",
                                                            maxLength: {
                                                                value: 510,
                                                                message: language === "es" ? "Longitud maxima de 510 caracteres"
                                                                    : "Maximum length is 510 characters",
                                                            }
                                                        })
                                                    }
                                                />
                                            )}
                                            {question.type === "positive_num" && (
                                                <Controller
                                                    name={`question_${question.index_order}`}
                                                    control={control}
                                                    defaultValue={0}
                                                    rules={{
                                                        required: language === "es" ? "Este campo es requerido" : "This field is required",
                                                        min: {
                                                            value: 0,
                                                            message: language === "es" ? "Solo se aceptan valores positivos"
                                                                : "Only positive numbers",
                                                        }
                                                    }}
                                                    render={({ field }) => (
                                                        <NumberInput
                                                            readOnly={!mode}
                                                            disabled={loadingUpdate}
                                                            focusBorderColor={greenColor}
                                                            {...field}>
                                                            <NumberInputField />
                                                            <NumberInputStepper>
                                                                <NumberIncrementStepper />
                                                                <NumberDecrementStepper />
                                                            </NumberInputStepper>
                                                        </NumberInput>
                                                    )}
                                                />
                                            )}
                                            {question.type === "checkbox" && (
                                                <Controller
                                                    name={`question_${question.index_order}`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Checkbox
                                                            readOnly={!mode}
                                                            disabled={loadingUpdate}
                                                            {...field}
                                                            colorScheme="green"
                                                            isChecked={field.value} onChange={field.onChange}>
                                                            {language === "es" ? "Si/No" : "Yes/No"}
                                                        </Checkbox>
                                                    )}
                                                />
                                            )}
                                            <FormErrorMessage>
                                                {errors[`question_${question.index_order}`] && errors[`question_${question.index_order}`]?.message}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </CardBody>
                                </Card>
                            ))}
                        </chakra.form>
                        {mode === 1 && <Flex gap={2}>

                            {formAnswered !== null && <Button
                                colorScheme="green"
                                type="button"
                                isLoading={loadingUpdate}
                                onClick={() => openConfirmModal(
                                    language === "es" ? "Enviar respuesta" : "Sent answer",
                                    language === "es" ? "¿Deseas enviar la respuesta?" : "Do you want to send the answer?",
                                    handleSubmit(onSubmit)
                                )}>
                                {language === "es" ? "Editar respuesta" : "Edit answer"}
                            </Button>}

                            {formAnswered === null && <Button
                                colorScheme="green"
                                type="submit"
                                isLoading={loadingUpdate}
                                onClick={() => openConfirmModal(
                                    language === "es" ? "Actualizar respuesta" : "Update answer",
                                    language === "es" ? "¿Deseas actualizar la respuesta?" : "Do you want to update the answer?",
                                    handleSubmit(onSubmit)
                                )}>
                                {language === "es" ? "Enviar" : "Submit"}
                            </Button>}

                            <Button
                                colorScheme="green"
                                type="button"
                                variant="outline"
                                onClick={resetForm}
                                isLoading={loadingUpdate}>
                                {language === "es" ? "Reiniciar" : "Reset"}
                            </Button>
                        </Flex>}
                    </Flex>

                    <ConfirmModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        confirmCallback={confirmModalInfo.confirmCallback}
                        title={confirmModalInfo.title}
                        message={confirmModalInfo.message} />
                </>
            }
        </>
    );
}

export default Form;