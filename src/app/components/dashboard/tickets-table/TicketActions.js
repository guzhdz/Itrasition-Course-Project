//Chakra imports
import {
    Flex,
} from "@chakra-ui/react";

//Component imports
import SortMenu from "./SortMenu";

const TickeActions = ({ sortTickets }) => {

    return (
        <Flex mb={4} gap={2}>
            <SortMenu sortTickets={sortTickets} />
        </Flex>
    )
}

export default TickeActions;