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


const SimpleModal = ({closeOnOverlay = true, showModal, setShowModal, title, message}) => {

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
                    <Button onClick={() => setShowModal(false)} colorScheme="green">OK</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SimpleModal;