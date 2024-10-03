//Chakra imports
import { Text, Icon, Box } from "@chakra-ui/react";

//Library imports
import { SiFormspree } from "react-icons/si";

const Logo = () => {
    return (
        <Box display="flex" alignItems="center">
            <Icon as={SiFormspree} color="green.300" mr={1} boxSize={6} />
            <Text fontSize="2xl" as="b" color="green.300">ItranForms</Text>
        </Box>
    )
}

export default Logo;