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

const TableTabs = ({ callCheckAuth }) => {
    const { language } = useContext(UIContext);

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
                    <UsersTable usersRequest="getUsers" callCheckAuth={callCheckAuth} />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getActiveUsers" callCheckAuth={callCheckAuth} />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getBlockedUsers" callCheckAuth={callCheckAuth} />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getAdminUsers" callCheckAuth={callCheckAuth} />
                </TabPanel>
                <TabPanel>
                    <UsersTable usersRequest="getNormalUsers" callCheckAuth={callCheckAuth} />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default TableTabs;