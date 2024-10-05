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
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Text
} from "@chakra-ui/react";
import { SearchIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";

//Library imports
import { MdDashboard, MdAdminPanelSettings } from "react-icons/md";
import { IoLogOut, IoHome } from "react-icons/io5";


//Components imports
import Logo from "./Logo";

//Context imports
import { UIContext } from "../../context/UIContext";
import { AuthContext } from "../../context/AuthContext";

const Header = () => {
    const router = useRouter();
    const { colorMode, toggleColorMode } = useColorMode();
    const { greenColor, language, setLanguage } = useContext(UIContext);
    const { checkAuth, user, resetAuth } = useContext(AuthContext); 

    const toggleColor = () => {
        toggleColorMode();
    }

    const goTo = (path) => {
        router.push(path);
    }

    const goToLogin = (form) => {
        goTo(`/authentication?form=${form}`);
    }

    const callCheckAuth = async() => {
        const response = await checkAuth();
        if(!response.ok && response.message) {
            alert(response.message);
        }
    }

    const logout = async() => {
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

            <Logo />

            <Box display="flex" mx="auto" w="60%">
                <FormControl maxW="700px" minW="300px">
                    <InputGroup>
                        <InputLeftElement>
                            <SearchIcon color="gray.500" />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Search..."
                            focusBorderColor={greenColor}
                            _placeholder={{ color: 'gray.500' }}
                        />
                    </InputGroup>
                </FormControl>

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
            </Box>

            {user === null && <Box display="flex" gap={3}>
                <Button colorScheme="green" onClick={() => goToLogin('login')}>Log In</Button>
                <Button colorScheme="green" variant="outline" onClick={() => goToLogin('signup')}>Sign Up</Button>
            </Box>}

            {user !== null && 
                <Menu>
                    <MenuButton>
                        <Avatar name={user.name} bg={greenColor} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem>
                            <Box display="flex" w="100%" gap={2} p={2}>
                                <Avatar name={user.name} bg={greenColor} />
                                <Box>
                                <Text fontSize="lg">{user.name}</Text>
                                    <Text fontSize="xs">{user.email}</Text>
                                </Box>
                            </Box>
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<IoHome />} onClick={() => goTo('/') }>Home</MenuItem>
                        <MenuItem icon={<MdDashboard />}>My Dashboard</MenuItem>
                        {user.is_admin && <MenuItem icon={<MdAdminPanelSettings />}>Admin Panel</MenuItem> }
                        <MenuDivider />
                        <MenuItem icon={<IoLogOut />} onClick={() => logout()}>Log out</MenuItem>
                    </MenuList>
                </Menu>
            }

        </Box>
    )
}

export default Header;