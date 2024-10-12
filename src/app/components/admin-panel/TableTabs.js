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
import { useUI } from "../../context/UIContext";

const TableTabs = ({ checkAuth }) => {
    const { language } = useUI();

    return (
        <Tabs colorScheme="green" isLazy>
            <TabList>
                <Tab>{language === "es" ? "Todos" : "All"}</Tab>
                <Tab>{language === "es" ? "Activos" : "Active"}</Tab>
                <Tab>{language === "es" ? "Bloqueados" : "Blocked"}</Tab>
                <Tab>{language === "es" ? "Admins" : "Admins"}</Tab>
                <Tab>{language === "es" ? "No Admin" : "Not Admin"}</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <UsersTable usersRequest="getUsers" checkAuth={checkAuth} />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getActiveUsers" checkAuth={checkAuth} />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getBlockedUsers" checkAuth={checkAuth} />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getAdminUsers" checkAuth={checkAuth} />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getNormalUsers" checkAuth={checkAuth} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default TableTabs;