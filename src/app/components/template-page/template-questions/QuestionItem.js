//React/Next imports
import { useState, useEffect } from "react";

//Chakra imports
import {
    Card,
    CardBody,
    FormControl,
    FormLabel,
    FormErrorMessage,
    Input,
    Flex,
    Switch,
    Select,
    Textarea,
    Checkbox,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    IconButton
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

//Context imports
import { useUI } from "../../../context/UIContext";

const QuestionItem = ({ question, index, errors, register, watch, reset, deleteQuestion }) => {
    const { language, greenColor } = useUI();
    const type = watch(`question_${question.renderId}.type`);

    const handleDelete = () => {
        deleteQuestion(index, question.renderId);
    }

    useEffect(() => {
        if (question?.id) {
            reset({
                [`question_${question.renderId}`]: {
                    type: question?.type || "text",
                    title: question?.title || "",
                    description: question?.description || "",
                    displayed: question?.displayed || true
                }
            });
        }
    }, [question]);

    return (
        <Card border="1px" borderColor={greenColor} mb={3}>
            <CardBody>
                <Flex justify="space-between" align="center" gap={4} mb={3}>
                    <FormControl
                        display="flex"
                        alignItems="center"
                        gap={2}
                        isInvalid={errors[`question_${question.renderId}`]?.type}>
                        <FormLabel
                            color={greenColor}
                            fontWeight="bold"
                            m={0} >
                            {language === "es" ? "Tipo" : "Type"}
                        </FormLabel>
                        <Select
                            focusBorderColor={greenColor}
                            _placeholder={{ color: 'gray.500' }}
                            {...register(`question_${question.renderId}.type`,
                                {
                                    required: language === "es" ? "Selecciona un tipo" : "Please select a type",
                                }
                            )}>
                            <option value="text">{language === "es" ? "Linea de texto" : "Single text line"}</option>
                            <option value="textarea">{language === "es" ? "Lineas de texto" : "Multiple text lines"}</option>
                            <option value="positive_num">{language === "es" ? "Numero positivo" : "Positive number"}</option>
                            <option value="checkbox">{language === "es" ? "Checkbox" : "Checkbox"}</option>
                        </Select>
                        <FormErrorMessage>{errors[`question_${question.renderId}`]?.type
                            && errors[`question_${question.renderId}`]?.type.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl display="flex" alignItems="center" gap={2} justifyContent="flex-end">
                        <FormLabel
                            color={greenColor}
                            fontWeight="bold"
                            m={0} >
                            {language === "es" ? "¿Mostrar en resultados?" : "Show in results?"}
                        </FormLabel>
                        <Switch
                            colorScheme="green"
                            defaultChecked
                            {...register(`question_${question.renderId}.displayed`)} />
                    </FormControl>
                </Flex>

                <FormControl mb={3} isInvalid={errors[`question_${question.renderId}`]?.title}>
                    <Input
                        type="text"
                        placeholder={language === "es" ? "Etiqueta" : "Label"}
                        focusBorderColor={greenColor}
                        variant="flushed"
                        _placeholder={{ color: 'gray.500' }}
                        {...register(`question_${question.renderId}.title`,
                            {
                                required: language === "es" ? "Ingresa una etiqueta" : "Enter a label",
                                maxLength: {
                                    value: 255,
                                    message: language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters",
                                }
                            })
                        } />
                    <FormErrorMessage>{errors[`question_${question.renderId}`]?.title
                        && errors[`question_${question.renderId}`]?.title.message}</FormErrorMessage>
                </FormControl>

                <FormControl mb={3} isInvalid={errors[`question_${question.renderId}`]?.description}>
                    <Input
                        type="text"
                        placeholder={language === "es" ? "Pregunta" : "Question"}
                        focusBorderColor={greenColor}
                        variant="flushed"
                        _placeholder={{ color: 'gray.500' }}
                        {...register(`question_${question.renderId}.description`,
                            {
                                required: language === "es" ? "Ingresa la pregunta" : "Enter the question text",
                                maxLength: {
                                    value: 255,
                                    message: language === "es" ? "Longitud maxima de 255 caracteres" : "Maximum length is 255 characters",
                                }
                            })
                        } />
                    <FormErrorMessage>{errors[`question_${question.renderId}`]?.description
                        && errors[`question_${question.renderId}`]?.description.message}</FormErrorMessage>
                </FormControl>

                <FormControl mb={3}>
                    {type === "text" && <Input
                        type="text"
                        placeholder={language === "es" ? "Respuesta (Vista previa)" : "Answer (preview)"}
                        focusBorderColor={greenColor}
                        _placeholder={{ color: 'gray.500' }} />}

                    {type === "textarea" && <Textarea
                        placeholder={language === "es" ? "Respuesta (Vista previa)" : "Answer (preview)"}
                        focusBorderColor={greenColor}
                        rows={4}
                        _placeholder={{ color: 'gray.500' }} />}

                    {type === "positive_num" && <NumberInput
                        defaultValue={0}
                        min={0}
                        focusBorderColor={greenColor} >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>}

                    {type === "checkbox" && <Checkbox
                        colorScheme="green" >
                        {language === "es" ? "Respuesta (Vista previa)" : "Answer (preview)"}
                    </Checkbox>}
                </FormControl>

                <Flex justifyContent="flex-end">
                    <IconButton
                        colorScheme="red"
                        icon={<DeleteIcon />}
                        variant="ghost"
                        onClick={handleDelete} />
                </Flex>
            </CardBody>
        </Card>
    )
}

export default QuestionItem;