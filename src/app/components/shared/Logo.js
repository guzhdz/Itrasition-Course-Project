//Chakra imports
import { Text, Icon, Flex } from "@chakra-ui/react";

//Library imports
import { SiFormspree } from "react-icons/si";

//Context imports
import { useUI } from "../../context/UIContext";

const Logo = () => {
    const { greenColor } = useUI();

    return (
        <Flex align="center">
            <Icon as={SiFormspree} color={greenColor} mr={1} boxSize={6} />
            <Text fontSize="2xl" as="b" color={greenColor}>ItranForms</Text>
        </Flex>
    )
}

export default Logo;