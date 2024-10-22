import prisma from "../../lib/prismaClient";
import superjson from 'superjson';

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const action = queryParams.get('action');
    if (action === 'getQuestionsTemplate') {
        return await getQuestionsTemplate(queryParams);
    } else {
        const messageError = {
            en: "Bad request.",
            es: "Solicitud incorrecta."
        }
        const statusCode = 400;
        return new Response(superjson.stringify({ error: messageError }), { status: statusCode });
    }
}


const getQuestionsTemplate = async (queryParams) => {
    const idTemplate = queryParams.get('idTemplate');
    let statusCode = 500;
    try {
        const result = await prisma.question.findMany({
            where: { 
                template_id: idTemplate
             }
        });
        statusCode = 200;
        return new Response(superjson.stringify(result), { status: statusCode });
    } catch (error) {
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(superjson.stringify({ error: messageError }), { status: statusCode });
    }
}