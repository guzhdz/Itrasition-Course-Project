//React imports
import { useContext } from "react";

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
import { UIContext } from "../../context/UIContext";


const ConfirmModal = ({closeOnOverlay = true, showModal, setShowModal, title, message, confirmCallback}) => {
    const { language } = useContext(UIContext);

    const handleOk = () => {
        confirmCallback();
        setShowModal(false);
    }

    return (
        <Modal closeOnOverlayClick={closeOnOverlay} isOpen={showModal} isCentered onClose={() => setShowModal(false)}>
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