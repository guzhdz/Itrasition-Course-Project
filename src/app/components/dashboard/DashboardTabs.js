//React/Next imports
import { useRouter } from "next/navigation";

//Chakra imports
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from "@chakra-ui/react";

//Components imports
import TemplatesTable from "./templates-table/TemplatesTable";
import FormsTable from "./forms-table/FormsTable";
import TicketsTable from "./tickets-table/TicketsTable";

//Context imports
import { useUI } from "../../context/UIContext";

const DashboardTabs = ({ checkAuth, loadTemplates, loadForms, loadTickets }) => {
    const router = useRouter();
    const { language, setPageLoaded } = useUI();

    const goTo = (path) => {
        setPageLoaded(false);
        router.push(path);
    }

    return (
        <Tabs colorScheme="green" isLazy align="center">
            <TabList>
                <Tab>{language === "es" ? "Mis plantillas" : "My templates"}</Tab>
                <Tab>{language === "es" ? "Mis formularios" : "My forms"}</Tab>
                <Tab>{language === "es" ? "Mis tickets" : "My tickets"}</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <TemplatesTable goTo={goTo} checkAuth={checkAuth} loadTemplates={loadTemplates} />
                </TabPanel>
                <TabPanel>
                    <FormsTable goTo={goTo} checkAuth={checkAuth} loadForms={loadForms} />
                </TabPanel>
                <TabPanel>
                    <TicketsTable checkAuth={checkAuth} loadTickets={loadTickets} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default DashboardTabs;