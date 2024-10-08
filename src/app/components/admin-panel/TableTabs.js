//React imports
import { useContext } from "react";

//Chakra imports
import {
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from "@chakra-ui/react";

//Components imports
import UsersTable from "./UsersTable";

//Context imports
import { UIContext } from "../../context/UIContext";

const TableTabs = () => {
    const { language } = useContext(UIContext);

    return (
        <Tabs colorScheme="green">
            <TabList>
                <Tab>{language === "es" ? "Todos" : "All"}</Tab>
                <Tab>{language === "es" ? "Activos" : "Active"}</Tab>
                <Tab>{language === "es" ? "Bloqueados" : "Blocked"}</Tab>
                <Tab>{language === "es" ? "Admins" : "Admins"}</Tab>
                <Tab>{language === "es" ? "No Admin" : "Not Admin"}</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <UsersTable usersRequest="getUsers" />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getActiveUsers" />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getBlockedUsers" />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getAdminUsers" />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getNormalUsers" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default TableTabs;