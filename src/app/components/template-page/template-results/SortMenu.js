//React/Next imports
import { useState } from "react";

//Chakra imports
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    MenuDivider,
    IconButton,
    MenuItemOption,
    MenuOptionGroup
} from "@chakra-ui/react";

//Library imports
import { FaSort } from "react-icons/fa";

//Context imports
import { useUI } from "../../../context/UIContext";

const SortMenu = ({ sortForms }) => {
    const { language } = useUI();
    const [order, setOrder] = useState('asc');

    const handleChangeOrder = (value) => {
        setOrder(value);
    }

    return (
        <Menu closeOnSelect={false}>
            <MenuButton as={IconButton} icon={<FaSort />} variant="ghost" colorScheme="green">
            </MenuButton>
            <MenuList>
                <MenuGroup title={language === "es" ? "Ordenar por" : "Sort by"} textAlign="left" fontSize="xs">
                    <MenuItem onClick={() => sortForms(0, order)} closeOnSelect={true}>
                        {language === "es" ? "Ultima edición" : "Last edition date"}
                    </MenuItem>
                    <MenuItem onClick={() => sortForms(1, order)} closeOnSelect={true}>
                        {language === "es" ? "Remitente" : "Submitter"}
                    </MenuItem>
                    <MenuItem onClick={() => sortForms(2, order)} closeOnSelect={true}>
                        {language === "es" ? "Correo" : "Email"}
                    </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuOptionGroup
                    title={language === "es" ? "Orden" : "Order"}
                    textAlign="left"
                    fontSize="xs"
                    value={order}
                    onChange={handleChangeOrder} >
                    <MenuItemOption value="asc">{language === "es" ? "Ascendente" : "Ascending"}</MenuItemOption>
                    <MenuItemOption value="desc">{language === "es" ? "Descendente" : "Descending"}</MenuItemOption>
                </MenuOptionGroup>
            </MenuList>
        </Menu>
    )
}

export default SortMenu;