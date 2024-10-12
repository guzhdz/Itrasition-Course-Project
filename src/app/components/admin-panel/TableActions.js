//React/Next imports
import { useState } from "react";

//Chakra imports
import {
    Collapse,
    Flex,
    Button,
    IconButton
} from "@chakra-ui/react";
import { LockIcon, UnlockIcon, DeleteIcon } from "@chakra-ui/icons";

//Component imports
import ConfirmModal from "../shared/ConfirmModal";

//Context imports
import { useUI } from "../../context/UIContext";

const TableActions = ({ isOpen, deleteSelected, updateSelected, checkAuth }) => {
    const { language } = useUI();
    const [showModal, setShowModal] = useState(false);
    const [confirmModalInfo, setConfirmModalInfo] = useState({
        title: "",
        message: "",
        confirmCallback: () => { },
    });

    const selectModalMode = (mode) => {
        let action = {}; 
        let questionAction = {};
        switch (mode) {
            case 0:
                action = {es: "bloquear", en: "block"};
                questionAction = {es: "bloquear", en: "block"};
                openConfirmModal(action, questionAction, () => updateSelected("status", false));
                break;

            case 1:
                action = {es: "desbloquear", en: "unblock"};
                questionAction = {es: "desbloquear", en: "unblock"};
                openConfirmModal(action, questionAction, () => updateSelected("status", true));
                break;

            case 2:
                action = {es: "eliminación", en: "delete"};
                questionAction = {es: "eliminar", en: "delete"};
                openConfirmModal(action, questionAction, deleteSelected);
                break;

            case 3:
                action = {es: "hacer admin", en: "add to admins"};
                questionAction = {es: "hacer admin a", en: "add to admins"};
                openConfirmModal(action, questionAction, () => updateSelected("is_admin", true));
                break;

            case 4:
                action = {es: "quitar admin", en: "remove from admins"};
                questionAction = {es: "quitar el admin a", en: "remove from admins"};
                openConfirmModal(action, questionAction, () => updateSelected("is_admin", false));
                break;
        }
    }

    const openConfirmModal = (action, questionAction, confirmCallback) => {
        const title = language === "es" ? `Confirmar ${action.es}` : `Confirm ${action.en}`;
        const message = language === "es" ? `¿Esta seguro de que desea ${questionAction.es}los usuarios seleccionados?`
            : `Are you sure you want to ${questionAction.en} the selected users?`;
        openModal(title, message, confirmCallback);
    }

    const openModal = async (title, message, confirmCallback) => {
        const isAuth = await checkAuth();
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