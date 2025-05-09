# Zyntax

Zyntax is a powerful web application for converting JSON to TypeScript interfaces/types. It provides a simple, intuitive interface with real-time conversion and various output customization options.

## Features

- **JSON to TypeScript Conversion**: Convert JSON objects to TypeScript interfaces or types
- **Customization Options**: Customize output with settings like interface/type names, indentation, semicolons, and more
- **Code Editor**: Built-in Monaco editor with syntax highlighting and formatting
- **User Accounts**: Save your conversions and access them later
- **Responsive Design**: Works great on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI**: Mantine UI
- **Authentication**: NextAuth.js with magic link (email) authentication
- **Database**: PostgreSQL with Prisma ORM
- **Code Editor**: Monaco Editor
- **API**: Next.js API routes
- **State Management**: React Query, React Hooks

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/zyntax.git
   cd zyntax
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database connection string and other configuration values.

4. Set up the database:

   ```bash
   npm run db:push
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application uses Prisma with PostgreSQL. To set up your database:

1. Make sure PostgreSQL is running and you have a database created.
2. Update the `DATABASE_URL` in the `.env` file.
3. Run Prisma migrations:
   ```bash
   npm run db:push
   ```

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to the database
- `npm run db:studio` - Open Prisma Studio to view and edit data
- `npm run setup` - Install dependencies and set up the database

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Mantine UI](https://mantine.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://prisma.io/)
