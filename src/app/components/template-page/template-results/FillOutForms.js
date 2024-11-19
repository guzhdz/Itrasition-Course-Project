//React/Next imports
import { useState, useEffect } from "react";

//Chakra imports
import {
    Card,
    CardBody,
    CardHeader,
    Heading
} from "@chakra-ui/react";

//Components imports
import FormsTable from "./FormsTable";

//Context imports
import { useUI } from "../../../context/UIContext";

const FillOutForms = ({ forms, setForms }) => {
    const { language } = useUI();

    useEffect(() => {
      }, []);

    return (
        <Card textAlign="initial" mb={4} px={{ base: 0, md: 6 }}>
        <CardHeader>
            <Heading size="md">
                {language === "es" ? "Formularios contestados" : "Filled forms"}
            </Heading>
        </CardHeader>

        <CardBody py={2}>
            <FormsTable forms={forms} setForms={setForms} />
        </CardBody>
        </Card>
    )
}

export default FillOutForms;