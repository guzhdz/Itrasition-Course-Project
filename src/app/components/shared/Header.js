//React imports
import { useContext, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

//Chakra imports
import {
    FormControl,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    IconButton,
    Button,
    useColorMode,
    Show,
    Flex,
} from "@chakra-ui/react";
import { SearchIcon, SunIcon, MoonIcon, HamburgerIcon } from "@chakra-ui/icons";

//Components imports
import Logo from "./Logo";
import MenuComponent from "./header/MenuComponent";
import DrawerComponent from "./header/DrawerComponent";

//Context imports
import { UIContext } from "../../context/UIContext";
import { AuthContext } from "../../context/AuthContext";

const Header = ({initializePage}) => {
    const router = useRouter();
    const pathname = usePathname();
    const { colorMode, toggleColorMode } = useColorMode();
    const { greenColor, language, changeLanguage, setPageLoaded } = useContext(UIContext);
    const { user, resetAuth } = useContext(AuthContext);
    const [showDrawer, setShowDrawer] = useState(false);

    const toggleColor = () => {
        toggleColorMode();
    }

    const goTo = (path) => {
        setPageLoaded(false);
        if(pathname === path) {
            initializePage();
        }
        else
            router.push(path);
    }

    const goToLogin = (form) => {
        goTo(`/authentication?form=${form}`);
    }

    const logout = async () => {
        await resetAuth();
        goTo('/');
    }

    return (
        <Flex
            w="100%"
            py={4} px={8}
            pos="sticky"
            top="0"
            align="center"
            mb={3}
            zIndex={1000} >

            <Show above="lg">
                <Logo />
            </Show>
            <Show below="md">
                <IconButton
                    icon={<HamburgerIcon />}
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => setShowDrawer(true)} />
            </Show>

            <Flex direction="row" mx="auto" w={{ base: '80%', md: '60%' }}>
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
                    <Flex>
                        <FormControl mx={2} minW="120px">
                            <InputGroup>
                                <Select value={language} onChange={(e) => changeLanguage(e.target.value)}>
                                    <option value="en">English</option>
                                    <option value="es">Español</option>
                                </Select>
                            </InputGroup>
                        </FormControl>
                        <IconButton icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />} variant="ghost" onClick={toggleColor} />
                    </Flex>
                </Show>
            </Flex>

            <Show above="md">
                {user === null && <Flex gap={3}>
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
                </Flex>}

                {user !== null && <MenuComponent logout={logout} goTo={goTo} />}
            </Show>
            <DrawerComponent
                setShowDrawer={setShowDrawer}
                showDrawer={showDrawer}
                goToLogin={goToLogin}
                toggleColor={toggleColor}
                colorMode={colorMode}
                logout={logout}
                goTo={goTo} />
        </Flex>
    )
}

export default Header;