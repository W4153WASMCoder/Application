Here’s a `README.md` for your React application:

```markdown
# React Web Application

This is a React application built with TypeScript, designed to manage and interact with projects and project files. This document will guide you through the steps to clone, build, and run the application.

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/W4153WASMCoder/Application.git
cd ./Application/react-web-app
```

### 2. Set Up Environment Variables

Create a `.env` file in the `react-web-app` directory and add the following environment variables:

```env
REACT_APP_LOGIN_ENDPOINT="http://localhost:8000/users/login"
REACT_APP_PROJECTS_ENDPOINT="http://localhost:8000/projects"
REACT_APP_PROJECT_FILES_ENDPOINT="http://localhost:8000/project_files"
```

Adjust these URLs as needed to match your backend service configuration.

### 3. Install Dependencies

In the `react-web-app` directory, install the dependencies:

```bash
npm install
```

### 4. Build the Project

To create a production-ready build of the application, run:

```bash
npm run build
```

The build files will be generated in the `./build` directory, specifically under `./build/static/css/` and `./build/static/js/`.

### 5. Run the Application

- **Development Mode:** Start the app with hot-reloading:
  ```bash
  npm start
  ```
  The application will be accessible at `http://localhost:3000` by default.

- **Production Mode:** After building, you can serve the `./build` directory with any static file server. For example, you can use `serve` (installable via npm) to serve it locally:
  ```bash
  npm install -g serve
  serve -s build
  ```

### 6. Project Structure

- `./src/index.tsx`: Entry point for the React application.
- `./src/App.tsx`: Main application component.
- `./src/Projects.tsx`: Component for handling projects.
- `./src/ProjectFiles.tsx`: Component for handling project files.
- `./src/Login.tsx`: Component for user login.
- `./src/Pagination.tsx`: Component for pagination.
- `./src/models.ts`: TypeScript models for data structures.
- `./src/setupTests.ts`: Configuration for setting up tests.
- `./src/reportWebVitals.ts`: Tool to measure performance metrics.

### Running Tests

To execute tests:

```bash
npm test
```

This will run the tests defined in files like `App.test.tsx` and other test files in the `src` directory.

### License

See the main `LICENSE` file in the repository for licensing details.
