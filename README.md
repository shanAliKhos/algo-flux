# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

### Frontend
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Query
- React Router

### Backend
- NestJS
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Class-validator & Joi for validation
- Swagger API Documentation

## Admin Panel

The project includes a comprehensive admin panel for managing users and system settings.

### Accessing the Admin Panel

1. Start the backend server:
```bash
cd backend
npm install
npm run start:dev
```

2. Create an admin user:
```bash
cd backend
npm run seed:admin
# Or set custom credentials:
# ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=YourPassword123! npm run seed:admin
```

3. Start the frontend:
```bash
npm install
npm run dev
```

4. Navigate to `http://localhost:8080/admin/login` and login with your admin credentials.

### Admin Panel Features

- **Dashboard**: View system statistics, user growth charts, and recent users
- **User Management**: Create, read, update, and delete users with role-based access
- **Settings**: View and manage your profile and system information

### Backend API

The backend API runs on `http://localhost:3000` by default.
API documentation (Swagger) is available at `http://localhost:3000/api/docs`.

See [backend/README.md](./backend/README.md) for detailed backend documentation.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
