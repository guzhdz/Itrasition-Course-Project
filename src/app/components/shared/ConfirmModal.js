//Chakra imports
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from "@chakra-ui/react";

//Context imports
import { useUI } from "../../context/UIContext";


const ConfirmModal = ({ closeOnOverlay = true, showModal, setShowModal, title, message, confirmCallback }) => {
    const { language } = useUI();

    const handleOk = () => {
        confirmCallback();
        setShowModal(false);
    }

    return (
        <Modal
            closeOnOverlayClick={closeOnOverlay}
            isOpen={showModal}
            isCentered
            returnFocusOnClose={false}
            onClose={() => setShowModal(false)} size={{ base: "xs", md: "sm" }}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                    {message}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={() => setShowModal(false)}>{language === "es" ? "Cancelar" : "Cancel"}</Button>
                    <Button onClick={handleOk} colorScheme="green">OK</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ConfirmModal;