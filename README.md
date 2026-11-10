# AfterCare – Remote Patient Health Monitoring System

AfterCare is a full-stack web application prototype designed to support post-discharge patient monitoring and communication between patients and their assigned doctors.

Patients can manually submit health readings and review their health history. Doctors can access records of their assigned patients, add medical notes, and review alerts generated from submitted readings. An administrator manages users and assigns doctors to patients.

The project demonstrates the development of a role-based healthcare application using React, Node.js, Express.js, and MongoDB.

## Features

### Patient
- Register and log in securely.
- Submit health readings, including blood pressure, heart rate, SpO₂, and body temperature.
- Add remarks when submitting health records.
- View previously submitted health records.
- View alerts associated with submitted readings.
- Submit an emergency SOS record.

### Doctor
- View patients assigned to their account.
- Access the health history of assigned patients.
- Review submitted health readings and associated remarks.
- Add notes to patient records.
- View and manage alerts associated with patients.

### Administrator
- Manage patient and doctor accounts.
- Assign doctors to patients.
- View user and system information.

## Health Record and Alert Workflow

1. A patient logs in and manually enters their health readings.
2. The frontend sends the submitted information to the backend through a REST API.
3. The backend validates the request and stores the health record in MongoDB.
4. The application evaluates the submitted readings against configured thresholds and assigns a risk status.
5. If a reading meets a configured critical condition, an alert is generated for the patient and their assigned doctor.
6. The doctor can review the record and add notes for the patient.

**Note:** Risk categorization is based on configured rules and thresholds. It is not an AI/ML prediction model or a medical diagnosis.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcrypt |
| API Communication | REST APIs, Axios |
| Deployment | Vercel (Frontend), Render (Backend) |

## Application Architecture

AfterCare follows a client-server architecture.

- **Frontend:** React handles the user interface, dashboards, forms, and communication with the backend.
- **Backend:** Node.js and Express.js provide REST API endpoints, handle authentication, validate requests, and implement application logic.
- **Database:** MongoDB stores user accounts, health records, alerts, and emergency records.
- **Authentication and Authorization:** JWT-based authentication identifies logged-in users, while role-based access controls which resources and operations they can access.

### Data Flow

```text
Patient / Doctor / Admin
          |
          v
    React Frontend
          |
       REST API
          |
          v
   Node.js + Express
          |
   Validation & Logic
          |
          v
       MongoDB
```

## Project Structure

```text
aftercare/
│
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handling and application logic
│   ├── middleware/      # Authentication and validation
│   ├── models/          # MongoDB models
│   ├── routes/          # REST API routes
│   └── server.js        # Backend entry point
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── contexts/    # Application contexts
│       ├── pages/       # Application pages
│       ├── services/    # API communication
│       ├── App.js
│       └── index.js
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js and npm
- MongoDB instance (local or MongoDB Atlas)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Madhav-S13/aftercare.git
cd aftercare
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the required environment variables.

For example:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

Use the environment variable names expected by the backend configuration. Do not commit your `.env` file or expose database credentials.

Start the backend:

```bash
npm run dev
```

### 3. Configure the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

The frontend and backend should now be running locally. Configure the frontend API base URL to point to the backend address.

## API Modules

The backend exposes REST API routes organized around the following modules:

| Module | Responsibility |
|---|---|
| Authentication | User registration, login, and profile operations |
| Health Records | Submit readings, retrieve health history, and add doctor notes |
| Alerts | Retrieve, acknowledge, and resolve alerts |
| Administration | User management and doctor-patient assignment |
| Emergency | Submit and retrieve emergency records |

## Security and Access Control

- JWT-based authentication for protected API requests.
- Password hashing using bcrypt.
- Role-based access for patient, doctor, and administrator workflows.
- Backend request validation.
- CORS configuration for frontend-backend communication.

## Project Scope and Limitations

AfterCare is an academic full-stack application prototype. It demonstrates basic post-discharge monitoring workflows and communication between patients and assigned doctors.

- Health readings are entered manually by patients.
- The application does not connect to wearable devices or medical sensors.
- Risk categorization uses configured threshold-based rules, not machine learning.
- It does not provide medical diagnoses or replace professional medical advice.
- The application is not intended for production clinical use.

## Future Improvements

Potential improvements include:
- Integration with wearable health-monitoring devices.
- Real-time updates and notification services.
- More detailed health trend visualizations.
- Improved reporting and export functionality.
- Additional security and deployment hardening.

## Author

**Madhav S**  
B.Tech – Information Technology  
Kumaraguru College of Technology

[GitHub Repository](https://github.com/Madhav-S13/aftercare)
