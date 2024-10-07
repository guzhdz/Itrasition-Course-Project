//React imports
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

//Chakra imports
import {
    FormControl,
    Input,
    InputGroup,
    InputLeftElement,
    Box,
    Select,
    IconButton,
    Button,
    useColorMode,
    Show,
} from "@chakra-ui/react";
import { SearchIcon, SunIcon, MoonIcon, HamburgerIcon } from "@chakra-ui/icons";

//Components imports
import Logo from "./Logo";
import SimpleModal from "./SimpleModal";
import MenuComponent from "./Header/MenuComponent";
import DrawerComponent from "./Header/DrawerComponent";

//Context imports
import { UIContext } from "../../context/UIContext";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
    const router = useRouter();
    const { colorMode, toggleColorMode } = useColorMode();
    const { greenColor, language, setLanguage } = useContext(UIContext);
    const { checkAuth, user, resetAuth } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '' });
    const [showDrawer, setShowDrawer] = useState(false);

    const toggleColor = () => {
        toggleColorMode();
    }

    const goTo = (path) => {
        router.push(path);
    }

    const goToLogin = (form) => {
        goTo(`/authentication?form=${form}`);
    }

    const callCheckAuth = async () => {
        const response = await checkAuth();
        if (!response.ok && response.message) {
            openModal(
                language === "es" ? 'Autenticación fallida' : 'Authentication failed',
                language ? response.message[language] : response.message.en
            )
        }
    }

    const openModal = (title, message) => {
        setModalInfo({ title, message });
        setShowModal(true);
    }

    const logout = async () => {
        resetAuth();
        goTo('/');
    }

    useEffect(() => {
        callCheckAuth();
    }, []);

    return (
        <Box
            w="100%"

            py={5} px={8}
            pos="sticky"
            top="0"
            display="flex"
            alignItems="center" >

            <Show above="lg">
                <Logo />
            </Show>
            <Show below="md">
                <IconButton
                    icon={<HamburgerIcon />}
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => setShowDrawer(true)}     />
            </Show>

            <Box display="flex" mx="auto" w={{ base: '80%', md: '60%' }}>
                <FormControl minW="300px">
                    <InputGroup>
                        <InputLeftElement>
                            <SearchIcon color="gray.500" />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder={language === "es" ? "Buscar..." : "Search..."}
                            focusBorderColor={greenColor}
                            _placeholder={{ color: 'gray.500' }}
                        />
                    </InputGroup>
                </FormControl>

                <Show above="md">
                    <Box display="flex">
                        <FormControl mx={2} minW="120px">
                            <InputGroup>
                                <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                </Select>
                            </InputGroup>
                        </FormControl>
                        <IconButton icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} variant="ghost" onClick={toggleColor} />
                    </Box>
                </Show>
            </Box>

            <Show above="md">
                {user === null && <Box display="flex" gap={3}>
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
                </Box>}

                {user !== null && <MenuComponent logout={logout} goTo={goTo} />}
            </Show>

            <SimpleModal
                title={modalInfo.title}
                message={modalInfo.message}
                showModal={showModal}
                setShowModal={setShowModal} />
            <DrawerComponent
                setShowDrawer={setShowDrawer}
                showDrawer={showDrawer}
                goToLogin={goToLogin}
                toggleColor={toggleColor}
                colorMode={colorMode}
                logout={logout} />
        </Box>
    )
}

export default Header;