//React imports
import { useContext } from "react";

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

//Context imports
import { UIContext } from "../../../context/UIContext";
import { AuthContext } from "../../../context/AuthContext";

//Library imports
import { MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { IoLogOut, IoHome } from "react-icons/io5";

const MenuComponent = ({ logout, goTo }) => {
    const { language, greenColor, textGreenScheme } = useContext(UIContext);
    const { user } = useContext(AuthContext);

    return (
        <Menu>
            <MenuButton>
                <Avatar name={user.name} bg={greenColor} color={textGreenScheme} />
            </MenuButton>
            <MenuList>
                <MenuItem>
                    <Flex w="100%" gap={2} p={2}>
                        <Avatar name={user.name} bg={greenColor} color={textGreenScheme} />
                        <Box>
                            <Text fontSize="lg">{user.name}</Text>
                            <Text fontSize="xs">{user.email}</Text>
                        </Box>
                    </Flex>
                </MenuItem>
                <MenuDivider />

                <MenuItem icon={<IoHome />} onClick={() => goTo('/')}>
                    {language === "es" ? "Inicio" : "Home"}
                </MenuItem>
                
                <MenuItem icon={<MdDashboard />}>
                    {language === "es" ? "Mi Dashboard" : "My Dashboard"}
                </MenuItem>

                {user.is_admin &&
                    <MenuItem icon={<MdAdminPanelSettings />}>
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