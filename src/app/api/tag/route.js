import prisma from "../../lib/prismaClient";

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const action = queryParams.get('action');
    if (action === 'getTags') {
        return await getTags();
    } else {
        const messageError = {
            en: "Bad request.",
            es: "Solicitud incorrecta."
        };
        const statusCode = 400;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

const getTags = async () => {
    let statusCode = 500;
    try {
        const rows = await prisma.tag.findMany();
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