//Chakra imports
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from "@chakra-ui/react";

//Components imports
import TemplatesTable from "./TemplatesTable";

//Context imports
import { useUI } from "../../context/UIContext";

const DashboardTabs = () => {
    const { language } = useUI();

    return (
        <Tabs colorScheme="green" isLazy align="center">
            <TabList>
                <Tab>{language === "es" ? "Mis plantillas" : "My templates"}</Tab>
                <Tab>{language === "es" ? "Mis formularios" : "My forms"}</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <TemplatesTable />
                </TabPanel>
                <TabPanel>
                    <h1>My forms</h1>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default DashboardTabs;