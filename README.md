# WeCare Hospital 🏥
> Full-Stack Hospital Management & Appointment Booking Platform with an AI-Powered Doctor Recommendation Assistant.

---

## 🌟 Overview

**WeCare Hospital** is a modern, responsive, and production-ready full-stack web application designed for comprehensive hospital management and patient appointment booking. 

The standout flagship feature is the **AI Doctor Recommendation Assistant**, powered by the Google Gemini API. When patients aren't sure which medical department or specialist to consult, they can describe their symptoms in everyday natural language (e.g., *"I have had a sore throat for three days and it hurts when I swallow"*). The AI assistant evaluates the clinical symptoms, recommends the exact hospital department, and presents verified specialists available in the hospital database. Patients can then click **"Book Appointment"** to immediately open the booking workflow with that doctor automatically selected!

---

## 🚀 Key Features

1. **Modern Responsive UI/UX**:
   - Clean, professional healthcare design built with React, Vite, Tailwind CSS, and Lucide Icons.
   - Fully optimized for mobile, tablet, and desktop screens.
   - Emergency banner with 24/7 hotline (`1-800-WECARE-911`) and quick trauma triage.

2. **9 Clinical Departments**:
   - Cardiology, Dermatology, Neurology, Orthopedics, Pediatrics, ENT, General Medicine, Gynecology & Obstetrics, Dental & Oral Surgery.
   - Department descriptions, featured symptoms, doctor counts, and direct booking links.

3. **Specialist Doctor Directory**:
   - 18+ verified board-certified physicians with biographies, qualifications, experience, weekly schedule slots, and consultation fees.
   - Real-time search by name, condition, or clinical specialty.
   - Filter by department.

4. **Complete Appointment Booking**:
   - Interactive booking form with department, doctor, date, time slot, and patient contact details.
   - Automatically generates unique reference numbers (e.g., `WCH-2026-552591`).
   - Default initial status set to `Pending`.
   - Instant printable confirmation modal.

5. **Real-Time Track Booking**:
   - Patients track their booking anytime using their Booking Reference ID.
   - Visual 3-stage progress timeline: **Pending** ➔ **Waiting** ➔ **Confirmed**.
   - Displays real-time updates directly from MongoDB.

6. **AI Doctor Recommendation Assistant (Gemini API)**:
   - Modern ChatGPT-style chat interface with example symptom prompt chips.
   - Contextual understanding of symptoms, pain points, and health queries.
   - Evaluates symptoms against existing database records (never hallucinates non-existent doctors).
   - Strict medical safety safeguards: Never prescribes medication or dosages; provides clinical guidance disclaimers; flags emergency red flags (e.g., chest pain, shortness of breath) with immediate 911 alert banners.
   - Seamless one-click transition: Clicking "Book Appointment" on a recommended doctor pre-populates the booking form.
   - Graceful offline fallback: If the Gemini API key is missing or unavailable, displays helpful options ("Browse Departments", "View Doctors", "Book Appointment") without crashing.

7. **Admin Hospital Portal (JWT Authenticated)**:
   - Secure login (`/admin/login`) with bcrypt password hashing and signed JWT tokens.
   - Comprehensive dashboard showing hospital KPI metrics (Total Bookings, Pending, Waiting, Confirmed).
   - Patient bookings management table with real-time status toggling (**Confirm** and **Waiting**).
   - Changes immediately reflect on the patient's Track Booking page.

---

## 🛠️ Tech Stack

- **Frontend**: React.js 18, Vite 5, Tailwind CSS 3, Lucide React, React Router v6
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose (with resilient in-memory fallback for instant zero-configuration local runs)
- **Authentication**: JSON Web Tokens (JWT) + Bcrypt.js
- **AI Engine**: Google Gemini API (`@google/generative-ai`)
- **Language**: JavaScript (ES6+ / CommonJS)

---

## 📂 Project Structure

