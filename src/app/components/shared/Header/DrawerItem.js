//React imports
import { useContext } from "react";

//Chakra imports
import {
    Flex,
    Text,
    Icon,
} from "@chakra-ui/react";


//Context imports
import { UIContext } from "../../../context/UIContext";

const DrawerComponent = ({ action, icon, text }) => {
    const { greenColor } = useContext(UIContext);

    return (
        <Flex 
        align="center"
        w="100%"
        px={4}
        py={2} 
        onClick={action} 
        _hover={{ cursor: 'pointer', color: greenColor }}>
            <Icon as={icon} mr={2} />
            <Text fontSize="lg">{text}</Text>
        </Flex>
    )
}

export default DrawerComponent;