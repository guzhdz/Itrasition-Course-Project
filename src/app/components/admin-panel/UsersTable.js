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
} from "@chakra-ui/react";

//Components imports
import SimpleModal from "../shared/SimpleModal";
import TableActions from "./TableActions";

//Services imports
import { getUsers, deleteUsers, updateUsers } from "../../services/userService";

//Library imports
import { FiCheckSquare, FiXSquare } from "react-icons/fi";

//Context imports
import { UIContext } from "../../context/UIContext";

const UsersTable = ({ usersRequest }) => {
    const { language, greenColor, redColor } = useContext(UIContext);
    const [users, setUsers] = useState([]);
    const [checkedUsers, setCheckedUsers] = useState([false]);
    const allChecked = checkedUsers.every(Boolean);
    const isIndeterminate = checkedUsers.some(Boolean) && !allChecked
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        title: "",
        message: "",
    });

    const loadUsers = async () => {
        const response = await getUsers(usersRequest);
        if (response.ok) {
            setUsers(response.data);
            setCheckedUsers(new Array(response.data.length).fill(false));
        } else {
            openModal(language === "es" ? "Error al cargar los usuarios" : "Error at loading users",
                language === "es" ? response.message[language] : response.message.en);
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

    const deleteSelectedUsers = async () => {
        const usersToDelete = users.filter((_, index) => checkedUsers[index]);
        const response = await deleteUsers(usersToDelete.map(user => user.id_user));
        if (response.ok) {
            loadUsers();
        } else {
            openModal(language === "es" ? "Error al eliminar los usuarios" : "Error at deleting users",
                language === "es" ? response.message[language] : response.message.en);
        }
    }

    const updateSelectedUsers = async (type, value) => {
        const usersToUpdate = users.filter((_, index) => checkedUsers[index]);
        const updatedUsers = usersToUpdate.map(user => ({ id_user: user.id_user, [type]: value }));
        const response = await updateUsers(updatedUsers);
        if (response.ok) {
            loadUsers();
        } else {
            openModal(language === "es" ? "Error al actualizar los usuarios" : "Error at updating users",
                language === "es" ? response.message[language] : response.message.en);
        }
    }

    const openModal = (title, message) => {
        setModalData({ title, message });
        setShowModal(true);
    }

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <Box my={2}>
            <TableActions
                isOpen={allChecked || isIndeterminate}
                deleteSelected={deleteSelectedUsers}
                updateSelected={updateSelectedUsers} />
            <TableContainer>
                <Table variant='striped'>
                    <TableCaption>{language === "es" ? "Usuarios" : "Users"}</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>
                                <Checkbox size="lg"
                                    isChecked={allChecked}
                                    isIndeterminate={isIndeterminate}
                                    onChange={toogleAllCheckboxes} />
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
                        {users.map((user, index) => (
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
            <SimpleModal
                showModal={showModal}
                setShowModal={setShowModal}
                title={modalData.title}
                message={modalData.message}
            />
        </Box>
    )
}

export default UsersTable;