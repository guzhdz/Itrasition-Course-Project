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

const TableActions = ({ isOpen, deleteSelected, updateSelected, checkAuth }) => {
    const { language } = useContext(UIContext);
    const [showModal, setShowModal] = useState(false);
    const [confirmModalInfo, setConfirmModalInfo] = useState({
        title: "",
        message: "",
        confirmCallback: () => { },
    });

    const selectModalMode = (mode) => {
        let title = '', message = '', confirmCallback = () => { };
        switch (mode) {
            case 0:
                title = language === "es" ? "Confirmar bloqueo" : "Confirm block";
                message = language === "es" ? "¿Esta seguro de que desea bloquear los usuarios seleccionados?"
                    : "Are you sure you want to block the selected users?";
                confirmCallback = () => updateSelected("status", false);
                openModal(title, message, confirmCallback);
                break;

            case 1:
                title = language === "es" ? "Confirmar desbloqueo" : "Confirm unblock";
                message = language === "es" ? "¿Esta seguro de que desea desbloquear los usuarios seleccionados?"
                    : "Are you sure you want to unblock the selected users?";
                confirmCallback = () => updateSelected("status", true);
                openModal(title, message, confirmCallback);
                break;

            case 2:
                title = language === "es" ? "Confirmar eliminación" : "Confirm delete";
                message = language === "es" ? "¿Esta seguro de que desea eliminar los usuarios seleccionados?"
                    : "Are you sure you want to delete the selected users?";
                confirmCallback = deleteSelected;
                openModal(title, message, confirmCallback);
                break;

            case 3:
                title = language === "es" ? "Confirmar hacer admin" : "Confirm add to admins";
                message = language === "es" ? "¿Esta seguro de que desea hacer admin a los usuarios seleccionados?"
                    : "Are you sure you want to add to admins the selected users?";
                confirmCallback = () => updateSelected("is_admin", true);
                openModal(title, message, confirmCallback);
                break;

            case 4:
                title = language === "es" ? "Confirmar quitar admin" : "Confirm remove from admins";
                message = language === "es" ? "¿Esta seguro de que desea quitar el admin a los usuarios seleccionados?"
                    : "Are you sure you want to remove from admins the selected users?";
                confirmCallback = () => updateSelected("is_admin", false);
                openModal(title, message, confirmCallback);
                break;
        }
    }

    const openModal = async (title, message, confirmCallback) => {
        const isAuth = await checkAuth(true);
        if (isAuth) {
            setConfirmModalInfo({
                title,
                message,
                confirmCallback
            });
            setShowModal(true);
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
                        onClick={() => selectModalMode(0)} />
                    <IconButton
                        icon={<UnlockIcon />}
                        colorScheme="teal"
                        variant="ghost"
                        onClick={() => selectModalMode(1)} />
                    <IconButton
                        icon={<DeleteIcon />}
                        colorScheme="gray"
                        variant="ghost"
                        onClick={() => selectModalMode(2)} />
                    <Button colorScheme="green" onClick={() => selectModalMode(3)}>
                        {language === "es" ? "Hacer admin" : "Add to admins"}
                    </Button>
                    <Button colorScheme="green" variant={"outline"} onClick={() => selectModalMode(4)}>
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