//Chakra imports
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuDivider,
    IconButton
} from "@chakra-ui/react";

//Library imports
import { FaSort } from "react-icons/fa";

//Context imports
import { useUI } from "../../context/UIContext";

const SortMenu = () => {
    const { language } = useUI();

    return (
        <Menu>
            <MenuButton as={IconButton} icon={<FaSort />} variant="ghost" colorScheme="green">
            </MenuButton>
            <MenuList>
                <MenuGroup title={language === "es" ? "Ordenar por" : "Sort by"} textAlign="left" fontSize="xs">
                    <MenuItem>{language === "es" ? "Indice" : "Index"}</MenuItem>
                    <MenuItem>{language === "es" ? "Titulo" : "Title"}</MenuItem>
                    <MenuItem>{language === "es" ? "Tema" : "Topic"}</MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title={language === "es" ? "Modo" : "Mode"} textAlign="left" fontSize="xs">
                    <MenuItem>{language === "es" ? "Ascendente" : "Ascending"}</MenuItem>
                    <MenuItem>{language === "es" ? "Descendente" : "Descending"}</MenuItem>
                </MenuGroup>
            </MenuList>
        </Menu>
    )
}

export default SortMenu;