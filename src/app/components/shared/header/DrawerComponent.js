//React imports
import { useContext } from "react";

//Chakra imports
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    Box,
    Text,
    Divider,
    Avatar,
    Button,
    Switch,
    Flex
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

//Conponent imports
import Logo from "../Logo";
import DrawerItem from "./DrawerItem";

//Context imports
import { UIContext } from "../../../context/UIContext";
import { AuthContext } from "../../../context/AuthContext";

//Library imports
import { MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { IoLogOut, IoHome } from "react-icons/io5";

const DrawerComponent = ({ showDrawer, setShowDrawer, goToLogin, colorMode, toggleColor, logout, goTo }) => {
    const { language, changeLanguage,  greenColor } = useContext(UIContext);
    const { user } = useContext(AuthContext);

    const onChangeLanguage = () => {
        changeLanguage(language === "es" ? "en" : "es");
    }

    return (
        <Drawer placement="left" onClose={() => setShowDrawer(false)} isOpen={showDrawer}>
            <DrawerOverlay />
            <DrawerContent>

                <DrawerHeader borderBottomWidth='1px'>
                    <Logo />
                </DrawerHeader>

                <DrawerBody px={2} display="flex" flexDirection="column">
                    {user === null && <>
                        <Flex direction="column" gap={3} p={4} justify="center">
                            <Button
                                colorScheme="green"
                                onClick={() => goToLogin('login')}>
                                {language === "es" ? "Ingresar" : "Log In"}
                            </Button>
                            <Button
                                colorScheme="green"
                                variant="outline" onClick={() => goToLogin('signup')}>
                                {language === "es" ? "Registrarse" : "Sign Up"}
                            </Button>
                        </Flex>
                    </>}

                    {user !== null && <>
                        <Flex
                            w="100%"
                            gap={2}
                            p={4}
                            _hover={{ cursor: 'pointer', color: greenColor }} >
                            <Avatar name={user.name} bg={greenColor} />
                            <Box>
                                <Text fontSize="lg">{user.name}</Text>
                                <Text fontSize="xs">{user.email}</Text>
                            </Box>
                        </Flex>
                        <Divider />

                        <DrawerItem
                            action={() => setShowDrawer(false)}
                            icon={IoHome}
                            text={language === "es" ? "Inicio" : "Home"} />
                        <Divider />

                        <DrawerItem
                            action={() => console.log("Ir a dashboard")}
                            icon={MdDashboard}
                            text={language === "es" ? "Mi Dashboard" : "My Dashboard"} />
                        <Divider />

                        {user.is_admin && <>
                            <DrawerItem
                                action={() => goTo('/admin-panel')}
                                icon={MdAdminPanelSettings}
                                text={language === "es" ? "Panel de administración" : "Admin Panel"} />
                            <Divider /></>}

                        <DrawerItem
                            action={logout}
                            icon={IoLogOut}
                            text={language === "es" ? "Cerrar sesión" : "Log Out"} />
                    </>}

                    <Flex align="center" p={4} mt={"auto"}>
                        <Text fontSize="lg">English</Text>
                        <Switch mx={4} colorScheme="green" isChecked={language === "es"} onChange={onChangeLanguage} />
                        <Text fontSize="lg">Español</Text>
                    </Flex>
                    <Divider />
                    <Flex align="center" p={4}>
                        <SunIcon />
                        <Switch mx={4} colorScheme="green" isChecked={colorMode === "dark"} onChange={toggleColor} />
                        <MoonIcon />
                    </Flex>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}

export default DrawerComponent;