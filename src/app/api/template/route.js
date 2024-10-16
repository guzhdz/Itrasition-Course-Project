import prisma from "../../lib/prismaClient";
import superjson from 'superjson';

export async function POST(request) {
    const { title, description, image_url, state, creation_time, topic_id, user_id } = await request.json();
    let statusCode = 500;
    if (!title || !description) {
        statusCode = 400;
        return new Response(JSON.stringify({
            error: {
                en: "Some required fields are missing",
                es: "Algunos campos obligatorios faltan"
            }
        }), { status: statusCode });
    }
    try {
        const result = await prisma.template.create({
            data: {
                title,
                description,
                image_url,
                state,
                creation_time,
                topic: {
                    connect: {
                        id: topic_id
                    }
                },
                user: {
                    connect: {
                        id_user: user_id
                    }
                }
            }
        });
        statusCode = 200;
        return new Response(superjson.stringify(result.id), { status: statusCode });
    } catch (error) {
        let messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        }
        return new Response(JSON.stringify(messageError), { status: 500 });
    }
}