//React imports
import { useContext } from "react";

//Chakra imports
import { Text, Icon, Flex } from "@chakra-ui/react";

//Library imports
import { SiFormspree } from "react-icons/si";

//Context imports
import { UIContext } from "../../context/UIContext";

const Logo = () => {
    const { greenColor } = useContext(UIContext);
    return (
        <Flex align="center">
            <Icon as={SiFormspree} color={greenColor} mr={1} boxSize={6} />
            <Text fontSize="2xl" as="b" color={greenColor}>ItranForms</Text>
        </Flex>
    )
}

export default Logo;