//Chakra imports
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from "@chakra-ui/react";

//Components imports
import TemplateSettings from "./template-settings/TemplateSettings";
import TemplateQuestions from "./template-questions/TemplateQuestions";

//Context imports
import { useUI } from "../../context/UIContext";

const TemplatePageTabs = ({ id, checkAuth, isSavingChanges, setIsSavingChanges }) => {
    const { language} = useUI();
    
    return (
        <Tabs colorScheme="green" align="center">
            <TabList flexWrap="wrap">
                <Tab>{language === "es" ? "Configuración" : "Settings"}</Tab>
                <Tab>{language === "es" ? "Preguntas" : "Questions"}</Tab>
                <Tab>{language === "es" ? "Resultados" : "Results"}</Tab>
                <Tab>{language === "es" ? "Estadísticas" : "Statistics"}</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <TemplateSettings 
                    id={id} 
                    checkAuth={checkAuth} 
                    isSavingChanges={isSavingChanges} 
                    setIsSavingChanges={setIsSavingChanges}/>
                </TabPanel>
                <TabPanel>
                    <TemplateQuestions 
                    id={id} 
                    checkAuth={checkAuth}
                    isSavingChanges={isSavingChanges} 
                    setIsSavingChanges={setIsSavingChanges} />
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