//import prisma from "../../lib/prismaClient";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    try {
        const email = queryParams.get("email");
        const password = queryParams.get("password"); 
        return await authUser(email, password);
    } catch (error) {
        const messageError = 'Server error. Please try again later.' + error;
        const statusCode = 500;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

const authUser = async (inputEmail, inputPassword) => {
    let messageError = "";
    let statusCode = 500;
    if (!inputEmail || !inputPassword) {
        messageError = 'You must enter an email and a password';
        statusCode = 400;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
    try {
        const user = await getUser(inputEmail);
        if (!user) {
            messageError = 'Incorrect email or password';
            statusCode = 401;
            return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
        } else if(!user.status) {
            messageError = 'Sorry, your account is blocked. Please contact the administrator';
            statusCode = 403;
            return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
        } else {
            const isAuthenticated = await authenticate(inputPassword, user.password);
            if (!isAuthenticated) {
                messageError = 'Incorrect email or password';
                statusCode = 401;
                return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
            } else {
                statusCode = 200;
                return new Response(JSON.stringify( user.id_user ), { status: statusCode });
            }
        }
    } catch (error) {
        messageError = 'Server error. Please try again later.' + error;
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
        throw new Error("Server error. Please try again later." + error);
    }
}

const authenticate = async (inputPassword, hash) => {
    try {
        return await bcrypt.compare(inputPassword, hash);
    } catch (error) {
        throw new Error(error);
    }
}