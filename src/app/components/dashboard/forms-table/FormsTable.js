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
    Skeleton
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

//Component imports
import FormActions from "./FormActions";
import ConfirmModal from "../../shared/ConfirmModal";

//Services imports
import { deleteForms } from "../../../services/formService";

//Context imports
import { useUI } from "../../../context/UIContext";
import { useAuth } from "../../../context/AuthContext";

const FormsTable = ({ goTo, checkAuth, loadForms }) => {
    const { language, openToast } = useUI();
    const { user } = useAuth();
    const [forms, setForms] = useState([]);
    const [checkedForms, setCheckedForms] = useState([false]);
    const allChecked = checkedForms.every(Boolean);
    const isIndeterminate = checkedForms.some(Boolean) && !allChecked;
    const [loading, setLoading] = useState(false);
    const skeletons = Array(8).fill(null);
    const [showModal, setShowModal] = useState(false);
    const [confirmModalInfo, setConfirmModalInfo] = useState({
        title: "",
        message: "",
        confirmCallback: () => { },
    });

    const callLoadForms = async () => {
        setLoading(true);
        const isAuth = await checkAuth();
        if (isAuth) {
            const response = await loadForms(user.id_user);
            setForms(response);
            setCheckedForms(new Array(response.length).fill(false));
            setTimeout(() => setLoading(false), 50);
        }
    };

    const toogleCheckbox = (index) => {
        const newCheckedForms = [...checkedForms];
        newCheckedForms[index] = !newCheckedForms[index];
        setCheckedForms(newCheckedForms);
    };

    const toogleAllCheckboxes = () => {
        const newCheckedForms = [...checkedForms];
        newCheckedForms.fill(!allChecked);
        setCheckedForms(newCheckedForms);
    }

    const uncheckAll = () => {
        const newCheckedForms = [...checkedForms];
        newCheckedForms.fill(false);
        setCheckedForms(newCheckedForms);
    }

    const deleteSelectedForms = async () => {
         uncheckAll();
         setLoading(true);
         const formsToDelete = forms.filter((_, index) => checkedForms[index]);
         const response = await deleteForms(formsToDelete.map(form => form.id));
         if (response.ok) {
             await callLoadForms();
             openToast(
                 null,
                 language === "es" ? 'Los formularios seleccionados han sido eliminados' : 'The selected forms have been deleted',
                 'success',
             );
         } else {
             openToast(
                 language === "es" ? "Error al eliminar los formularios" : "Error at deleting forms",
                 language === "es" ? response.message[language] : response.message.en,
                 "error"
             );
         }
         setLoading(false);
     }

    const deleteForm = async (id) => {
        uncheckAll();
        setLoading(true);
        const response = await deleteForms([id]);
        if (response.ok) {
            await callLoadForms();
            openToast(
                null,
                language === "es" ? 'El formulario ha sido eliminado' : 'The form has been deleted',
                'success',
            );
        } else {
            openToast(
                language === "es" ? "Error al eliminar el formulario" : "Error at deleting form",
                language === "es" ? response.message[language] : response.message.en,
                "error"
            );
        }
        setLoading(false);
    }

    const openDeleteModal = async (title, message, confirmCallback) => {
        const isAuth = await checkAuth();
        if (isAuth) {
            setConfirmModalInfo({
                title,
                message,
                confirmCallback
            });
            setShowModal(true);
        }
    }

    const sortForms = (type, order) => {
        let sortedForms = [...forms];
        setLoading(true);
        switch (type) {
            case 0:
                sortedForms.sort((a, b) =>
                    order === "asc" ? a.template.title.localeCompare(b.template.title)
                        : b.template.title.localeCompare(a.template.title));
                setForms(sortedForms);
                break;

            case 1:
                sortedForms.sort((a, b) =>
                    order === "asc" ? a.fill_time - b.fill_time : b.fill_time - a.fill_time);
                setForms(sortedForms);
                break;

            case 2:
                sortedForms.sort((a, b) =>
                    order === "asc" ? a.template.topic.name.localeCompare(b.template.topic.name)
                        : b.template.topic.name.localeCompare(a.template.topic.name));
                setForms(sortedForms);
                break;

            case 3:
                sortedForms.sort((a, b) =>
                    order === "asc" ? a.template.user.name.localeCompare(b.template.user.name)
                        : b.template.user.name.localeCompare(a.template.user.name));
                setForms(sortedForms);
                break;

            default:
                sortedForms.sort((a, b) =>
                    order === "asc" ? a.template.title.localeCompare(b.template.title)
                        : b.template.title.localeCompare(a.template.title));
                setForms(sortedForms);
                break;
        }
        setTimeout(() => setLoading(false), 50);
    }

    const openFormPage = (id) => {
        goTo(`/form-page/${id}`);
    }

    useEffect(() => {
        callLoadForms();
    }, []);

    return (
        <>
            <Box my={2}>
                <FormActions
                    sortForms={sortForms}
                    loading={loading}
                    allChecked={allChecked}
                    forms={forms}
                    isIndeterminate={isIndeterminate}
                    openDeleteModal={openDeleteModal}
                    deleteSelectedForms={deleteSelectedForms}
                    goTo={goTo} />

                <TableContainer>
                    <Table variant="striped">
                        {forms.length > 0 &&
                            <TableCaption>{language === "es" ? "Formularios" : "Forms"}</TableCaption>}
                        {forms.length === 0 && !loading &&
                            <TableCaption>{language === "es" ? "No hay formularios aqui" : "No forms here"}</TableCaption>}
                        <Thead>
                            <Tr>
                                <Th>
                                    <Checkbox size="lg"
                                        isChecked={allChecked && forms.length > 0}
                                        isIndeterminate={isIndeterminate}
                                        onChange={toogleAllCheckboxes}
                                        isDisabled={forms.length === 0 || loading} />
                                </Th>
                                <Th>{language === "es" ? 'Indice' : 'Index'}</Th>
                                <Th>{language === "es" ? 'Titulo' : 'Title'}</Th>
                                <Th>{language === "es" ? 'Ultima edicion' : 'Last edition date'}</Th>
                                <Th>{language === "es" ? 'Tema' : 'Topic'}</Th>
                                <Th>{language === "es" ? 'Autor' : 'Author'}</Th>
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
                                forms.map((form, index) => (
                                    <Tr key={index}>
                                        <Td>
                                            <Checkbox size="lg"
                                                isChecked={checkedForms[index]}
                                                onChange={() => toogleCheckbox(index)} />
                                        </Td>
                                        <Td>{index + 1}</Td>
                                        <Td>{form.template.title}</Td>
                                        <Td>{new Date(form.fill_time).toLocaleString()}</Td>
                                        <Td>{form.template.topic.name}</Td>
                                        <Td>{form.template.user.name}</Td>
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
                                                        () => deleteForm(form.id))} />
                                                <IconButton
                                                    variant="ghost"
                                                    icon={<EditIcon />}
                                                    colorScheme="blue"
                                                    onClick={() => openFormPage(form.template.id)} />
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

export default FormsTable;