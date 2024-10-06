import prisma from "../../lib/prismaClient";
import bcrypt from "bcrypt";

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    try {
        const email = queryParams.get("email");
        const password = queryParams.get("password"); 
        return await authUser(email, password);
    } catch (error) {
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo.",
        };
        const statusCode = 500;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

const authUser = async (inputEmail, inputPassword) => {
    let messageError = "";
    let statusCode = 500;
    if (!inputEmail || !inputPassword) {
        messageError = {
            en: "You must enter an email and a password",
            es: "Debes introducir un correo y una contraseña",
        };
        statusCode = 400;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
    try {
        const user = await getUser(inputEmail);
        if (!user) {
            messageError = { 
                en: "Incorrect email or password",
                es: "Correo o contraseña incorrectos",
            };
            statusCode = 401;
            return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
        } else if(!user.status) {
            messageError = {
                en: "Your account has been blocked. Please contact support.",
                es: "Tu cuenta ha sido bloqueada. Por favor, contacta con soporte.",
            };
            statusCode = 403;
            return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
        } else {
            const isAuthenticated = await authenticate(inputPassword, user.password);
            if (!isAuthenticated) {
                messageError = {
                    en: "Incorrect email or password",
                    es: "Correo o contraseña incorrectos"
                };
                statusCode = 401;
                return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
            } else {
                statusCode = 200;
                return new Response(JSON.stringify( user.id_user ), { status: statusCode });
            }
        }
    } catch (error) {
        messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
    
}

const getUser = async (inputEmail) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: inputEmail
            }
        });
        return user;
    } catch (error) {
        throw new Error("Server error. Please try again later.");
    }
}

const authenticate = async (inputPassword, hash) => {
    try {
        return await bcrypt.compare(inputPassword, hash);
    } catch (error) {
        throw new Error(error);
    }
}