```text
wecare-hospital/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                   # Sticky header with emergency bar & AI CTA
│   │   │   ├── Footer.jsx                   # Comprehensive medical footer & disclaimer
│   │   │   ├── DoctorCard.jsx               # Doctor card with schedule & booking button
│   │   │   ├── DepartmentCard.jsx           # Department card with doctor previews
│   │   │   ├── BookingConfirmationModal.jsx # Printable receipt modal on booking
│   │   │   └── FloatingAITrigger.jsx        # Floating AI prompt pill on all pages
│   │   ├── pages/
│   │   │   ├── Home.jsx                     # Hero section, CTAs, departments & doctors preview
│   │   │   ├── About.jsx                    # Hospital history, mission, philosophy & facilities
│   │   │   ├── Departments.jsx              # Full listing of 9 departments with search
│   │   │   ├── Doctors.jsx                  # Filterable directory of 18+ doctors
│   │   │   ├── BookAppointment.jsx          # Complete appointment booking form
│   │   │   ├── TrackBooking.jsx             # Real-time status lookup & timeline stepper
│   │   │   ├── AIAssistant.jsx              # ChatGPT-style symptom triage assistant
│   │   │   ├── AdminLogin.jsx               # Secure admin authentication page
│   │   │   └── AdminDashboard.jsx           # Admin appointment status management table
│   │   ├── services/
│   │   │   └── api.js                       # Unified REST API client
│   │   ├── App.jsx                          # Main routing & scroll handler
│   │   ├── index.css                        # Tailwind directives & custom animations
│   │   └── main.jsx                         # React entry point
│   ├── package.json                         # Frontend dependencies
│   ├── vite.config.js                       # Vite configuration & /api proxy to port 5000
│   ├── tailwind.config.js                   # Medical color theme configuration
│   └── index.html                           # HTML template with medical favicon
│
├── backend/
│   ├── config/
│   │   └── db.js                            # MongoDB connection with resilient fallback
│   ├── controllers/
│   │   ├── departmentController.js          # Department endpoints
│   │   ├── doctorController.js              # Doctor listing & query endpoints
│   │   ├── appointmentController.js         # Booking & tracking endpoints
│   │   ├── adminController.js               # Admin auth & status update endpoints
│   │   └── aiController.js                  # Gemini recommendation endpoint
│   ├── models/
│   │   ├── Department.js                    # Mongoose schema for hospital departments
│   │   ├── Doctor.js                        # Mongoose schema for specialist doctors
│   │   ├── Appointment.js                   # Mongoose schema for patient bookings
│   │   └── Admin.js                         # Mongoose schema for admin authentication
│   ├── middleware/
│   │   ├── auth.js                          # JWT route protection middleware
│   │   └── errorHandler.js                  # Centralized error handler
│   ├── routes/
│   │   ├── departmentRoutes.js              # /api/departments
│   │   ├── doctorRoutes.js                  # /api/doctors
│   │   ├── appointmentRoutes.js             # /api/appointments
│   │   ├── adminRoutes.js                   # /api/admin
│   │   └── aiRoutes.js                      # /api/ai
│   ├── services/
│   │   ├── dataService.js                   # Data access layer & seeding store
│   │   └── geminiService.js                 # Gemini AI integration with clinical safeguards
│   ├── data/
│   │   └── seedData.js                      # Seed data: 9 departments, 18+ doctors, sample bookings
│   ├── scripts/
│   │   └── seed.js                          # Standalone seeding script
│   ├── server.js                            # Express server & static asset handler
│   ├── .env.example                         # Safe template for environment variables
│   ├── .env                                 # Local configuration (never committed to git)
│   └── package.json                         # Backend dependencies
│
├── .gitignore                               # Excludes node_modules, .env, dist, and secrets
├── package.json                             # Root orchestrator scripts
└── README.md                                # Comprehensive documentation
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- *(Optional)* **MongoDB** (Local instance or MongoDB Atlas connection string)
- *(Optional)* **Gemini API Key** (from Google AI Studio)

### 1. Clone or Open the Repository
Open the project directory in VS Code or your terminal:
```bash
cd wecare-hospital
```

### 2. Install Dependencies

You can install all dependencies across both folders in one command from the root directory:
```bash
npm run install:all
```

Or install individually:
```bash
# In backend folder
cd backend
npm install

# In frontend folder
cd ../frontend
npm install
```

---

## ⚙️ Environment Variables Configuration

Copy `backend/.env.example` to `backend/.env`:
```bash
cd backend
cp .env.example .env
```

Here is the configuration format:

```env
# Server Port
PORT=5000
NODE_ENV=development

# MongoDB Connection
# If local MongoDB is running:
MONGODB_URI=mongodb://127.0.0.1:27017/wecare_hospital
# If using MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/wecare_hospital?retryWrites=true&w=majority

# Google Gemini API Key (Obtain from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@wecare.com
ADMIN_PASSWORD=AdminPassword123!

# JWT Secret
JWT_SECRET=wecare-hospital-production-jwt-secret-key-2026
```

> 💡 **Zero-Config Resilient Local Mode**: If you do not have MongoDB running locally, the server automatically boots into **resilient in-memory mode**! All operations (creating bookings, changing statuses to Confirmed/Waiting, tracking bookings, and logging in as admin) work 100% out-of-the-box!

---

## 🔑 How to Configure Gemini API

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account and click **"Create API Key"**.
3. Copy the generated key.
4. Open `backend/.env` and paste your key:
   ```env
   GEMINI_API_KEY=AIzaSy...your_actual_key_here
   ```
5. Restart the backend server. The AI assistant will now connect directly to Gemini with structured output validation!
*(If no key is configured, the assistant automatically uses the built-in clinical symptom engine and provides direct fallback options without crashing).*

---

## 🖥️ Running the Application

### Option A: Run Both in Development Mode (Recommended for VS Code)

Open **two terminal tabs** in VS Code:

**Terminal 1 (Backend API):**
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000`.*

