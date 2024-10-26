//React/Next imports
import { useState, useEffect } from "react";

//Chakra imports
import {
    Card,
    CardHeader,
    Heading,
    CardBody,
    CardFooter,
    Flex,
    IconButton,
    Box,
    Button,
    chakra,
    Text,
    Show
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

//Components imports
import QuestionItem from "./QuestionItem";
import ConfirmModal from "../../shared/ConfirmModal";

//Services imports
import { getQuestionsTemplate, updateTemplateQuestions } from "../../../services/questionService";

//Library imports
import { useForm } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaSave } from "react-icons/fa";

//Context imports
import { useUI } from "../../../context/UIContext";

const EditableQuestions = ({ id, loadedQuestions, getRenderId, refreshInfo, checkAuth, isSavingChanges, setIsSavingChanges }) => {
    const { language, openToast } = useUI();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        unregister,
    } = useForm();
    const [questions, setQuestions] = useState(loadedQuestions);
    const [showModal, setShowModal] = useState(false);
    const [confirmModalInfo, setConfirmModalInfo] = useState({
        title: "",
        message: "",
        confirmCallback: () => { }
    });
    const [loadingUpdate, setLoadingUpdate] = useState(false);

    const onSubmit = async (data) => {
        setLoadingUpdate(true);
        const isOwner = await checkAuth();
        if (isOwner) {
            const actualQuestions = await getActualQuestions();
            if (actualQuestions !== null) {
                const updatedQuestions = questions.map((question, index) => {
                    const questionFormat = {
                        ...question,
                        ...data[`question_${question.renderId}`],
                        index_order: index
                    }
                    delete questionFormat.renderId;
                    return questionFormat;
                });
                await updateQuestions(actualQuestions, updatedQuestions);
            } else {
                openToast(
                    'Error',
                    language === 'es' ? 'Error al actualizar las preguntas' : 'Error at updating questions',
                    'error'
                );
            }
        }
        setIsSavingChanges(false);
        setLoadingUpdate(false);
    }

    const getActualQuestions = async () => {
        const response = await getQuestionsTemplate(id);
        if (response.ok) {
            return response.data;
        } else {
            return null;
        }
    }

    const updateQuestions = async (actualQuestions, updatedQuestions) => {
        const newQuestions = updatedQuestions.filter((question) => !question?.id);
        const changedQuestions = updatedQuestions.filter((question) => question?.id);
        const deletedQuestions = actualQuestions.filter((question) =>
            !updatedQuestions.some((questionUpdated) => question.id === questionUpdated?.id));
        const response = await updateTemplateQuestions(id, newQuestions, changedQuestions, deletedQuestions);
        if (response.ok) {
            await refreshInfo();
            openToast(
                null,
                language === 'es' ? 'Preguntas actualizadas correctamente' : 'Questions updated successfully',
                'success'
            );
        } else {
            openToast(
                'Error',
                language === 'es' ? 'Error al actualizar las preguntas' : 'Error at updating questions',
                'error'
            );
        }
    }

    const handleNewQuestion = () => {
        setLoadingUpdate(true);
        const newQuestion = {
            renderId: getRenderId(),
            title: "",
            description: "",
            displayed: true,
            type: "text"
        }
        setQuestions([...questions, newQuestion]);
        reset({
            [`question_${newQuestion.renderId}`]: {
                type: newQuestion.type,
                title: newQuestion.title,
                description: newQuestion.description,
                displayed: newQuestion.displayed
            }
        });
        setLoadingUpdate(false);
    }

    const deleteQuestion = (index, renderId) => {
        setLoadingUpdate(true);
        unregister(`question_${renderId}`);
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
        setLoadingUpdate(false);
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const startIndex = result.source.index;
        const endIndex = result.destination.index;
        if (startIndex === endIndex) return;
        const newQuestions = [...questions];
        const [draggedQuestion] = newQuestions.splice(startIndex, 1);
        newQuestions.splice(endIndex, 0, draggedQuestion);
        setQuestions(newQuestions);
    };

    const openConfirmModal = (title, message, confirmCallback) => {
        setConfirmModalInfo({
            title,
            message,
            confirmCallback
        });
        setShowModal(true);
    }

    const resetForm = () => {
        const renderQuestions = loadedQuestions.map((question) => {
            return {
                [`question_${question.renderId}`]: {
                    type: question.type,
                    title: question.title,
                    description: question.description,
                    displayed: question.displayed
                }
            }
        });
        reset(Object.assign({}, ...renderQuestions));
    }

    useEffect(() => {
        setQuestions(loadedQuestions);
        resetForm();
    }, [loadedQuestions]);

    useEffect(() => {
        if (isSavingChanges) {
            handleSubmit(onSubmit)();
        }
    }, [isSavingChanges]);

    return (
        <>
            <Card textAlign="initial" mb={4} px={6}>
                <CardHeader>
                    <Heading size="md">
                        {language === "es" ? "Preguntas de la plantilla" : "Template Questions"}
                    </Heading>
                </CardHeader>

                <CardBody py={2}>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="todos">
                            {(droppableProvider) => (
                                <chakra.form onSubmit={handleSubmit(onSubmit)} w="100%"
                                    ref={droppableProvider.innerRef}
                                    {...droppableProvider.droppableProps}
                                >
                                    {questions.map((question, index) => (
                                        <Draggable
                                            key={question.renderId}
                                            index={index}
                                            isDragDisabled={loadingUpdate}
                                            draggableId={`${question.renderId}`} >
                                            {(draggableProvider) => (
                                                <Box
                                                    ref={draggableProvider.innerRef}
                                                    {...draggableProvider.draggableProps}
                                                    {...draggableProvider.dragHandleProps} >
                                                    <QuestionItem
                                                        key={index}
                                                        question={question}
                                                        index={index}
                                                        register={register}
                                                        errors={errors}
                                                        watch={watch}
                                                        reset={reset}
                                                        deleteQuestion={deleteQuestion}
                                                        loadingUpdate={loadingUpdate}
                                                        opens />
                                                </Box>
                                            )}
                                        </Draggable>
                                    ))}
                                    {droppableProvider.placeholder}
                                </chakra.form>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <Flex justify="center" mb={4}>
                        <IconButton
                            icon={<AddIcon />}
                            colorScheme="green"
                            onClick={handleNewQuestion}
                            isLoading={loadingUpdate} />
                    </Flex>

                    {questions.length === 0 &&
                        <Text fontSize="lg" textAlign="center">
                            {language === "es" ? "No hay preguntas aún" : "No questions yet"}
                        </Text>}
                </CardBody>

                <CardFooter display="flex" justifyContent="flex-end">
                    <Show above="sm">
                        <Button
                            isLoading={loadingUpdate}
                            colorScheme="green"
                            onClick={() => openConfirmModal(
                                language === "es" ? "Guardar preguntas" : "Save questions",
                                language === "es" ? "¿Deseas guardar las preguntas?" : "Do you want to save the questions?",
                                handleSubmit(onSubmit)
                            )} >
                            {language === "es" ? "Guardar preguntas" : "Save questions"}
                        </Button>
                    </Show>

                    <Show below="sm">
                        <IconButton
                            colorScheme="green"
                            icon={<FaSave />}
                            onClick={() => openConfirmModal(
                                language === "es" ? "Guardar preguntas" : "Save questions",
                                language === "es" ? "¿Deseas guardar las preguntas?" : "Do you want to save the questions?",
                                handleSubmit(onSubmit)
                            )}
                            isLoading={loadingUpdate} />
                    </Show>

                </CardFooter>
            </Card >

            <ConfirmModal
                showModal={showModal}
                setShowModal={setShowModal}
                confirmCallback={confirmModalInfo.confirmCallback}
                title={confirmModalInfo.title}
                message={confirmModalInfo.message} />
        </>
    )
}

export default EditableQuestions;