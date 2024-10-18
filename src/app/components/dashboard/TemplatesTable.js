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

//Services imports
import { insertDraftTemplate } from "../../services/templateService";
import { getTopics } from "../../services/topicService";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";

const TemplatesTable = ({ goTo }) => {
    const { language, openSimpleModal } = useUI();
    const { user } = useAuth();
    const handleNewTemplate = async () => {
        const response = await createNewTemplate();
        if (response) {
            openTemplatePage(response.id);
            goTo("/template-page");
        }
    }

    const openTemplatePage = (id) => {
        goTo(`/template-page/${id}`);
    }

    const createNewTemplate = async () => {
        const topics = await getTopicsList();
        if (topics.length !== 0) {
            const title = language === "es" ? "Plantilla sin título" : "Untitle template";
            const description = language === "es" ? "Esta es una descripción por defecto. Rellena con información (soporta markdown)."
                : "This is a default description. Fill in with information (supports markdown).";
            const topic_id = topics[0].id;
            const user_id = user.id_user;
            const response = await insertDraftTemplate(title, description, topic_id, user_id);
            if (response.ok) {
                return response.data;
            } else {
                openSimpleModal(
                    "Error",
                    language === "es" ? response.message[language] : response.message.en
                )
                return null;
            }
        }
    };

    const getTopicsList = async () => {
        const response = await getTopics("getTopics");
        if (response.ok && response.data.length > 0) {
            return response.data;
        } else {
            let messageError = language === "es" ? "Algo salio mal. Por favor, intenta de nuevo."
                : "Something went wrong. Please try again later.";
            if (response.message) {
                messageError = language === "es" ? response.message[language] : response.message.en;
            }
            openSimpleModal(
                "Error",
                messageError
            );
            return [];
        }
    }

    const testTemplatePage = () => {
        openTemplatePage(20n);
    }

    return (
        <Box my={2}>
            <Flex mb={4} gap={2}>
                <Button
                    rightIcon={<AddIcon />}
                    colorScheme="green"
                    onClick={handleNewTemplate}>
                    {language === "es" ? 'Nueva' : 'New'}
                </Button>

                <Button
                    rightIcon={<AddIcon />}
                    colorScheme="green"
                    onClick={testTemplatePage}>
                    {language === "es" ? 'Prueba' : 'Test'}
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
                            <Th>{language === "es" ? 'Estado' : 'State'}</Th>
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