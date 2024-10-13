//Chakra imports
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    Text,
    Box,
    Flex
} from "@chakra-ui/react";

//Library imports
import { MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { IoLogOut, IoHome } from "react-icons/io5";

//Context imports
import { useUI } from "../../../context/UIContext";
import { useAuth } from "../../../context/AuthContext";

const MenuComponent = ({ logout, goTo }) => {
    const { language, greenColor, textGreenScheme } = useUI();
    const { user } = useAuth();

    return (
        <Menu zIndex={1000}>
            <MenuButton>
                <Avatar name={user.name} bg={greenColor} color={textGreenScheme} />
            </MenuButton>
            
            <MenuList>
                <MenuItem onClick={() => goTo('/dashboard')}>
                    <Flex w="100%" gap={2} p={2}>
                        <Avatar name={user.name} bg={greenColor} color={textGreenScheme} />
                        <Box>
                            <Text fontSize="lg">{user.name}</Text>
                            <Text fontSize="xs">{user.email}</Text>
                        </Box>
                    </Flex>
                </MenuItem>
                <MenuDivider />

                <MenuItem icon={<IoHome />} onClick={() => goTo('/main')}>
                    {language === "es" ? "Inicio" : "Home"}
                </MenuItem>
                
                <MenuItem icon={<MdDashboard />} onClick={() => goTo('/dashboard')}>
                    {language === "es" ? "Mi Dashboard" : "My Dashboard"}
                </MenuItem>

                {user.is_admin &&
                    <MenuItem icon={<MdAdminPanelSettings />} onClick={() => goTo('/admin-panel')}>
                        {language === "es" ? "Panel de administración" : "Admin Panel"}
                    </MenuItem>}   
                <MenuDivider />


                <MenuItem icon={<IoLogOut />} onClick={logout}>
                    {language === "es" ? "Cerrar sesión" : "Log Out"}
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default MenuComponent;