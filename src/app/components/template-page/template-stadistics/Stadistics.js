//Chakra imports
import {
    Card,
    CardBody,
    CardHeader,
    Heading,
    Text
} from "@chakra-ui/react";

//Components imports
import QuestionsStadistics from "./QuestionsStadistics";

//Context imports
import { useUI } from "../../../context/UIContext";

const Statistics = ({ stadistics }) => {
    const { language, greenColor } = useUI();

    return (
        <>
            <Card textAlign="initial" mb={4} px={6} pb={4}>
                <CardHeader>
                    <Heading size="md">
                        {language === "es" ? "Estadísticas de los resultados" : "Result's statistics"}
                    </Heading>
                </CardHeader>
                <CardBody
                    py={2}
                    display="flex"
                    justifyContent="space-between"
                    flexDirection={{ base: "column", sm: "row" }}
                    gap={4}>
                    <Heading size="md" color={greenColor}>
                        {stadistics.title}
                    </Heading>
                    <Text fontSize="lg">
                        {stadistics._count.forms} {language === "es" ? "Formularios contestados" : "Filled forms"}
                    </Text>
                </CardBody>
            </Card>

            {stadistics._count.forms > 0 && stadistics.questions.length > 0 && <QuestionsStadistics stadistics={stadistics} />}
        </>
    )
}

export default Statistics;