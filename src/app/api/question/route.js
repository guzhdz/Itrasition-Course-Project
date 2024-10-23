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

export async function PUT(request) {
    const { questionsBody, action } = await request.json();
    if (action === 'updateTemplateQuestions') {
        return await updateTemplateQuestions(questionsBody);
    } else {
        const messageError = {
            en: "Bad request.",
            es: "Solicitud incorrecta."
        }
        const statusCode = 400;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}


const getQuestionsTemplate = async (queryParams) => {
    const idTemplate = queryParams.get('idTemplate');
    let statusCode = 500;
    try {
        const result = await prisma.question.findMany({
            where: {
                template_id: idTemplate
            },
            orderBy: {
                index_order: 'asc'
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

const updateTemplateQuestions = async (questionsBody) => {
    const { newQuestions, changedQuestions, deletedQuestions, templateId } = questionsBody;
    let statusCode = 500;
    try {
        const result = await prisma.$transaction(async () => {
            const updated = changedQuestions.map(async (question) => {
                return await prisma.question.update({
                    where: { id: question.id },
                    data: question
                });
            });
            const deleted = await prisma.question.deleteMany({
                where: { id: { in: deletedQuestions } }
            });
            const newOnes = await prisma.question.createMany({
                data: newQuestions.map(question => {
                    return {
                        ...question,
                        template_id: templateId,
                    }
                }),
            });
            return {
                updated,
                deleted,
                newOnes
            };
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