**Terminal 2 (Frontend Dev Server):**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173` (with `/api` automatically proxied to port 5000).*

---

### Option B: Run Full-Stack from Express (Single Command)

Build the frontend once:
```bash
cd frontend
npm run build
```

Then start the backend:
```bash
cd ../backend
npm start
```
Open your browser at **`http://localhost:5000`** — Express serves both the React application and all REST API endpoints!

---

## 🧪 Testing the Application (Step-by-Step)

### 1. Test Home & Navigation
- Visit `http://localhost:5173` (or `http://localhost:5000`).
- Check the emergency hotline bar (`1-800-WECARE-911`), hospital introduction, and interactive CTAs: **"Book an Appointment"** and **"Not Sure Which Doctor to Choose? Ask AI"**.
- Navigate through **About**, **Departments**, and **Doctors**.

### 2. Test AI Doctor Recommendation Assistant
- Click **"Ask AI Doctor"** in the navigation bar or on any page.
- Click any of the example prompts (e.g., *"I have had a sore throat for three days and it hurts when I swallow."*).
- Observe the AI recommendation:
  - Suggests **ENT (Otolaryngology)**.
  - Displays real ENT specialists (e.g., **Dr. Lucas Zhao**).
  - Outlines clinical rationale and medical safety disclaimer.
- Click **"Book Appointment"** on the recommended doctor's card:
  - The booking page opens with Dr. Lucas Zhao and ENT automatically pre-selected!

### 3. Test Appointment Booking
- In the booking form, verify the doctor and department.
- Enter patient details:
  - Name: `Jane Doe`
  - Email: `jane.doe@example.com`
  - Phone: `+1 (555) 987-6543`
  - Date: Select tomorrow's date
  - Time Slot: `10:30 AM`
  - Reason: `Persistent throat discomfort`
- Click **"Confirm & Submit Appointment"**.
- Notice the **Booking Confirmation Modal** showing your official **Booking ID** (e.g. `WCH-2026-XXXXXX`) and initial status `Pending`.

### 4. Test Track Booking
- Click **"Track This Booking Now"** or visit the **Track Booking** tab.
- Enter your Booking ID.
- Verify that the 3-step timeline indicates **Status: Pending**.

### 5. Test Admin Login & Status Updates
- Visit `http://localhost:5173/admin/login`.
- Login with default credentials:
  - **Username**: `admin`
  - **Password**: `AdminPassword123!`
- In the Admin Dashboard:
  - Find Jane Doe's booking.
  - Click the green **"Confirm"** button.
  - Notice the status immediately changes to `Confirmed` and KPI numbers update.
- Switch back to the **Track Booking** tab and click **"Refresh Status"**:
  - The status on the patient tracking timeline immediately updates to **Confirmed**!
  - Test changing another booking to **Waiting** to verify the amber badge.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Service health check | No |
| `GET` | `/api/departments` | List all departments with doctor counts | No |
| `GET` | `/api/departments/:id` | Get single department details and doctors | No |
| `GET` | `/api/doctors` | List doctors (supports `?department=` and `?search=`) | No |
| `GET` | `/api/doctors/:id` | Get doctor details by ID | No |
| `POST` | `/api/appointments` | Create new patient appointment (Generates Booking ID, Status: `Pending`) | No |
| `GET` | `/api/appointments/:bookingId`| Track appointment by Booking ID | No |
| `POST` | `/api/ai/doctor-recommendation`| Gemini-powered symptom triage & doctor recommendation | No |
| `POST` | `/api/admin/login` | Administrator authentication & JWT generation | No |
| `GET` | `/api/admin/appointments` | Retrieve all appointments (supports `?status=`) | **Yes (JWT)** |
| `PATCH`| `/api/admin/appointments/:id/status`| Update status (`Confirmed`, `Waiting`, `Pending`) | **Yes (JWT)** |
| `GET` | `/api/admin/stats` | Hospital overview KPI metrics | **Yes (JWT)** |

---

## 🚢 Deployment Guide

### Deploying Backend to Render / Railway / Heroku
1. Push your repository to GitHub (with `.gitignore` active).
2. Create a new **Web Service** pointing to the repository.
3. Set the Root Directory to `backend`.
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`
6. Add Environment Variables in the platform's settings:
   - `MONGODB_URI`: Your MongoDB Atlas connection URI
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `JWT_SECRET`: A long random secret string
   - `ADMIN_USERNAME`: `admin`
   - `ADMIN_PASSWORD`: Your strong admin password

### Deploying Frontend to Vercel / Netlify
1. Create a new project pointing to your GitHub repository.
2. Set Root Directory to `frontend`.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Set Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-app.onrender.com/api`

---

## ⚖️ Medical Disclaimer

The AI Doctor Recommendation Assistant and hospital website content are designed for educational, informational, and appointment-scheduling assistance. They do not constitute formal medical diagnosis, disease identification, or pharmacological prescription. Patients experiencing acute or life-threatening symptoms should always seek immediate in-person emergency care by dialing 911 or visiting the nearest hospital emergency room.

---

## 📄 License
This project is licensed under the ISC License. © 2026 WeCare Hospital Healthcare Systems.
