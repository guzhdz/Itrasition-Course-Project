import prisma from "../../lib/prismaClient";
import superjson from 'superjson';
import _ from 'underscore';

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const action = queryParams.get('action');
    if (action === 'getTemplateOwner') {
        return await getTemplateOwner(queryParams);
    } else if (action === 'getTemplatesUser') {
        return await getTemplatesUser(queryParams);
    } else if (action === 'getTemplateSettings') {
        return await getTemplateSettings(queryParams);
    } else if (action === 'getLatestTemplates') {
        return await getLatestTemplates();
    } else if (action === 'getTemplateForFill') {
        return await getTemplateForFill(queryParams);
    } else if (action === 'getAllTemplates') {
        return await getAllTemplates(queryParams);
    } else if (action === 'getTemplateStadistics') {
        return await getTemplateStadistics(queryParams);
    }
    else {
        const messageError = {
            en: "Bad request.",
            es: "Solicitud incorrecta."
        }
        const statusCode = 400;
        return new Response(superjson.stringify({ error: messageError }), { status: statusCode });
    }
}

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
        return new Response(superjson.stringify({ error: messageError }), { status: 500 });
    }
}

export async function PUT(request) {
    const { templateInfoBody, action } = await request.json();
    if (action === 'updateTemplateSettings') {
        return await updateTemplateSettings(templateInfoBody);
    } else {
        const messageError = {
            en: "Bad request.",
            es: "Solicitud incorrecta."
        }
        const statusCode = 400;
        return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
    }
}

export async function DELETE(request) {
    const { ids } = await request.json();
    let statusCode = 500;
    try {
        const result = await prisma.template.deleteMany({
            where: {
                id: {
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


const getTemplateOwner = async (queryParams) => {
    const id = queryParams.get('id');
    let statusCode = 500;
    try {
        const result = await prisma.template.findUnique({
            where: { id: id },
            select: { user_id: true }
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

const getTemplatesUser = async (queryParams) => {
    const userId = queryParams.get('userId');
    let statusCode = 500;
    try {
        const rows = await prisma.template.findMany({
            where: { user_id: Number.parseInt(userId) },
            include: {
                topic: true
            },
            orderBy: {
                creation_time: 'desc'
            }
        });
        statusCode = 200;
        return new Response(superjson.stringify(rows), { status: statusCode });
    } catch (error) {
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(superjson.stringify({ error: messageError }), { status: statusCode });
    }
}

const getTemplateSettings = async (queryParams) => {
    const id = queryParams.get('id');
    let statusCode = 500;
    try {
        const result = await prisma.template.findUnique({
            where: { id: id },
            include: {
                topic: true,
                templatetags: {
                    include: {
                        tag: true
                    }
                },
                templateaccess: {
                    include: {
                        user: true
                    }
                }
            }
        });
        statusCode = 200;
        if (result) {
            result.templatetags = result.templatetags.map((templateTag) => ({
                value: templateTag.tag.id,
                label: templateTag.tag.name
            }));
            result.templateaccess = result.templateaccess.map((templateAccess) => ({
                value: templateAccess.user.id_user,
                label: templateAccess.user.name + " (" + templateAccess.user.email + ")"
            }));
        }
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

const getTemplateForFill = async (queryParams) => {
    const id = queryParams.get('id');
    let statusCode = 500;
    try {
        const result = await prisma.template.findUnique({
            where: { id: id },
            include: {
                topic: true,
                templatetags: {
                    select: {
                        tag: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                templateaccess: {
                    select: {
                        user: {
                            select: {
                                id_user: true
                            }
                        }
                    }
                },
                questions: {
                    orderBy: {
                        index_order: 'asc'
                    }
                }
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

const getLatestTemplates = async () => {
    let statusCode = 500;
    try {
        const rows = await prisma.template.findMany({
            take: 6,
            where: {
                OR: [
                    { state: { equals: 'public' } },
                    { state: { equals: 'restricted' } }
                ]
            },
            orderBy: {
                creation_time: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        statusCode = 200;
        return new Response(superjson.stringify(rows), { status: statusCode });
    } catch (error) {
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(superjson.stringify({ error: messageError }), { status: statusCode });
    }
}

const getAllTemplates = async (queryParams) => {
    const round = queryParams.get('round');
    let statusCode = 500;
    try {
        const rows = await prisma.template.findMany({
            where: {
                OR: [
                    { state: { equals: 'public' } },
                    { state: { equals: 'restricted' } }
                ]
            },
            orderBy: {
                creation_time: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });
        statusCode = 200;
        return new Response(superjson.stringify(rows), { status: statusCode });
    } catch (error) {
        const messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        };
        statusCode = 500;
        return new Response(superjson.stringify({ error: messageError }), { status: statusCode });
    }
}

const getTemplateStadistics = async (queryParams) => {
    const id = queryParams.get('id');
    let statusCode = 500;
    try {
        const result = await prisma.template.findUnique({
            where: { id: id },
            include: {
                questions: {
                    select: {
                        id: true,
                        type: true,
                        answers: {
                            select: {
                                answer_value: true
                            }
                        }
                    },
                    orderBy: {
                        index_order: 'asc'
                    }
                }
            }
        });
        statusCode = 200;
        if (result) {
            if (result.questions) {
                result.questions.forEach((question) => {
                    const aggregation = getAggregationStatistics(question);
                    question.aggregation = aggregation;
                });
            }
        }
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

const getAggregationStatistics = (question) => {
    switch (question.type) {
        case "text": {
            return getTextAggregation(question.answers);
        }
    }
}

const getTextAggregation = (answers) => {
    const answersFormatted = answers.map((answer) => answer.answer_value);
    const answerCount = _.countBy(answersFormatted);
    const sortedAnswers = _.chain(answerCount).pairs().sortBy(pair => pair[1]).reverse().value();
    const maxAnswer = sortedAnswers.length > 0 ? sortedAnswers[0] : null;
    return {
        sortedAnswers,
        maxAnswer
    };
}

const updateTemplateSettings = async (templateInfo) => {
    const { id, title, description, image_url, state, topic_id, tagsToAdd, tagsToDelete, newTags, usersToAdd, usersToDelete } = templateInfo;
    let statusCode = 500;
    try {
        const result = await prisma.$transaction(async () => {
            await prisma.templateTag.deleteMany({
                where: {
                    template_id: id,
                    tag_id: {
                        in: tagsToDelete
                    }
                }
            });
            await prisma.templateAccess.deleteMany({
                where: {
                    template_id: id,
                    user_id: {
                        in: usersToDelete
                    }
                }
            });
            const updatedTemplate = await prisma.template.update({
                where: { id },
                data: {
                    title,
                    description,
                    image_url,
                    state,
                    topic_id,
                    templatetags: {
                        create: [
                            ...newTags.map(tagName => {
                                return {
                                    tag: {
                                        create: { name: tagName }
                                    }
                                }
                            })
                        ],
                        upsert: tagsToAdd.map(tagid => ({
                            where: {
                                template_id_tag_id: {
                                    tag_id: tagid,
                                    template_id: id
                                }
                            },
                            create: {
                                tag: {
                                    connect: {
                                        id: tagid
                                    }
                                }
                            },
                            update: {}
                        }))
                    },
                    templateaccess: {
                        upsert: usersToAdd.map(userId => ({
                            where: {
                                template_id_user_id: {
                                    template_id: id,
                                    user_id: userId
                                }
                            },
                            create: {
                                user: {
                                    connect: {
                                        id_user: userId
                                    }
                                }
                            },
                            update: {}
                        }))
                    }
                }
            });
            return updatedTemplate;
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