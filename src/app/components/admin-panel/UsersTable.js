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
    Checkbox
} from "@chakra-ui/react";

//Components imports
import SimpleModal from "../shared/SimpleModal";

//Services imports
import { getUsers } from "../../services/userService";

//Library imports
import { FiCheckSquare } from "react-icons/fi";
import { FiXSquare } from "react-icons/fi";

//Context imports
import { UIContext } from "../../context/UIContext";

const UsersTable = ({ usersRequest }) => {
    const { language, greenColor, redColor } = useContext(UIContext);
    const [users, setUsers] = useState([]);
    const [checkedUsers, setCheckedUsers] = useState([]);
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
            setModalData({
                title: "Error at loading users",
                message: language === "es" ? response.message[language] : response.message.en,
            });
            setShowModal(true);
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

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <>
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
        </>
    )
}

export default UsersTable;