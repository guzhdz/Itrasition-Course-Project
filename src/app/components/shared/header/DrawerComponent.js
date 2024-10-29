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
    Flex,
    DrawerCloseButton
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

//Conponent imports
import Logo from "../Logo";
import DrawerItem from "./DrawerItem";

//Library imports
import { MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { IoLogOut, IoHome } from "react-icons/io5";

//Context imports
import { useUI } from "../../../context/UIContext";
import { useAuth } from "../../../context/AuthContext";

const DrawerComponent = ({ showDrawer, setShowDrawer, goToLogin, colorMode, toggleColor, logout, goTo }) => {
    const { language, changeLanguage, greenColor, textGreenScheme } = useUI();
    const { user } = useAuth();

    const onChangeLanguage = () => {
        changeLanguage(language === "es" ? "en" : "es");
    }

    return (
        <Drawer placement="left" onClose={() => setShowDrawer(false)} isOpen={showDrawer}>
            <DrawerOverlay />
            <DrawerContent >
            <DrawerCloseButton />
                <DrawerHeader borderBottomWidth='1px'>
                    <Logo />
                </DrawerHeader>

                <DrawerBody px={2} display="flex" flexDirection="column">
                    {user === null &&
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
                    }

                    {user !== null && <>
                        <Flex
                            w="100%"
                            gap={2}
                            p={4}
                            _hover={{ cursor: 'pointer', color: greenColor }}
                            onClick={() => goTo('/dashboard')} >
                            <Avatar name={user.name} bg={greenColor} color={textGreenScheme} />
                            <Box>
                                <Text fontSize="lg">{user.name}</Text>
                                <Text fontSize="xs">{user.email}</Text>
                            </Box>
                        </Flex>
                        <Divider />

                        <DrawerItem
                            action={() => goTo('/main')}
                            icon={IoHome}
                            text={language === "es" ? "Inicio" : "Home"} />
                        <Divider />

                        <DrawerItem
                            action={() => goTo('/dashboard')}
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