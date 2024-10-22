//React/Next imports
import { useState, useEffect, useCallback, use } from "react";

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
    Text
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

//Components imports
import QuestionItem from "./QuestionItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

//Library imports
import { useForm } from "react-hook-form";

//Context imports
import { useUI } from "../../../context/UIContext";

const EditableQuestions = ({ questions, setQuestions, getRenderId, checkAuth }) => {
    const { language } = useUI();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        unregister
    } = useForm();

    const onSubmit = async (data) => {
        console.log(errors);
        console.log(data);
    }

    const handleNewQuestion = () => {
        const newQuestion = {
            renderId: getRenderId(),
            title: "",
            description: "",
            displayed: true,
            type: "text"
        }
        setQuestions([...questions, newQuestion]);
    }

    const deleteQuestion = (index, renderId) => {
        unregister(`question_${renderId}`);
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const startIndex = result.source.index;
        const endIndex = result.destination.index;
        const newQuestions = [...questions];
        const [draggedQuestion] = newQuestions.splice(startIndex, 1);
        newQuestions.splice(endIndex, 0, draggedQuestion);
        setQuestions(newQuestions);
    };

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
                                                        deleteQuestion={deleteQuestion} />
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
                            onClick={handleNewQuestion} />
                    </Flex>

                    {questions.length === 0 &&
                        <Text fontSize="lg" textAlign="center">
                            {language === "es" ? "No hay preguntas aún" : "No questions yet"}
                        </Text>}
                </CardBody>

                <CardFooter display="flex" justifyContent="flex-end">
                    <Button colorScheme="green" onClick={handleSubmit(onSubmit)}>
                        {language === "es" ? "Guardar preguntas" : "Save questions"}
                    </Button>
                </CardFooter>
            </Card >
        </>
    )
}

export default EditableQuestions;