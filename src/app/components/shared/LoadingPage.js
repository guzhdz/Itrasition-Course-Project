//Chakra imports
import {
    Spinner,
    Flex
} from "@chakra-ui/react";

//Context imports
import { useUI } from "../../context/UIContext";

export default function Main() {
    const { bg } = useUI();

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
