import prisma from "../../lib/prismaClient";
import superjson from 'superjson';

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const action = queryParams.get('action');
    if (action === 'getUserForm') {
        return await getUserForm(queryParams);
    } else {
        const messageError = {
            en: "Bad request.",
            es: "Solicitud incorrecta."
        }
        const statusCode = 400;
        return new Response(superjson.stringify({ error: messageError }), { status: statusCode });
    }
}

export async function POST(request) {
    const { template_id, user_id, fill_time, answers } = await request.json();
    let statusCode = 500;
    const newAnswers = answers.map((answer) => {
        return {
            answer_value: answer.answer_value,
            question: { connect: { id: answer.question_id } },
        }
    })
    try {
        const result = await prisma.form.create({
            data: {
                fill_time,
                template: { connect: { id: template_id } },
                user: { connect: { id_user: user_id } },
                answers: { create: newAnswers },
            },
        });
        statusCode = 200;
        return new Response(superjson.stringify(result.id), { status: statusCode });
    } catch (error) {
        console.log(error);
        let messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        }
        return new Response(superjson.stringify({ error: messageError }), { status: 500 });
    }
}

export async function PUT(request) {
    const { template_id, user_id, fill_time, answers } = await request.json();
    let statusCode = 500;
    const updatedAnswers = answers.map((answer) => {
        return {
            where: {
                id: answer.id,
            },
            data: {
                answer_value: answer.answer_value,
            }
        }
    })
    try {
        const result = await prisma.form.update({
            where: {
                template_id_user_id: {
                    template_id: template_id,
                    user_id: user_id
                }
            },
            data: {
              fill_time,
              answers: { updateMany: updatedAnswers },
            },
          });
        statusCode = 200;
        return new Response(superjson.stringify(result.id), { status: statusCode });
    } catch (error) {
        console.log(error);
        let messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        }
        return new Response(superjson.stringify({error: messageError}), { status: 500 });
    }
}

const getUserForm = async (queryParams) => {
    const userId = queryParams.get('userId');
    const templateId = queryParams.get('templateId');
    let statusCode = 500;
    try {
        const result = await prisma.form.findUnique({
            where: {
                template_id_user_id: {
                    template_id: templateId,
                    user_id: Number.parseInt(userId)
                }
            },
            include: {
                answers: true,
                user: {
                    select: {
                        name: true,
                    }
                }
            }
        });
        statusCode = 200;
        return new Response(superjson.stringify(result), { status: statusCode });
    } catch (error) {
        console.log(error);
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(superjson.stringify({ error: messageError }), { status: statusCode });
    }
}