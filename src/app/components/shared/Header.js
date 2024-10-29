//React/Next imports
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

//Chakra imports
import {
    FormControl,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
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

//Services imports
import { getCookie } from "../../services/cookiesService";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";

const Header = ({ refreshPage }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { colorMode, toggleColorMode } = useColorMode();
    const { bg, greenColor, language, changeLanguage, setPageLoaded, openExpiredSessionModal } = useUI();
    const { user, resetAuth } = useAuth();
    const [showDrawer, setShowDrawer] = useState(false);

    const toggleColor = () => {
        toggleColorMode();
    }

    const handleSearchEnter = (event) => {
        if (event.key === 'Enter') {
            goTo('/search-results');
        }
    }

    const goTo = async (path) => {
        setPageLoaded(false);
        const response = await getCookie('authToken');
        if (!response.ok) {
            openExpiredSessionModal(() => router.push('/'));
        } else {
            if (pathname === path) {
                refreshPage();
            }
            router.push(path);
        }
    }

    const goToLogin = (form) => {
        setPageLoaded(false);
        router.push(`/authentication?form=${form}`);
    }

    const logout = async () => {
        setPageLoaded(false);
        await resetAuth();
        router.push('/');
    }

    return (
        <Flex
            w="100%"
            py={4} px={{ base: 2, sm: 4, md: 8 }}
            pos="sticky"
            top="0"
            align="center"
            mb={3}
            zIndex={1000}
            bg={bg} >

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
                <FormControl minW="260px">
                    <InputGroup>
                        <InputLeftElement>
                            <SearchIcon color="gray.500" />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder={language === "es" ? "Buscar..." : "Search..."}
                            focusBorderColor={greenColor}
                            onKeyDown={handleSearchEnter}
                            onK
                            _placeholder={{ color: 'gray.500' }}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button
                                colorScheme="green"
                                h='1.75rem' 
                                size='sm'
                                onClick={() => goTo('/search-results')}>
                                {language === "es" ? "Buscar" : "Search"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Show above="md">
                    <Flex>
                        <FormControl mx={2} minW="120px">
                            <InputGroup>
                                <Select
                                    value={language}
                                    focusBorderColor={greenColor}
                                    onChange={(e) => changeLanguage(e.target.value)}>
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