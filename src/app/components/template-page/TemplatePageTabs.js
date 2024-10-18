//React/Next imports
import { useState, useEffect } from "react";

//Chakra imports
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";

//Components imports
import TemplateSettings from "./TemplateSettings";

//Context imports
import { useUI } from "../../context/UIContext";

const TemplatePageTabs = ({ id, checkAuth }) => {
    const { language} = useUI();
    
    return (
        <Tabs colorScheme="green" align="center">
            <TabList>
                <Tab>{language === "es" ? "Configuración" : "Settings"}</Tab>
                <Tab>{language === "es" ? "Preguntas" : "Questions"}</Tab>
                <Tab>{language === "es" ? "Resultados" : "Results"}</Tab>
                <Tab>{language === "es" ? "Estadísticas" : "Statistics"}</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <TemplateSettings id={id} checkAuth={checkAuth}/>
                </TabPanel>
                <TabPanel>
                    <h1>Questions</h1>
                </TabPanel>
                <TabPanel>
                    <h1>Results</h1>
                </TabPanel>
                <TabPanel>
                    <h1>Statistics</h1>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default TemplatePageTabs;