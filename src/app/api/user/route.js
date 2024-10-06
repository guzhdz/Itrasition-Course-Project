import bcrypt from 'bcrypt'
import prisma from "../../lib/prismaClient";

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const action = queryParams.get('action');
    if (action === 'getUsers') {
    } else if (action === 'getUser') {
        return await getUser(queryParams);
    } else if (action === 'getBlockedUsers') {
    } else if (action === 'getActiveUsers') {
    } else {
        const messageError = 'Bad request';
        const statusCode = 400;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

export async function POST(request) {
    const { name, email, password, status, is_admin, register_time } = await request.json();
    if (!name || !email || !password) {
        return new Response(JSON.stringify({ error: {
            en:"All fields are required",
            es:"Todos los campos son obligatorios"
        } }), { status: 400 });
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