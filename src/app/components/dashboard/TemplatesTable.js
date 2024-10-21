//React/Next imports
import { useState, useEffect } from "react";

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
    Button,
    Skeleton
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";

//Component imports
import SortMenu from "./SortMenu";
import ConfirmModal from "../shared/ConfirmModal";

//Services imports
import { insertDraftTemplate } from "../../services/templateService";
import { getTopics } from "../../services/topicService";
import { deleteTemplates } from "../../services/templateService";

//Context imports
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";

const TemplatesTable = ({ goTo, checkAuth, loadTemplates }) => {
    const { language, openToast, setPageLoaded } = useUI();
    const { user } = useAuth();
    const [templates, setTemplates] = useState([]);
    const [checkedTemplates, setCheckedTemplates] = useState([false]);
    const allChecked = checkedTemplates.every(Boolean);
    const isIndeterminate = checkedTemplates.some(Boolean) && !allChecked;
    const [loading, setLoading] = useState(false);
    const skeletons = Array(8).fill(null);
    const [showModal, setShowModal] = useState(false);
    const [confirmModalInfo, setConfirmModalInfo] = useState({
        title: "",
        message: "",
        confirmCallback: () => { },
    });

    const callLoadTemplates = async () => {
        setLoading(true);
        const response = await loadTemplates(user.id_user);
        setTemplates(response);
        setCheckedTemplates(new Array(response.length).fill(false));
        setTimeout (() => setLoading(false), 300);
    };

    const getStateColor = (state) => {
        if (state === "draft") {
            return "yellow";
        } else if (state === "public") {
            return "green";
        } else {
            return "blue";
        }
    }

    const getStateText = (state) => {
        if (state === "draft") {
            return language === "es" ? "Borrador" : "Draft";
        } else if (state === "public") {
            return language === "es" ? "Público" : "Public";
        } else {
            return language === "es" ? "Restringido" : "Restricted";
        }
    }

    const handleNewTemplate = async () => {
        const isAuth = await checkAuth();
        if (isAuth) {
            const response = await createNewTemplate();
            if (response) {
                openTemplatePage(response);
            }
        }
    }

    const createNewTemplate = async () => {
        setLoading(true);
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
                openToast(
                    language === "es" ? "Error" : "Error",
                    language === "es" ? response.message[language] : response.message.en,
                    "error"
                );
            }
        }
        setLoading(false);
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
            openToast("Error", messageError, "error");
            return [];
        }
    }

    const toogleCheckbox = (index) => {
        const newCheckedTemplates = [...checkedTemplates];
        newCheckedTemplates[index] = !newCheckedTemplates[index];
        setCheckedTemplates(newCheckedTemplates);
    };

    const toogleAllCheckboxes = () => {
        const newCheckedTemplates = [...checkedTemplates];
        newCheckedTemplates.fill(!allChecked);
        setCheckedTemplates(newCheckedTemplates);
    }

    const uncheckAll = () => {
        const newCheckedTemplates = [...checkedTemplates];
        newCheckedTemplates.fill(false);
        setCheckedTemplates(newCheckedTemplates);
    }

    const deleteSelectedTemplates = async () => {
        uncheckAll();
        setLoading(true);
        const templatesToDelete = templates.filter((_, index) => checkedTemplates[index]);
        const response = await deleteTemplates(templatesToDelete.map(template => template.id));
        if (response.ok) {
            await callLoadTemplates();
            openToast(
                null,
                language === "es" ? 'Las plantillas seleccionados han sido eliminadas' : 'The selected templates have been deleted',
                'success',
            );
        } else {
            openToast(
                language === "es" ? "Error al eliminar las plantillas" : "Error at deleting templates",
                language === "es" ? response.message[language] : response.message.en,
                "error"
            );
        }
        setLoading(false);
    }

    const deleteTemplate = async (id) => {
        uncheckAll();
        setLoading(true);
        const response = await deleteTemplates([id]);
        if (response.ok) {
            await callLoadTemplates();
            openToast(
                null,
                language === "es" ? 'Las plantilla ha sido eliminada' : 'The template has been deleted',
                'success',
            );
        } else {
            openToast(
                language === "es" ? "Error al eliminar la plantilla" : "Error at deleting template",
                language === "es" ? response.message[language] : response.message.en,
                "error"
            );
        }
        setLoading(false);
    }

    const openDeleteModal = (title, message, confirmCallback) => {
        setConfirmModalInfo({
            title,
            message,
            confirmCallback
        });
        setShowModal(true);
    }

    const sortTemplates = (type, order) => {
        let sortedTemplates = [...templates];
        setLoading(true);
        switch (type) {
            case 0:
                sortedTemplates.sort((a, b) =>
                    order === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title));
                setTemplates(sortedTemplates);
                break;

            case 1:
                sortedTemplates.sort((a, b) =>
                    order === "asc" ? a.creation_time - b.creation_time : b.creation_time - a.creation_time);
                setTemplates(sortedTemplates);
                break;

            case 2:
                sortedTemplates.sort((a, b) =>
                    order === "asc" ? a.topic.name.localeCompare(b.title) : b.topic.name.localeCompare(a.title));
                setTemplates(sortedTemplates);
                break;
        }
        setTimeout(() => setLoading(false), 300);
    }

    const openTemplatePage = (id) => {
        goTo(`/template-page/${id}`);
    }

    useEffect(() => {
        callLoadTemplates();
    }, []);

    return (
        <>
            <Box my={2}>
                <Flex mb={4} gap={2}>
                    <Button
                        rightIcon={<AddIcon />}
                        colorScheme="green"
                        onClick={handleNewTemplate}
                        isLoading={loading}>
                        {language === "es" ? 'Nueva' : 'New'}
                    </Button>

                    <SortMenu sortTemplates={sortTemplates} />

                    <Button
                        ml="auto"
                        disabled={!((allChecked && templates.length > 0) || isIndeterminate)}
                        colorScheme="red"
                        onClick={() => openDeleteModal(
                            language === "es" ? "Eliminar plantillas" : "Delete templates",
                            language === "es" ? "¿Seguro que quieres eliminar las plantillas seleccionadas?"
                                : "Are you sure you want to delete the selected templates?",
                            deleteSelectedTemplates)} >
                        {language === "es" ? 'Eliminar' : 'Delete'}
                    </Button>
                </Flex>

                <TableContainer>
                    <Table variant="striped">
                        {templates.length > 0 &&
                            <TableCaption>{language === "es" ? "Plantillas" : "Templates"}</TableCaption>}
                        {templates.length === 0 && !loading &&
                            <TableCaption>{language === "es" ? "No hay plantillas aqui" : "No templates here"}</TableCaption>}
                        <Thead>
                            <Tr>
                                <Th>
                                    <Checkbox size="lg"
                                        isChecked={allChecked && templates.length > 0}
                                        isIndeterminate={isIndeterminate}
                                        onChange={toogleAllCheckboxes}
                                        isDisabled={templates.length === 0 || loading} />
                                </Th>
                                <Th>{language === "es" ? 'Indice' : 'Index'}</Th>
                                <Th>{language === "es" ? 'Titulo' : 'Title'}</Th>
                                <Th>{language === "es" ? 'Estado' : 'State'}</Th>
                                <Th>{language === "es" ? 'Fecha de creación' : 'Creation date'}</Th>
                                <Th>{language === "es" ? 'Tema' : 'Topic'}</Th>
                                <Th>{language === "es" ? 'Acciones' : 'Actions'}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {loading ?
                                skeletons.map((_, index) => (
                                    <Tr key={index}>
                                        <Td colSpan={7}>
                                            <Skeleton isLoaded={!loading} height="20px" />
                                        </Td>
                                    </Tr>
                                ))
                                :
                                templates.map((template, index) => (
                                    <Tr key={index}>
                                        <Td>
                                            <Checkbox size="lg"
                                                isChecked={checkedTemplates[index]}
                                                onChange={() => toogleCheckbox(index)} />
                                        </Td>
                                        <Td>{index + 1}</Td>
                                        <Td>{template.title}</Td>
                                        <Td>
                                            <Badge colorScheme={getStateColor(template.state)}>
                                                {getStateText(template.state)}
                                            </Badge>
                                        </Td>
                                        <Td>{new Date(template.creation_time).toLocaleString()}</Td>
                                        <Td>{template.topic.name}</Td>
                                        <Td>
                                            <Flex>
                                                <IconButton
                                                    variant="ghost"
                                                    icon={<DeleteIcon />}
                                                    colorScheme="red"
                                                    onClick={() => openDeleteModal(
                                                        language === "es" ? "Eliminar plantilla" : "Delete template",
                                                        language === "es" ? "¿Seguro que quieres eliminar la plantilla?"
                                                            : "Are you sure you want to delete the template?",
                                                        () => deleteTemplate(template.id))} />
                                                <IconButton
                                                    variant="ghost"
                                                    icon={<EditIcon />}
                                                    colorScheme="blue"
                                                    onClick={() => openTemplatePage(template.id)} />
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <ConfirmModal
                closeOnOverlay={false}
                showModal={showModal}
                setShowModal={setShowModal}
                {...confirmModalInfo} />
        </>
    )
}

export default TemplatesTable;