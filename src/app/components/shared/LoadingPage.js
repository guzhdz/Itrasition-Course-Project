//React/Next imports
import { useContext } from "react";

//Chakra imports
import {
    Spinner,
    Flex
} from "@chakra-ui/react";

//Context imports
import { UIContext } from "../../context/UIContext";

export default function Main() {
    const { bg } = useContext(UIContext);

    return (
        <Flex
            w="100%"
            h="100vh"
            align="center"
            justify="center"
            direction="column"
            gap={5}
            bg={bg} >

            <Spinner size='xl' />
        </Flex>
    );
}
