//React imports
import { useContext, useEffect, useState } from "react";

//Chakra imports
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Badge,
    Icon,
    Flex,
    Checkbox,
    Box,
    Skeleton,
} from "@chakra-ui/react";

//Components imports
import TableActions from "./TableActions";

//Services imports
import { getUsers, deleteUsers, updateUsers } from "../../services/userService";

//Library imports
import { FiCheckSquare, FiXSquare } from "react-icons/fi";

//Context imports
import { UIContext } from "../../context/UIContext";

const UsersTable = ({ usersRequest, callCheckAuth }) => {
    const { language, greenColor, redColor, openSimpleModal } = useContext(UIContext);
    const [users, setUsers] = useState([]);
    const [checkedUsers, setCheckedUsers] = useState([false]);
    const allChecked = checkedUsers.every(Boolean);
    const isIndeterminate = checkedUsers.some(Boolean) && !allChecked
    const [loading, setLoading] = useState(false);
    const skeletons = Array(8).fill(null);

    const loadUsers = async () => {
        setLoading(true);
        const isAuth = await callCheckAuth();
        if (isAuth) {
            const response = await getUsers(usersRequest);
            if (response.ok) {
                setUsers(response.data);
                setCheckedUsers(new Array(response.data.length).fill(false));
            } else {
                openSimpleModal(language === "es" ? "Error al cargar los usuarios" : "Error at loading users",
                    language === "es" ? response.message[language] : response.message.en);
            }
            setTimeout(() => setLoading(false), 500);
        }
    };

    const toogleCheckbox = (index) => {
        const newCheckedUsers = [...checkedUsers];
        newCheckedUsers[index] = !newCheckedUsers[index];
        setCheckedUsers(newCheckedUsers);
    };

    const toogleAllCheckboxes = () => {
        const newCheckedUsers = [...checkedUsers];
        newCheckedUsers.fill(!allChecked);
        setCheckedUsers(newCheckedUsers);
    }

    const uncheckAll = () => {
        const newCheckedUsers = [...checkedUsers];
        newCheckedUsers.fill(false);
        setCheckedUsers(newCheckedUsers);
    }

    const deleteSelectedUsers = async () => {
        uncheckAll();
        setLoading(true);
        const usersToDelete = users.filter((_, index) => checkedUsers[index]);
        const response = await deleteUsers(usersToDelete.map(user => user.id_user));
        if (response.ok) {
            await loadUsers();
        } else {
            openSimpleModal(language === "es" ? "Error al eliminar los usuarios" : "Error at deleting users",
                language === "es" ? response.message[language] : response.message.en);
        }
        setLoading(false);
    }

    const updateSelectedUsers = async (type, value) => {
        uncheckAll();
        setLoading(true);
        const usersToUpdate = users.filter((_, index) => checkedUsers[index]);
        const updatedUsers = usersToUpdate.map(user => ({ id_user: user.id_user, [type]: value }));
        const response = await updateUsers(updatedUsers);
        if (response.ok) {
            await loadUsers();
        } else {
            openSimpleModal(language === "es" ? "Error al actualizar los usuarios" : "Error at updating users",
                language === "es" ? response.message[language] : response.message.en);
        }
        setLoading(false);
    }
    
    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <Box my={2}>
            <TableActions
                isOpen={(allChecked && users.length > 0) || isIndeterminate}
                deleteSelected={deleteSelectedUsers}
                updateSelected={updateSelectedUsers}
                callCheckAuth={callCheckAuth} />
            <TableContainer>
                <Table variant='striped'>
                    {users.length > 0 && <TableCaption>{language === "es" ? "Usuarios" : "Users"}</TableCaption>}
                    {users.length === 0 && !loading && <TableCaption>{language === "es" ? "No hay usuarios aqui" : "No users here"}</TableCaption>}
                    <Thead>
                        <Tr>
                            <Th>
                                <Checkbox size="lg"
                                    isChecked={allChecked && users.length > 0}
                                    isIndeterminate={isIndeterminate}
                                    onChange={toogleAllCheckboxes}
                                    isDisabled={users.length === 0 || loading} />
                            </Th>
                            <Th>{language === "es" ? "Indice" : "Index"}</Th>
                            <Th>{language === "es" ? "Nombre" : "Name"}</Th>
                            <Th>{language === "es" ? "Correo" : "Email"}</Th>
                            <Th>{language === "es" ? "Estado" : "Status"}</Th>
                            <Th>{language === "es" ? "Es admin" : "Is admin"}</Th>
                            <Th>{language === "es" ? "Hora de registro" : "Register time"}</Th>
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
                            users.map((user, index) => (
                                <Tr key={index}>
                                    <Td>
                                        <Checkbox size="lg"
                                            isChecked={checkedUsers[index]}
                                            onChange={() => toogleCheckbox(index)} />
                                    </Td>
                                    <Td>{index + 1}</Td>
                                    <Td>{user.name}</Td>
                                    <Td>{user.email}</Td>
                                    <Td>
                                        <Badge colorScheme={user.status ? 'green' : 'red'}>
                                            {user.status ? language === "es" ? 'Activo' : 'Active'
                                                : language === "es" ? 'Bloqueado' : 'Blocked'}
                                        </Badge>
                                    </Td>
                                    <Td>
                                        <Flex align="center" gap={1}>
                                            <Icon
                                                as={user.is_admin ? FiCheckSquare : FiXSquare}
                                                color={user.is_admin ? greenColor : redColor} />
                                            {user.is_admin ? language === "es" ? 'Admin' : 'Admin' : language === "es" ? 'No admin' : 'Not admin'}
                                        </Flex>
                                    </Td>
                                    <Td>{new Date(user.register_time).toLocaleString()}</Td>
                                </Tr>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default UsersTable;