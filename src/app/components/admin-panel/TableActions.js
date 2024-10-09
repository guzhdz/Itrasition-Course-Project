//React imports
import { useContext, useState } from "react";

//Chakra imports
import {
    Collapse,
    Flex,
    Button,
    IconButton
} from "@chakra-ui/react";
import { LockIcon, UnlockIcon, DeleteIcon } from "@chakra-ui/icons";

//Context imports
import { UIContext } from "../../context/UIContext";

//Component imports
import ConfirmModal from "../shared/ConfirmModal";

const TableActions = ({ isOpen, deleteSelected, updateSelected }) => {
    const { language } = useContext(UIContext);
    const [showModal, setShowModal] = useState(false);
    const [confirmModalInfo, setConfirmModalInfo] = useState({
        title: "",
        message: "",
        confirmCallback: () => { },
    });

    const openModal = (mode) => {
        switch (mode) {
            case 0:
                setConfirmModalInfo({
                    title: language === "es" ? "Confirmar bloqueo" : "Confirm block",
                    message: language === "es" ? "¿Esta seguro de que desea bloquear los usuarios seleccionados?"
                        : "Are you sure you want to block the selected users?",
                    confirmCallback: () => updateSelected("status", false),
                });
                setShowModal(true);
                break;

            case 1:
                setConfirmModalInfo({
                    title: language === "es" ? "Confirmar desbloqueo" : "Confirm unblock",
                    message: language === "es" ? "¿Esta seguro de que desea desbloquear los usuarios seleccionados?"
                        : "Are you sure you want to unblock the selected users?",
                    confirmCallback: () => updateSelected("status", true),
                });
                setShowModal(true);
                break;

            case 2:
                setConfirmModalInfo({
                    title: language === "es" ? "Confirmar eliminación" : "Confirm delete",
                    message: language === "es" ? "¿Esta seguro de que desea eliminar los usuarios seleccionados?"
                        : "Are you sure you want to delete the selected users?",
                    confirmCallback: () => deleteSelected,
                });
                setShowModal(true);
                break;

            case 3:
                setConfirmModalInfo({
                    title: language === "es" ? "Confirmar hacer admin" : "Confirm add to admins",
                    message: language === "es" ? "¿Esta seguro de que desea hacer admin a los usuarios seleccionados?"
                        : "Are you sure you want to add to admins the selected users?",
                    confirmCallback: () => updateSelected("is_admin", true),
                });
                setShowModal(true);
                break;

            case 4:
                setConfirmModalInfo({
                    title: language === "es" ? "Confirmar quitar admin" : "Confirm remove from admins",
                    message: language === "es" ? "¿Esta seguro de que desea quitar el admin a los usuarios seleccionados?"
                        : "Are you sure you want to remove from admins the selected users?",
                    confirmCallback: () => updateSelected("is_admin", false),
                });
                setShowModal(true);
                break;
        }
    }

    return (
        <>
            <Collapse in={isOpen} animateOpacity startingHeight={0.5}>
                <Flex mb={3} justify="flex-end" gap={3}>
                    <IconButton
                        icon={<LockIcon />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => openModal(0)} />
                    <IconButton
                        icon={<UnlockIcon />}
                        colorScheme="teal"
                        variant="ghost"
                        onClick={() => openModal(1)} />
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="gray"
                        variant="ghost"
                        onClick={() => openModal(2)} />
                    <Button colorScheme="green" onClick={() => openModal(3)}>
                        {language === "es" ? "Hacer admin" : "Add to admins"}
                    </Button>
                    <Button colorScheme="green" variant={"outline"} onClick={() => openModal(4)}>
                        {language === "es" ? "Quitar admin" : "Remove from admins"}
                    </Button>
                </Flex>
            </Collapse>
            <ConfirmModal
                closeOnOverlay={false}
                showModal={showModal}
                setShowModal={setShowModal}
                {...confirmModalInfo} />
        </>
    )
}

export default TableActions;