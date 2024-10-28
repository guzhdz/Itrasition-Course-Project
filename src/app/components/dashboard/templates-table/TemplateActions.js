//Chakra imports
import {
    Flex,
    Button,

} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

//Component imports
import SortMenu from "./SortMenu";

//Context imports
import { useUI } from "../../../context/UIContext";

const TemplateActions = ({ sortTemplates, loading, allChecked, templates, isIndeterminate, openDeleteModal, deleteSelectedTemplates, handleNewTemplate }) => {
    const { language } = useUI();

    return (
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
    )
}

export default TemplateActions;