import bcrypt from 'bcrypt'
import prisma from "../../lib/prismaClient";

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const action = queryParams.get('action');
    if (action === 'getUsers') {
        return await getUsers();
    } else if (action === 'getUser') {
        return await getUser(queryParams);
    } else if (action === 'getBlockedUsers') {
        return await getStatusUsers(false);
    } else if (action === 'getActiveUsers') {
        return await getStatusUsers(true);
    } else if (action === 'getAdminUsers') {
        return await getAdminUsers(true);
    } else if (action === 'getNormalUsers') {
        return await getAdminUsers(false);
    } else {
        const messageError = 'Bad request';
        const statusCode = 400;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

export async function POST(request) {
    const { name, email, password, status, is_admin, register_time } = await request.json();
    if (!name || !email || !password) {
        return new Response(JSON.stringify({
            error: {
                en: "All fields are required",
                es: "Todos los campos son obligatorios"
            }
        }), { status: 400 });
    }
    let statusCode = 500;
    try {
        const hashedPassword = await getHashedPassword(password);
        const result = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                status,
                is_admin,
                register_time
            }
        });
        statusCode = 200;
        return new Response(JSON.stringify(result), { status: statusCode });
    } catch (error) {
        let messageError = "";
        if (error.code === 'P2002') {
            messageError = {
                en: 'Email already exists, please use another email.',
                es: 'El correo ya existe, por favor, utiliza otro correo.'
            };
            statusCode = 409;
        } else {
            messageError = {
                en: "Server error. Please try again later.",
                es: "Error del servidor. Por favor, intentalo de nuevo."
            };
            statusCode = 500;
        }
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

export async function DELETE(request) {
    const { ids } = await request.json();
    console.log(ids);
    let statusCode = 500;
    try {
        const result = await prisma.user.deleteMany({
            where: {
                id_user: {
                    in: ids
                }
            }
        });
        statusCode = 200;
        return new Response(JSON.stringify(result), { status: statusCode });
    } catch (error) {
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

export async function PUT(request) {
    const { users } = await request.json();
    let statusCode = 500;
    console.log(users);
    try {
        const results = users.map((user) => {
            const newData = {
                ...(user.name && { name: user.name }),
                ...(user.email && { email: user.email }),
                ...(user.status !== undefined && { status: user.status }),
                ...(user.is_admin !== undefined && { is_admin: user.is_admin }),
                ...(user.register_time && { register_time: user.registerTime }),
            };
            if (user.password) {
                return getHashedPassword(user.password).then((hashedPassword) => {
                    newData.password = hashedPassword;
                    return prisma.user.update({
                        where: { id_user: user.idUser },
                        data: newData
                    });
                });
            }
            return prisma.user.update({
                where: { id_user: user.id_user },
                data: newData
            });
        });
        const result = await prisma.$transaction(results);
        statusCode = 200;
        return new Response(JSON.stringify(result), { status: statusCode });
    } catch (error) {
        console.log(error);
        let messageError = "";
        if(error.code === 'P2002') {
            messageError = {
                en: 'One of the emails already exists, please use another email.',
                es: 'Uno de los correos ya existe, por favor, utiliza otro correo.'
            };
            statusCode = 409;
        } else {
            messageError = {
                en: "Server error. Please try again later.",
                es: "Error del servidor. Por favor, intentalo de nuevo."
            };
            statusCode = 500;
        }
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

const getHashedPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const getUser = async (queryParams) => {
    const id = parseInt(queryParams.get('id'));
    let statusCode = 500;
    try {
        const user = await prisma.user.findUnique({
            where: { id_user: id },
            select: { id_user: true, name: true, email: true, status: true, is_admin: true, register_time: true }
        });
        statusCode = 200;
        return new Response(JSON.stringify(user), { status: statusCode });
    } catch (error) {
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

const getUsers = async () => {
    let statusCode = 500;
    try {
        const rows = await prisma.user.findMany({
            select: { id_user: true, name: true, email: true, status: true, is_admin: true, register_time: true }
        });
        statusCode = 200;
        return new Response(JSON.stringify(rows), { status: statusCode });
    } catch (error) {
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

const getStatusUsers = async (value) => {
    let statusCode = 500;
    try {
        const rows = await prisma.user.findMany({
            where: { status: value },
            select: { id_user: true, name: true, email: true, status: true, is_admin: true, register_time: true }
        });
        statusCode = 200;
        return new Response(JSON.stringify(rows), { status: statusCode });
    } catch (error) {
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

const getAdminUsers = async (value) => {
    let statusCode = 500;
    try {
        const rows = await prisma.user.findMany({
            where: { is_admin: value },
            select: { id_user: true, name: true, email: true, status: true, is_admin: true, register_time: true }
        });
        statusCode = 200;
        return new Response(JSON.stringify(rows), { status: statusCode });
    } catch (error) {
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}