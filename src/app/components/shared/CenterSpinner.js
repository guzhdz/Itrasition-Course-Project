//Chakra imports
import { Spinner, Flex } from "@chakra-ui/react";

const CenterSpinner = ({ size }) => {
    return (
        <Flex justify="center" w="100%">
            <Spinner size={size} m={3}/>
        </Flex>
    )
}

export default CenterSpinner;