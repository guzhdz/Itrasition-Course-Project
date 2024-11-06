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
    Badge,
    Flex,
    IconButton,
    Skeleton
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

//Component imports
import TicketActions from "./TicketActions";

//Context imports
import { useUI } from "../../../context/UIContext";

const TicketsTable = ({ checkAuth, loadTickets }) => {
    const { language } = useUI();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const skeletons = Array(8).fill(null);
    const jiraHost = process.env.NEXT_PUBLIC_JIRA_HOST;

    const callLoadTickets = async () => {
        setLoading(true);
        const isAuth = await checkAuth();
        if (isAuth) {
            const response = await loadTickets();
            setTickets(response);
            setTimeout(() => setLoading(false), 50);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "10003":
                return "yellow";

            case "3":
                return "blue";

            case "10004":
                return "teal";

            case "10005":
                return "green";

            default:
                return "yellow";
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "10003":
                return language === "es" ? "Tareas por hacer" : "To do";

            case "3":
                return language === "es" ? "En curso" : "In progress";

            case "10004":
                return language === "es" ? "En revisión" : "In review";

            case "10005":
                return language === "es" ? "Finalizado" : "Done";

            default:
                return language === "es" ? "Tareas por hacer" : "To do";
        }
    }

    const getPriorityText = (priority) => {
        switch (priority) {
            case "1":
                return language === "es" ? "Muy alta" : "Highest";

            case "2":
                return language === "es" ? "Alta" : "High";

            case "3":
                return language === "es" ? "Media" : "Medium";

            case "4":
                return language === "es" ? "Baja" : "Low";

            case "5":
                return language === "es" ? "Muy baja" : "Lowest";
        }
    }

    const sortTickets = (type, order) => {
        let sortedTickets = [...tickets];
        setLoading(true);
        switch (type) {
            case 0:
                sortedTickets.sort((a, b) =>
                    order === "asc" ? a.fields.summary.localeCompare(b.fields.summary) : b.fields.summary.localeCompare(a.fields.summary));
                setTickets(sortedTickets);
                break;

            case 1:
                sortedTickets.sort((a, b) =>
                    order === "asc" ? a.fields.created.localeCompare(b.fields.created) : b.fields.created.localeCompare(a.fields.created));
                setTickets(sortedTickets);
                break;

            case 2:
                sortedTickets.sort((a, b) =>
                    order === "asc" ? parseInt(a.fields.priority.id) - parseInt(b.fields.priority.id)
                        : parseInt(b.fields.priority.id) - parseInt(a.fields.priority.id));
                setTickets(sortedTickets);
                break;

            default:
                sortedTickets.sort((a, b) =>
                    order === "asc" ? a.fields.summary.localeCompare(b.fields.summary) : b.fields.summary.localeCompare(a.fields.summary));
                setTickets(sortedTickets);
                break;
        }
        setTimeout(() => setLoading(false), 50);
    }

    useEffect(() => {
        callLoadTickets();
    }, []);

    return (
        <>
            <Box my={2}>
                <TicketActions
                    sortTickets={sortTickets} />

                <TableContainer>
                    <Table variant="striped">
                        {tickets.length > 0 &&
                            <TableCaption>{language === "es" ? "Tickets" : "Tickets"}</TableCaption>}
                        {tickets.length === 0 && !loading &&
                            <TableCaption>{language === "es" ? "No hay tickets aqui" : "No tickets here"}</TableCaption>}
                        <Thead>
                            <Tr>
                                <Th>{language === "es" ? 'Indice' : 'Index'}</Th>
                                <Th>{language === "es" ? 'Resumen' : 'Summary'}</Th>
                                <Th>{language === "es" ? 'Estado' : 'Status'}</Th>
                                <Th>{language === "es" ? 'Prioridad' : 'Priority'}</Th>
                                <Th>{language === "es" ? 'Fecha de creación' : 'Creation time'}</Th>
                                <Th>{language === "es" ? 'Acciones' : 'Actions'}</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {loading ?
                                skeletons.map((_, index) => (
                                    <Tr key={index}>
                                        <Td colSpan={6}>
                                            <Skeleton isLoaded={!loading} height="20px" />
                                        </Td>
                                    </Tr>
                                ))
                                :
                                tickets.map((ticket, index) => (
                                    <Tr key={index}>
                                        <Td>{index + 1}</Td>
                                        <Td>{ticket.fields.summary}</Td>
                                        <Td>
                                            <Badge colorScheme={getStatusColor(ticket.fields.status.id)}>
                                                {getStatusText(ticket.fields.status.id)}
                                            </Badge>
                                        </Td>
                                        <Td>{getPriorityText(ticket.fields.priority.id)}</Td>
                                        <Td>{new Date(ticket.fields.created).toLocaleString()}</Td>
                                        <Td>
                                            <Flex>
                                                <IconButton
                                                    variant="ghost"
                                                    icon={<ExternalLinkIcon />}
                                                    colorScheme="green"
                                                    onClick={() => window.open(`https://${jiraHost}/browse/${ticket.key}`, '_blank')} />
                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default TicketsTable;