//React imports
import { useContext } from "react";

//Chakra imports
import {
    Collapse,
    Flex,
    Button,
    IconButton,
    Tooltip
} from "@chakra-ui/react";
import { LockIcon, UnlockIcon, DeleteIcon } from "@chakra-ui/icons";

//Context imports
import { UIContext } from "../../context/UIContext";

const TableActions = ({ isOpen, deleteSelected, updateSelected }) => {
    const { language } = useContext(UIContext);

    return (
        <Collapse in={isOpen} animateOpacity startingHeight={0.5}>
            <Flex mb={3} justify="flex-end" gap={3}>
                <Tooltip label={language === "es" ? "Bloquear" : "Block"}>
                    <IconButton
                        icon={<LockIcon />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => updateSelected("status", false)} />
                </Tooltip>
                <Tooltip label={language === "es" ? "Desbloquear" : "Unblock"}>
                    <IconButton
                        icon={<UnlockIcon />}
                        colorScheme="teal"
                        variant="ghost"
                        onClick={() => updateSelected("status", true)} />
                </Tooltip>
                <Tooltip label={language === "es" ? "Eliminar" : "Delete"}>
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="gray"
                        variant="ghost"
                        onClick={deleteSelected} />
                </Tooltip>
                <Button colorScheme="green" onClick={() => updateSelected("is_admin", true)}>
                    {language === "es" ? "Hacer admin" : "Add to admins"}
                </Button>
                <Button colorScheme="green" variant={"outline"} onClick={() => updateSelected("is_admin", false)}>
                    {language === "es" ? "Quitar admin" : "Remove from admins"}
                </Button>
            </Flex>
        </Collapse>
    )
}

export default TableActions;