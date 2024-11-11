//Chakra imports
import {
    Flex,
} from "@chakra-ui/react";

//Component imports
import SortMenu from "./SortMenu";

const FormActions = ({ sortForms }) => {

    return (
        <Flex mb={4} gap={2} px={4}>
            <SortMenu sortForms={sortForms} />
        </Flex>
    )
}

export default FormActions;