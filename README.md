# Course Project
Deploy Link: https://itrasition-course-project.onrender.com

This is the Intrasition Intership Final Project

Technologies used:
- React
- Next.js (Javascript, CSS, HTML)
- Chakra UI
- Prisma ORM
- PostreSQL
- Node.js

## Project instructions and requirements
 Depending of what group you are in):
.NET: C#, Blazor or MVC (you choose)
or
JavaScript: JavaScript or TypeScript (you choose), React (ask if you want to replace React with Angular)

You can use any database and any other libraries, components or even frameworks (but not replace specified above).

There are no limitations in the area of architecture or used services (you don't even have to separate front and back; it's not a recommendation, but you may go this way). Also, you may replace Bootstrap with any CSS framework and/or UI library you like. 

You have to implement a Web application for customisable forms (quizzes, tests, questionnaires, polls, etc.). Something similar to Google Forms. Users define "templates" (the set of questions, their names and descriptions, etc.), and other users fill out "forms" (their specific answers) using these templates (e.g., enter or select values in the fields).

E.g., I create a template with one integer-valued question "How many apples do you eat per day?" Users fill out corresponding forms, and I can analyse the answers.

Non-authenticated users cannot create templates, leave comments and likes, or fill out the forms. But they can use search and view templates in read-only mode.

Admin-page allow user management—view; block; unblock; delete; add to admins; remove from admins. ADMIN IS ABLE TO REMOVE ADMIN ACCESS FROM ITSELF; it’s important.

Admin sees all pages as their author (for example, admin can open a template of another user and add a question to it or open a form for the user and edit an answer; so, admin is virtually the owner of every template and every form).

Filled-out forms (answers) can be seen by the author as well as the creator of the responding template and admins. Templates are accessible for viewing for everyone.

Only the admin or creator of the template can manage it (add/delete/edit questions).

Only the admin or creator of the form can manage it (delete it or edit answers).

Users can register and authenticate via site forms.

Every page (in the top header) provides access to the full-text search. Search results are always templates (e.g., if text is found in the question description or template comments, the search result links to the template itself, not to the question or comment).
Every user has its own personal page where they can manage the sortable table of templates (create new, delete, or edit) and the sortable table of the filled forms (probably on two separate tabs). 

Each template in the table is a link to the template page that contains several tabs:
- general settings like title, description, etc. (see below) as well as access settings (all authenticated users or specified user only),
- editable set of questions,
- "results", i.e. all filled-out forms based on the given template (with the links to the forms, of course),
- aggregation of the results/answers (e.g., average value for a numeric field, most often answer for a string field, etc.).

The template author can click any form in the list on the template page and open the form filled by another user in read-only mode.

When the template is shown to the other user, it can be filled out (stored as a "form") if that user is authenticated, and access settings allow that user to fill out the form.
Settings of the template are the following:
- title,
- description (with markdown formatting support),
- topic (one value from the predefined list, for example, "Education," "Quiz," and, of course, "Other"—new values to this list are added through the database; there is no need for the UI), optional image/illustration (uploaded by the users into the cloud),
- tags (the user can enter several tags; it’s necessary to support autocompletion—when the user starts text entering, you have to display a dropdown with tags starting with the entered letter already stored in the database).

Every template can be marked as "public" (can be filled by any authenticated user), or the user selects the set of users registered on the site. The control for the user selection should provide autocompletion for names and for e-mails. Added users can be removed. Provide some sorting of the selected user (user-switchable between name and e-mail).

Of course, the template allows to specify custom questions ("fields"). There are also fixed fields, that are invisible on the template, but are shown on every form: user (filled automatically) and date (filled automatically).

Also, it's possible to add several questions with the following types:
- up to 4 single-line strings,
- up to 4 multiple-line texts,
- up to 4 positive integers,
- up to 4 checkboxes.

Each question has a title, description, and a boolean value that defines whether the question will be displayed in the table of the filled-out forms (on the tab of the template).

It's possible to reorder questions with drag'n'drop.

