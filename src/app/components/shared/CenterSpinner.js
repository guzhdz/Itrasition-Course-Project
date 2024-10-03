//Chakra imports
import { Spinner, Box } from "@chakra-ui/react";

const CenterSpinner = ({ size }) => {
    return (
        <Box display="flex" justifyContent="center" w="100%">
            <Spinner size={size} m={3}/>
        </Box>
    )
}

export default CenterSpinner;