//Chakra imports
import {
    Card,
    CardBody,
    Flex,
    Avatar,
    Text,
    Box,
    Divider
} from "@chakra-ui/react";
import { PlusSquareIcon, CopyIcon } from "@chakra-ui/icons";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";

const UserBanner = ({templatesNumber}) => {
    const { greenColor, textGreenScheme, language } = useUI();
    const { user } = useAuth();

    return (
        <Card w="60%" mx="auto" minW="300px" mb={10}>
            <CardBody display="flex" alignItems="center" justifyContent="space-evenly">
                <Flex gap={4} p={2} alignItems="center">
                    <Avatar name={user.name} bg={greenColor} color={textGreenScheme} size="lg" />
                    <Box>
                        <Text fontSize="2xl">{user.name}</Text>
                        <Text fontSize="md">{user.email}</Text>
                    </Box>
                </Flex>

                <Box height="80px">
                    <Divider orientation="vertical" />
                </Box>

                <Flex justify="space-between" gap={8}>
                    <Flex direction="column" alignItems="center">
                        <Text fontSize="lg" display="flex" alignItems="center" gap={2}>
                            <PlusSquareIcon color={greenColor} />
                            {templatesNumber}
                        </Text>
                        <Text fontSize="lg">
                            {language === "es" ? "Plantillas creadas" : "Templates created"}
                        </Text>
                    </Flex>

                    <Flex direction="column" alignItems="center">
                        <Text fontSize="lg" display="flex" alignItems="center" gap={2}>
                            <CopyIcon color={greenColor} />
                            0
                        </Text>
                        <Text fontSize="lg">
                            {language === "es" ? "Formularios llenos" : "Forms filled"}
                        </Text>
                    </Flex>
                </Flex>
            </CardBody>
        </Card>
    )
}

export default UserBanner;