For example, I want to create a questionnaire for job candidates. I add the following questions:
- Single-line question "Position" ("What position do you apply for?"),
- Integer-value question "Experience" ("Work on the commercial projects or freelance (in years)"),
- Single-line question "Contact" ("Phone number or Skype"),
- Text question "Additional information"/("Write anything in the field below").

Main page of the app contains:
- gallery of latest templates (name, description or image, author),
- table of the top 5 most popular templates (with the largest number of filled forms);
- tag cloud (when the user clicks on the tag, you display the list of templates—in general, you should use “search results page” for it).

When the template is opened (by the author or another user that has access), there is a comments list at the bottom. Comments are linear, added only to the end (it’s impossible to insert a new comment between old ones, only add to the end). Comments have to be updated automatically—when the template page is opened and somebody adds a comment to it, it should be added automagically (it’s possible to have a 2-5 second delay).

Every template also has "likes" (no more than one from one user per given template). 
The application should support two languages: English and any other—Polish, Spanish, Uzbek, Georgian, etc. (the user selects one and the choice is saved). Only UI is translated, not the user content. 

The application should support two visual themes (skins): light and dark (the user selects one and the choice is saved).

It’s required:
- to use CSS framework, e.g., Bootstrap (but you can use any CSS other framework and any set of control),
- to support different screen resolutions (including mobile phones), be adaptive,
- to use ORM to access data (sequelize, prism, typeorm, EF—anything you like),
- 1 to use a full-text search engine (either an external library or using native database features).

DON'T:
- don't use a full database scan with SELECTs,
- don't upload images to your Web server,
- don't perform database queries in the loop.

Is it possible to use the X library? Yes, yes to all, remember my choice.
Optional requirements (for a separate grade, only if all other requirements are implemented):
authentication via social networks,
add questions with the type “one from the given list” with the ability to specify a list of available options (e.g., template auther create a "Position" question  with options "Developer"/"DevOps"/"Tester"),
add any number of questions of any type (not 0 or 1 or 2 or 3 or 4, but any number of them),
add the "E-mail me the copy of my answers" checkbox to the form.

Note: The SalesForce and Jira(Tickats) integrations have been disables for the moment to fix them.

## Preview Images:
![image](https://github.com/user-attachments/assets/d8e024d4-0413-43d2-9111-de87f4969902)

![image](https://github.com/user-attachments/assets/679cfe77-6f64-4906-a7f5-9690dd47a4cd)

![image](https://github.com/user-attachments/assets/b77aa51f-a876-4826-aa8b-ba321c3dfa5b)

![image](https://github.com/user-attachments/assets/cc550b9a-78c2-4c75-85e7-96fb204d6a8f)

![image](https://github.com/user-attachments/assets/1fa9ef2a-b1b2-457a-b40e-ca8d3500bae8)

![image](https://github.com/user-attachments/assets/58a5f332-6541-4ac7-a113-89ca264c4201)

![image](https://github.com/user-attachments/assets/e4b383fd-ceca-4479-8ef0-f2294d48a31d)

![image](https://github.com/user-attachments/assets/9127c097-4e5f-4260-8b29-0610f76eaa12)

![image](https://github.com/user-attachments/assets/07c347d3-3194-41aa-92ce-781f1fc2de3f)

![image](https://github.com/user-attachments/assets/fa30e229-894d-4c86-ac44-42d744e091f3)

![image](https://github.com/user-attachments/assets/2083e59b-84fa-4f13-b68d-620472119b76)

![image](https://github.com/user-attachments/assets/9b08af09-430e-4ac6-a96f-1462936a3980)

![image](https://github.com/user-attachments/assets/c7fcb365-53aa-46db-978d-d767c23e4ac2)

![image](https://github.com/user-attachments/assets/4205e291-90dd-40b0-b330-01107c8a6613)

![image](https://github.com/user-attachments/assets/fb783ee3-c038-4fd8-927a-4d5577c06d2a)

![image](https://github.com/user-attachments/assets/39b02c24-f9bc-4d92-babd-b42aba8d23e3)

![image](https://github.com/user-attachments/assets/511ccd26-75bc-4464-bafb-289dc0a96cb4)


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
