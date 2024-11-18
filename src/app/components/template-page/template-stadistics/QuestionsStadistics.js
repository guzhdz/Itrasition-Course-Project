//React/Next imports
import { useState, useEffect } from "react";

//Chakra imports
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Card,
    CardBody,
    Heading,
    Flex,
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    UnorderedList,
    ListItem
} from "@chakra-ui/react";

//Library imports
import Chart from "react-apexcharts";

//Context imports
import { useUI } from "../../../context/UIContext";

const QuestionsStadistics = ({ stadistics }) => {
    const { barColor, bar2Color, textColor, chartTooltipBg, language, greenColor } = useUI();
    const [barChartOptions, setBarChartOptions] = useState({
        chart: {
            toolbar: {
                show: false
            },
            foreColor: barColor
        },
        colors: [barColor, bar2Color],
        tooltip: {
            theme: chartTooltipBg
        }
    });
    const [pieChartOptions, setPieChartOptions] = useState({
        chart: {
            toolbar: {
                show: false
            },
            foreColor: barColor,
        },
        colors: [barColor],
        labels: ["Yes", "No"],
    });

    useEffect(() => {
        setBarChartOptions((prevState) => ({
            ...prevState,
            chart: {
                ...prevState.chart,
                foreColor: textColor
            },
            colors: [barColor],
            tooltip: {
                theme: chartTooltipBg
            }
        }));
        setPieChartOptions((prevState) => ({
            ...prevState,
            chart: {
                ...prevState.chart,
                foreColor: textColor
            },
            colors: [barColor, bar2Color]
        }))
    }, [textColor, barColor, bar2Color, chartTooltipBg]);

    return (
        <>
            {stadistics.questions.map((question, index) => (
                <Card textAlign="initial" mb={4} px={6} key={index}>
                    <CardBody>
                        <Accordion allowToggle>
                            <AccordionItem border="none">
                                <AccordionButton>
                                    <Heading size="md" as='span' flex='1' textAlign="left">
                                        {question.title}
                                    </Heading>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                    {question.type === "text" && (
                                        <Flex flexDirection="column" gap={4}>
                                            <Box width="60%" mx="auto">
                                                <Text fontSize="md">
                                                    {language === "es" ? "Grafica de respuestas" : "Answers bar chart"}
                                                </Text>
                                                <Chart
                                                    options={barChartOptions}
                                                    series={[
                                                        {
                                                            name: "Count",
                                                            data: question.aggregation.sortedAnswers.map((answer) =>
                                                            ({
                                                                x: answer[0],
                                                                y: answer[1]
                                                            }))
                                                        }]}
                                                    type="bar"
                                                    width="100%"
                                                />
                                            </Box>

                                            <Box>
                                                <Stat>
                                                    <StatLabel>
                                                        {language === "es" ? "Respuestas" : "Most frequent answer"}
                                                    </StatLabel>
                                                    <StatNumber>{question.aggregation.maxAnswer[0]}</StatNumber>
                                                    <StatHelpText>
                                                        {language === "es" ? "Conteo: " : "Count: "}{question.aggregation.maxAnswer[1]}
                                                    </StatHelpText>
                                                </Stat>
                                            </Box>
                                        </Flex>
                                    )}

                                    {question.type === "positive_num" && (
                                        <Flex direction="row" justify="space-around">
                                            <Box>
                                                <Stat>
                                                    <StatLabel>
                                                        {language === "es" ? "Promedio de respuestas" : "Answer average"}
                                                    </StatLabel>
                                                    <StatNumber color={greenColor} textAlign="center">
                                                        {question.aggregation.average}
                                                    </StatNumber>
                                                </Stat>
                                            </Box>

                                            <Box>
                                                <Stat>
                                                    <StatLabel>
                                                        {language === "es" ? "Respuesta maxima" : "Maximum answer"}
                                                    </StatLabel>
                                                    <StatNumber color={greenColor} textAlign="center">
                                                        {question.aggregation.max}
                                                    </StatNumber>
                                                </Stat>
                                            </Box>

                                            <Box>
                                                <Stat>
                                                    <StatLabel>
                                                        {language === "es" ? "Respuesta minima" : "Minimum answer"}
                                                    </StatLabel>
                                                    <StatNumber color={greenColor} textAlign="center">
                                                        {question.aggregation.min}
                                                    </StatNumber>
                                                </Stat>
                                            </Box>
                                        </Flex>
                                    )}

                                    {question.type === "textarea" && (
                                        <Flex direction="column" gap={4}>
                                            <Box>
                                                <Text fontSize="md" mb={2}>
                                                    {language === "es" ? "Palabras mas comunes" : "Most common words"}
                                                </Text>
                                                <UnorderedList>
                                                    {question.aggregation.mostCommonWords.map((word, index) => (
                                                        <ListItem key={index} fontSize="md" color={greenColor} fontWeight="bold">
                                                            {word[0]}
                                                        </ListItem>
                                                    ))}
                                                </UnorderedList>
                                            </Box>

                                            <Box>
                                                <Stat>
                                                    <StatLabel>
                                                        {language === "es" ? "Longitud promedio de palabras" : "Average words length"}
                                                    </StatLabel>
                                                    <StatNumber color={greenColor}>
                                                        {question.aggregation.averageWords}
                                                    </StatNumber>
                                                </Stat>
                                            </Box>
                                        </Flex>
                                    )}

                                    {question.type === "checkbox" && (
                                        <Flex flexDirection="column" gap={4}>
                                            <Box width="60%" mx="auto">
                                                <Text fontSize="md">
                                                    {language === "es" ? "Grafica de respuestas" : "Answers bar chart"}
                                                </Text>
                                                <Chart
                                                    options={pieChartOptions}
                                                    series={[
                                                        parseFloat(question.aggregation.percentages.yes),
                                                        parseFloat(question.aggregation.percentages.no)
                                                        ]}
                                                    type="pie"
                                                    width="100%"
                                                />
                                            </Box>
                                        </Flex>
                                    )}
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </CardBody>
                </Card>
            ))}
        </>
    )
}

export default QuestionsStadistics;