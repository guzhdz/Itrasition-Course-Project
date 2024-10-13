//Chakra imports
import {
    Table,
    TableContainer,
    TableCaption,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Checkbox,
    Badge,
    Flex,
    IconButton,
    Button
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";

//Component imports
import SortMenu from "./SortMenu";

//Context imports
import { useUI } from "../../context/UIContext";

const TemplatesTable = () => {
    const { language } = useUI();

    return (
        <Box my={2}>
            <Flex mb={4} gap={2}>
                <Button
                    rightIcon={<AddIcon />}
                    colorScheme="green">
                    {language === "es" ? 'Nueva' : 'New'}
                </Button>

                <SortMenu />
            </Flex>

            <TableContainer>
                <Table variant="striped">
                    <TableCaption>{language === "es" ? "Plantillas" : "Templates"}</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>
                                <Checkbox size="lg" />
                            </Th>
                            <Th>{language === "es" ? 'Indice' : 'Index'}</Th>
                            <Th>{language === "es" ? 'Titulo' : 'Title'}</Th>
                            <Th>{language === "es" ? 'Visibilidad' : 'Visibility'}</Th>
                            <Th>{language === "es" ? 'Tema' : 'Topic'}</Th>
                            <Th>{language === "es" ? 'Acciones' : 'Actions'}</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td>
                                <Checkbox size="lg" />
                            </Td>
                            <Td>1</Td>
                            <Td>Titulo template</Td>
                            <Td>
                                <Badge colorScheme={true ? 'blue' : 'yellow'}>
                                    {true ? language === "es" ? 'Publico' : 'Public'
                                        : language === "es" ? 'Restringido' : 'Restricted'}
                                </Badge>
                            </Td>
                            <Td>Education</Td>
                            <Td>
                                <Flex>
                                    <IconButton
                                        variant="ghost"
                                        icon={<DeleteIcon />}
                                        colorScheme="red" />
                                    <IconButton
                                        variant="ghost"
                                        icon={<EditIcon />}
                                        colorScheme="blue" />
                                </Flex>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>
                                <Checkbox size="lg" />
                            </Td>
                            <Td>2</Td>
                            <Td>Titulo template</Td>
                            <Td>
                                <Badge colorScheme={false ? 'blue' : 'yellow'}>
                                    {false ? language === "es" ? 'Publico' : 'Public'
                                        : language === "es" ? 'Restringido' : 'Restricted'}
                                </Badge>
                            </Td>
                            <Td>Quiz</Td>
                            <Td>
                                <Flex>
                                    <IconButton
                                        variant="ghost"
                                        icon={<DeleteIcon />}
                                        colorScheme="red" />
                                    <IconButton
                                        variant="ghost"
                                        icon={<EditIcon />}
                                        colorScheme="blue" />
                                </Flex>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default TemplatesTable;