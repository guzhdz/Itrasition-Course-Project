const JiraClient = require('jira-client');

const jiraApi = new JiraClient({
    protocol: 'https',
    host: process.env.JIRA_HOST,
    username: process.env.JIRA_EMAIL,
    password: process.env.JIRA_API_TOKEN,
    apiVersion: '3',
    strictSSL: true
});

export async function GET(request) {
    const url = new URL(request.url);
    const queryParams = url.searchParams;
    const action = queryParams.get('action');
    if (action === 'getUserIssues') {
        return await getUserIssues(queryParams);
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
    const { summary, priority, templateTitle, link, reportedBy, description } = await request.json();
    let statusCode = 500;
    if (!summary || !priority || !link || !reportedBy || !description) {
        statusCode = 400;
        return new Response(JSON.stringify({
            error: {
                en: "Some required fields are missing",
                es: "Algunos campos obligatorios faltan"
            }
        }), { status: statusCode });
    }
    try {
        const user = await checkAndCreateUser(reportedBy);
        const result = await jiraApi.addNewIssue({
            fields: {
                project: { key: process.env.JIRA_PROJECT_KEY },
                summary: summary,
                description: description,
                issuetype: { name: 'Bug' },
                priority: { name: priority },
                reporter: { id: user.accountId },
                "customfield_10037": templateTitle,
                "customfield_10038": link
            }
        });
        const key = result.key;
        const url = `https://${process.env.JIRA_HOST}/browse/${key}`;
        statusCode = 200;
        return new Response(JSON.stringify(url), { status: statusCode });
    } catch (error) {
        console.log(error);
        let messageError = {
            en: "Server error. Please try again later.",
            es: "Error del servidor. Por favor, intentalo de nuevo."
        }
        return new Response(JSON.stringify({ error: messageError }), { status: 500 });
    }
}

const checkAndCreateUser = async (email) => {
    try {
        const existingUser = await searchUser(email);
        if (existingUser.length > 0) {
            return existingUser[0];
        } else {
            const newUser = await jiraApi.createUser({
                emailAddress: email,
                products: ['jira-software'],
            });
            return newUser;
        }
    } catch (error) {
        throw new Error(error);
    }
};

const searchUser = async (email) => {
    try {
        const user = await jiraApi.searchUsers(
            {
                query: email,
                includeInactive: true
            }
        );
        return user;
    } catch (error) {
        return [];
    }
}

const getUserIssues = async (queryParams) => {
    const email = queryParams.get('email');
    let statusCode = 500;
    try {
        const user = await searchUser(email);
        let rows = []
        if(user.length !== 0) {
            rows =await jiraApi.searchJira(
                `reporter = ${user[0].accountId}`,
                {
                    fields: ['summary', 'status', 'priority', 'created', 'key'],
                }
            );
        }
        statusCode = 200;
        return new Response(JSON.stringify(rows?.issues || rows), { status: statusCode });
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

