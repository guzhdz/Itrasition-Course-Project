const jsforce = require('jsforce');

const conn = new jsforce.Connection();

// const userInfo = await conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD + process.env.SF_SECURITY_TOKEN,
//     (err, res) => {
//         if (err) {
//             return null;
//         }
//     }
// );


// export async function GET(request) {
//     const url = new URL(request.url);
//     const queryParams = url.searchParams;
//     const action = queryParams.get('action');
//     if (action === 'getAccountByAccountNumber') {
//         return await getAccountByAccountNumber(queryParams);
//     } else {
//         const messageError = {
//             en: "Bad request.",
//             es: "Solicitud incorrecta."
//         }
//         const statusCode = 400;
//         return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
//     }
// }


// export async function POST(request) {
//     const { id, accountName, contactFirstName, contactLastName, contactEmail, phone } = await request.json();
//     let statusCode = 500;
//     if (!accountName || !contactFirstName || !contactLastName || !contactEmail || !phone) {
//         statusCode = 400;
//         return new Response(JSON.stringify({
//             error: {
//                 en: "Some required fields are missing",
//                 es: "Algunos campos obligatorios faltan"
//             }
//         }), { status: statusCode });
//     }
//     let accountId = null;
//     try {

//         if (userInfo === null) {
//             throw new Error({
//                 en: "Error at login in salesforce",
//                 es: "Error al iniciar sesión en salesforce"
//             });
//         }

//         const account = await conn.sobject("Account").create({
//             Name: accountName,
//             Phone: phone,
//             AccountNumber: id
//         });
//         accountId = account.id;

//         const contact = await conn.sobject("Contact").create({
//             FirstName: contactFirstName,
//             LastName: contactLastName,
//             Email: contactEmail,
//             Phone: phone,
//             AccountId: account.id
//         });

//         statusCode = 200;
//         return new Response(JSON.stringify({ account, contact }), { status: statusCode });
//     } catch (error) {
//         let messageError = {
//             en: "Server error. Please try again later.",
//             es: "Error del servidor. Por favor, intentalo de nuevo."
//         }
//         if (error.errorCode === "DUPLICATES_DETECTED") {
//             if (error.data.duplicateResult.duplicateRuleEntityType === "Account") {
//                 messageError = {
//                     en: "An account asociated with this user already exists",
//                     es: "Una cuenta asociada con este usuario ya existe"
//                 }
//             } else if (error.data.duplicateResult.duplicateRuleEntityType === "Contact") {
//                 messageError = {
//                     en: "A contact with this email already exists",
//                     es: "Un contacto con este correo ya existe"
//                 }
//                 deleteAccount(accountId);
//             }
//         }
//         return new Response(JSON.stringify({ error: messageError }), { status: 500 });
//     }
// }

// const deleteAccount = async (accountId) => {
//     if (accountId) {
//         try {
//             await conn.sobject("Account").delete(accountId);
//         } catch (error) {
//             console.log("Error at deleting account: ", error);
//         }
//     }
// }

// const getAccountByAccountNumber = async (queryParams) => {
//     const accountNumber = queryParams.get('accountNumber');
//     let statusCode = 500;
//     try {
//         const result = await conn.sobject("Account").find({ AccountNumber: accountNumber }).execute();
//         statusCode = 200;
//         return new Response(JSON.stringify(result), { status: statusCode });
//     } catch (error) {
//         const messageError = {
//             en: "Server error. Please try again later.",
//             es: "Error del servidor. Por favor, intentalo de nuevo."
//         };
//         statusCode = 500;
//         return new Response(JSON.stringify({ error: messageError }), { status: statusCode });
//     }
// }