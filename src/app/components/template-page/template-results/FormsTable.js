//React/Next imports
import { useRouter } from "next/navigation";

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
    Flex,
    IconButton,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

//Component imports
import FormsActions from "./FormsActions";

//Context imports
import { useUI } from "../../../context/UIContext";

const FormsTable = ({ forms, setForms }) => {
    const router = useRouter();
    const { language, greenColor, bg, setPageLoaded } = useUI();

    const sortForms = (type, order) => {
        let sortedForms = [...forms];
        switch (type) {

            case 0:
                sortedForms.sort((a, b) =>
                    order === "asc" ? a.fill_time - b.fill_time : b.fill_time - a.fill_time);
                setForms(sortedForms);
                break;

            case 1:
                sortedForms.sort((a, b) =>
                    order === "asc" ? a.user.name.localeCompare(b.user.name)
                        : b.user.name.localeCompare(a.user.name));
                setForms(sortedForms);
                break;

            case 2:
                sortedForms.sort((a, b) =>
                    order === "asc" ? a.user.email.localeCompare(b.user.email)
                        : b.user.email.localeCompare(a.user.email));
                setForms(sortedForms);
                break;

            default:
                sortedForms.sort((a, b) =>
                    order === "asc" ? a.fill_time - b.fill_time : b.fill_time - a.fill_time);
                setForms(sortedForms);
                break;
        }
    }

    const openFormPage = (id, submitterId) => {
        setPageLoaded(false);
        router.push(`/form-page/${id}?submitter=${submitterId}`);
    }

    return (
        <Box
            my={2}
            py={2}
            bg={bg}
            borderRadius="md"
            border="1px"
            borderColor={greenColor}>

            {<FormsActions
                sortForms={sortForms} />}

            <TableContainer>
                <Table variant="striped">
                    {forms.length > 0 &&
                        <TableCaption>{language === "es" ? "Formularios" : "Forms"}</TableCaption>}
                    {forms.length === 0 &&
                        <TableCaption>{language === "es" ? "No hay formularios aqui" : "No forms here"}</TableCaption>}
                    <Thead>
                        <Tr>
                            <Th>{language === "es" ? 'Indice' : 'Index'}</Th>
                            <Th>{language === "es" ? 'Ultima edicion' : 'Last edition date'}</Th>
                            <Th>{language === "es" ? 'Remitente' : 'Submitter'}</Th>
                            <Th>{language === "es" ? 'Correo' : 'Email'}</Th>
                            <Th>{language === "es" ? 'Acciones' : 'Actions'}</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {forms.map((form, index) => (
                            <Tr key={index}>
                                <Td>{index + 1}</Td>
                                <Td>{new Date(form.fill_time).toLocaleString()}</Td>
                                <Td>{form.user.name}</Td>
                                <Td>{form.user.email}</Td>
                                <Td>
                                    <Flex>
                                        <IconButton
                                            variant="ghost"
                                            icon={<ViewIcon />}
                                            colorScheme="green"
                                            onClick={() => openFormPage(form.template.id, form.user.id_user)} />
                                    </Flex>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default FormsTable;