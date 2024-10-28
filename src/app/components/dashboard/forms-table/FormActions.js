//Chakra imports
import {
    Flex,
    Button,

} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

//Component imports
import SortMenu from "./SortMenu";

//Context imports
import { useUI } from "../../../context/UIContext";

const FormActions = ({ sortForms, loading, allChecked, forms, isIndeterminate, openDeleteModal, deleteSelectedForms, goTo}) => {
    const { language } = useUI();

    return (
        <Flex mb={4} gap={2}>
            <Button
                rightIcon={<ArrowForwardIcon />}
                colorScheme="green"
                isLoading={loading}
                onClick={() => goTo("/main")}>
                {language === "es" ? 'Más' : 'More'}
            </Button>

            <SortMenu sortForms={sortForms} />

            <Button
                ml="auto"
                disabled={!((allChecked && forms.length > 0) || isIndeterminate)}
                colorScheme="red"
                onClick={() => openDeleteModal(
                    language === "es" ? "Eliminar formularios" : "Delete forms",
                    language === "es" ? "¿Seguro que quieres eliminar los formularios seleccionados?"
                        : "Are you sure you want to delete the selected forms?",
                    deleteSelectedForms)} >
                {language === "es" ? 'Eliminar' : 'Delete'}
            </Button>
        </Flex>
    )
}

export default FormActions;