//React/Next imports
import { useState } from "react";

//Chakra imports
import {
    IconButton,
    Flex
} from "@chakra-ui/react";

//Components imports
import TicketModal from "../help/TicketModal";

//Library imports
import { BiSolidHelpCircle } from "react-icons/bi";

const HelpButton = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Flex mt="auto" px={6} pb={4} justify="flex-end">
                <IconButton
                    colorScheme="green"
                    variant="outline"
                    icon={<BiSolidHelpCircle size={22} />}
                    onClick={() => setShowModal(true)} />
            </Flex>

            <TicketModal
                showModal={showModal}
                setShowModal={setShowModal} />
        </>
    );
};

export default HelpButton;