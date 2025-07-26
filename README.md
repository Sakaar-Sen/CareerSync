# CareerSync: AI-Powered Resume Analyzer

CareerSync is a full-stack web application designed to help job seekers optimize their resumes. Users can upload their resume and a job description to receive instant, AI-powered feedback, including a match score, keyword analysis, and actionable suggestions for improvement. The application supports user accounts to save and review analysis history.

## Features

- **AI-Powered Analysis**: Leverages a Large Language Model (LLM) to provide detailed feedback on resumes.
- **Asynchronous Processing**: Uses Celery and Redis to handle intensive analysis tasks in the background, ensuring a responsive user experience.
- **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
- **Analysis History**: Logged-in users can view a history of all their past resume analyses.
- **PDF Report Generation**: Users can download a professional, print-friendly PDF of their analysis report.
- **Containerized Environment**: Fully containerized with Docker and Docker Compose for easy setup and consistent deployment.

---

## Tech Stack

| Category      | Technology                                       |
|---------------|--------------------------------------------------|
| **Backend** | Django, Django REST Framework, Celery  |
| **Frontend** | React.js                              |
| **Database** | PostgreSQL                                       |
| **Message Broker**| Redis                                            |
| **AI API** | OpenAI-Compatible (e.g., Llama 3.1)              |
| **Deployment**| Docker                                   |

---

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed and running.
- An API key from an OpenAI-compatible service.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Sakaar-Sen/careersync.git
    cd careersync
    ```

2.  **Set up environment variables:**
    - Create a `.env` file in the backend directory.
    - Add your API key to this file:
      ```
      API_KEY='your-secret-api-key'
      ```

3.  **Build and run the application with Docker Compose:**
    - Run the following command:
      ```bash
      docker-compose up --build
      ```
    - This will build the Docker images and start all the necessary services (PostgreSQL, Redis, Django, and Celery).

4.  **Run the frontend:**
    - Open a new terminal and navigate to the `frontend` directory.
    - Install the dependencies and start the development server:
      ```bash
      npm install
      npm run dev
      ```

The backend API will be available at `http://localhost:8000`, and the React frontend will be running at `http://localhost:5173`.

---

## Endpoints

The backend provides the following RESTful API endpoints:

- `POST /api/users/register/`: Create a new user account.
- `POST /api/users/login/`: Log in to get JWT access and refresh tokens.
- `GET /api/users/me/`: Get the currently authenticated user's information.

- `POST /api/analyze/`: Start a new resume analysis job.
- `GET /api/history/`: Get the analysis history for the logged-in user.
  
- `GET /api/jobs/<task_id>/`: Check the status and result of a specific analysis job.
- `GET /api/jobs/<task_id>/download/`: Download the PDF report for a completed job.

