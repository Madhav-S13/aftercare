# Remote Patient Health Monitoring System 🏥

A full-stack, production-ready web application enabling doctors to monitor patients remotely after hospital discharge, featuring AI-based predictive healthcare, intelligent automation, patient safety features, and engagement tools.

## 🌟 Core Features

### For Patients
- 📊 **Daily Health Data Submission** - Submit vitals (BP, Heart Rate, SpO₂, Temperature)
- 🎙️ **Voice-Based Data Entry** - Hands-free health data input (optimized for elderly users)
- 📈 **Personal Health Trends** - Interactive charts showing health progress
- 🎮 **Gamification** - Health streaks, badges, and consistency scores
- 🚨 **Emergency SOS** - One-click emergency alert with location sharing
- 💬 **Doctor Feedback** - View medical advice and recommendations
- 📴 **Offline Mode** - Capture data offline, auto-sync when online

### For Doctors
- 👥 **Patient Management** - View all assigned patients
- 🔍 **Real-time Monitoring** - Monitor patient health data in real-time
- 📊 **Advanced Analytics** - Trend analysis and health statistics
- 🔔 **Intelligent Alerts** - Receive notifications for abnormal conditions
- 📝 **Medical Notes** - Add professional notes to patient records
- 📄 **Download Reports** - Generate PDF health reports

### For Administrators
- 👤 **User Management** - Manage patients, doctors, and admins
- 🔗 **Doctor Assignment** - Assign doctors to patients
- 📊 **System Analytics** - Monitor platform usage and statistics
- 📋 **Audit Logs** - Track system activity

## 🧠 AI & Innovation Features

1. **AI-Based Health Risk Prediction**
   - Analyzes patient vitals against normal ranges
   - Categorizes risk: Normal (0-40), Warning (41-70), Critical (71-100)
   - Trend detection for early intervention

2. **Intelligent Alert & Escalation System**
   - Auto-detects threshold violations
   - Color-coded alerts (Green/Yellow/Red)
   - Multi-level escalation (Patient → Doctor → Emergency)

3. **Smart Decision Support**
   - Auto-summarizes patient conditions
   - Highlights anomalies
   - Suggests next medical actions

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Web Speech API** - Voice recognition

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **PDFKit** - Report generation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
# If you haven't already
cd /Users/dharani/Desktop/patientCare
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend

# Install dependencies
npm install

# The .env file is already configured with defaults
# Update MONGODB_URI if using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/patientcare

# Start MongoDB (if using local)
# mongod

# Start backend server
npm run dev
# Server will run on http://localhost:5000
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd ../frontend

# Install dependencies
npm install

# Start frontend development server
npm start
# Application will run on http://localhost:3000
\`\`\`

## 👥 User Roles & Test Accounts

After starting the application, you can create accounts with these roles:

1. **Patient** - Regular users who submit health data
2. **Doctor** - Medical professionals who monitor patients
3. **Admin** - System administrators

### Creating Test Users
1. Go to http://localhost:3000/signup
2. Select role (Patient/Doctor/Admin)
3. Fill in details and create account

## 📱 Usage Guide

### For Patients

1. **Submit Health Data:**
   - Login → Dashboard → "Submit Health Data"
   - Enter vitals manually or use voice input
   - View instant risk analysis

2. **Voice Input:**
   - Click "Voice Input" button
   - Say: "Blood pressure 120 over 80, heart rate 75, oxygen 98, temperature 98.6"
   - Values will auto-populate

3. **Emergency SOS:**
   - Click red "SOS" button in header
   - Alerts doctor and emergency contacts immediately

### For Doctors

1. **Monitor Patients:**
   - View list of assigned patients
   - Click patient to see detailed health history
   - Add medical notes to records

2. **Manage Alerts:**
   - View all active alerts
   - Acknowledge or resolve alerts
   - Contact patients as needed

### For Admins

1. **Assign Doctors:**
   - Go to "Assign Doctor" tab
   - Copy patient ID and doctor ID from respective tabs
   - Submit assignment

2. **View Statistics:**
   - Dashboard shows system-wide analytics
   - Monitor user activity and alerts

## 🏗️ Project Structure

\`\`\`
patientCare/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper functions (AI risk analysis)
│   ├── .env             # Environment variables
│   └── server.js        # Express server entry point
│
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── contexts/    # React contexts (Auth)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service
│   │   ├── App.js       # Main app component
│   │   └── index.js     # React entry point
│   └── package.json
│
└── README.md
\`\`\`

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Role-Based Access Control** - Route protection by user role
- **Input Validation** - Express-validator for data sanitization
- **CORS Configuration** - Controlled cross-origin requests

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Health Data
- `POST /api/health` - Submit health data
- `GET /api/health/history` - Get patient history
- `GET /api/health/patient/:id` - Get patient data (doctor)
- `PUT /api/health/:id/notes` - Add doctor notes

### Alerts
- `GET /api/alerts` - Get patient alerts
- `GET /api/alerts/doctor` - Get doctor alerts
- `PUT /api/alerts/:id/acknowledge` - Acknowledge alert
- `PUT /api/alerts/:id/resolve` - Resolve alert

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get system statistics
- `POST /api/admin/assign-doctor` - Assign doctor to patient
- `GET /api/admin/patients` - Get all patients
- `GET /api/admin/doctors` - Get all doctors

### Emergency
- `POST /api/emergency` - Trigger SOS
- `GET /api/emergency` - Get emergency records

## 🎯 Software Engineering Practices

1. **Incremental Development Model** - Built in 15 progressive phases
2. **MVC Architecture** - Clear separation of concerns
3. **Modular Design** - Reusable components and utilities
4. **Error Handling** - Comprehensive try-catch and validation
5. **RESTful API** - Standard HTTP methods and status codes
6. **Responsive Design** - Mobile-first approach

## 🚢 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set environment variables
5. Deploy

### Frontend (Render/Vercel/Netlify)
1. Build production bundle: `npm run build`
2. Deploy build folder to hosting service
3. Set API URL environment variable

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally
- Check MONGODB_URI in backend/.env
- For Atlas, whitelist your IP address

### CORS Errors
- Verify FRONTEND_URL in backend/.env matches your frontend URL
- Check CORS configuration in backend/server.js

### Voice Input Not Working
- Use Chrome or Edge browser
- Allow microphone permissions
- Check console for Speech Recognition API support

## 📝 License

MIT License - feel free to use this project for educational purposes.

## 👨‍💻 Developer

Built with ❤️ for advancing remote healthcare monitoring.

## 📞 Support

For issues or questions, please check the troubleshooting section or review the code documentation.

---

**Note:** This is an academic project demonstrating modern full-stack development with healthcare-focused features. For production use, additional security audits, HIPAA compliance measures, and thorough testing are recommended.
