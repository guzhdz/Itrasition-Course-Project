//React imports
import { useContext, useState } from "react";
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

const Header = () => {
    const router = useRouter();
    const { colorMode, toggleColorMode } = useColorMode();
    const { greenColor, language, setLanguage } = useContext(UIContext);
    const [logged, setLogged] = useState(false);

    const toggleColor = () => {
        toggleColorMode();
    }

    const goToLogin = (form) => {
        router.push(`/authentication?form=${form}`);
    }

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

            {!logged && <Box display="flex" gap={3}>
                <Button colorScheme="green" onClick={() => goToLogin('login')}>Log In</Button>
                <Button colorScheme="green" variant="outline" onClick={() => goToLogin('signup')}>Sign Up</Button>
                <Button colorScheme="green" onClick={() => setLogged(true)}>Test Button</Button>
            </Box>}

            {logged && /*<Box>
                <Avatar name="Gustavo Hernandez"/>
            </Box>*/
                <Menu>
                    <MenuButton>
                        <Avatar name="guzhdz21" bg={greenColor} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem>
                            <Box display="flex" w="100%" gap={2} p={2}>
                                <Avatar name="guzhdz21" bg={greenColor} />
                                <Box>
                                <Text fontSize="lg">guzhdz21</Text>
                                    <Text fontSize="xs">guzhdz21@gmail.com</Text>
                                </Box>
                            </Box>
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<IoHome />}>Home</MenuItem>
                        <MenuItem icon={<MdDashboard />}>My Dashboard</MenuItem>
                        <MenuItem icon={<MdAdminPanelSettings />}>Admin Panel</MenuItem>
                        <MenuDivider />
                        <MenuItem icon={<IoLogOut />} onClick={() => setLogged(false)}>Log out</MenuItem>
                    </MenuList>
                </Menu>
            }

        </Box>
    )
}

export default Header;