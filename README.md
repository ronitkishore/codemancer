# Codemancer - Code Review Tool with CodeLlama and Together AI

Codemancer is a code review tool that utilizes CodeLlama to analyze pull requests and provide detailed code reviews. It also integrates with Together AI for inference and uses GitHub OAuth for authentication. The project is built with [Next.js](https://nextjs.org/) and bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It uses Prisma with a SQLite database and NextAuth for authentication.

## Prerequisites

Before getting started, ensure you have the following installed on your machine:

- Node.js (version 14 or later)
- npm (version 6 or later)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/ronitkishore/codemancer.git
   ```

2. Navigate to the project directory:

   ```bash
   cd codemancer
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up the environment variables:

   - Create a `.env.local` file in the root of the project.
   - Add the necessary environment variables for Prisma, SQLite, NextAuth, Together AI, and GitHub OAuth. For example:

     ```
     DATABASE_URL="file:./dev.db"
     NEXTAUTH_SECRET=your-secret-here
     TOGETHER_API_KEY=your-together-ai-api-key
     GITHUB_CLIENT_ID=your-github-client-id
     GITHUB_CLIENT_SECRET=your-github-client-secret
     ```

5. Set up the database:

   - Run the Prisma migration to create the necessary tables:

     ```bash
     npx prisma migrate dev
     ```

   - Generate the Prisma client:

     ```bash
     npx prisma generate
     ```

6. Run the development server:

   ```bash
   npm run dev
   ```

   Alternatively, you can use `yarn`, `pnpm`, or `bun`:

   ```bash
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

7. Go to [http://localhost:3000](http://localhost:3000)
