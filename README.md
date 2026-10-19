# 🌉 SkillBridge

**SkillBridge** is a full-stack MERN web application that connects **volunteers** with **NGOs**. NGOs post volunteering opportunities with the skills they need, and volunteers can discover them, apply, and chat directly with organizations, all in real time.

🔗 **Live Demo:** [skillbridge-application.netlify.app](https://skillbridge-application.netlify.app)

---

## ✨ Features

### 👤 For Volunteers
- Register and log in as a volunteer
- Build a profile with bio, location, skills, and avatar
- Browse and search open volunteering opportunities
- Apply to opportunities and track application status (pending / accepted / rejected)
- Dashboard with application stats
- Real-time chat with NGOs

### 🏢 For NGOs
- Register and log in as an NGO with organization details
- Create, edit, and delete volunteering opportunities
- Specify required skills, duration, and location
- View and manage applications (accept / reject)
- Dashboard with opportunity and application overview
- Real-time chat with volunteers

### 🔔 Common
- JWT-based authentication and role-based access
- Real-time messaging with **Socket.IO**
- Live notifications (toast + notification page)
- Profile avatar upload via **Cloudinary**
- Responsive UI

---

## 🛠️ Tech Stack

| Layer     | Technologies |
|-----------|--------------|
| Frontend  | React 19, React Router v7, React Icons, React Toastify, Socket.IO Client |
| Backend   | Node.js, Express 5, Socket.IO |
| Database  | MongoDB with Mongoose |
| Auth      | JSON Web Tokens (JWT), bcryptjs |
| Uploads   | Multer, Cloudinary |
| Deployment| Netlify (frontend), Render (backend) |

---

## 📁 Project Structure

```
SkillBridge-App/
├── backend/
│   ├── config/            # Database config
│   ├── controllers/       # Auth, user, opportunity, application, message logic
│   ├── middleware/        # JWT auth (protect) & Cloudinary upload
│   ├── models/            # User, Opportunity, Application, Message, Notification
│   ├── routes/            # API route definitions
│   ├── index.js           # Express + Socket.IO server entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/        # Images and styles
│   │   ├── pages/         # Login, Register, Dashboards, Profiles, Opportunities, Messages...
│   │   ├── routes/        # AppRoutes.jsx (React Router setup)
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
│
└── README.md
```
---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)
- A [Cloudinary](https://cloudinary.com/) account (for avatar uploads)

### 1. Clone the repository

```bash
git clone https://github.com/Yashin-53/SkillBridge-App.git
cd SkillBridge-App
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:

```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Start the server:

```bash
npm run dev     # development (nodemon)
# or
npm start       # production
```

The backend runs on `http://localhost:8080`.

### 3. Setup the Frontend

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend/` folder:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

Start the app:

```bash
npm start
```

The frontend runs on `http://localhost:3000`.

---

## 🔌 API Overview

| Method | Endpoint                              | Description                              | Access     |
|--------|---------------------------------------|------------------------------------------|------------|
| POST   | `/api/auth/register`                  | Register a volunteer or NGO              | Public     |
| POST   | `/api/auth/login`                     | Log in and receive a JWT                 | Public     |
| GET    | `/api/users/profile`                  | Get logged-in user's profile             | Protected  |
| PUT    | `/api/users/profile`                  | Update profile (with avatar upload)      | Protected  |
| DELETE | `/api/users/profile/avatar`           | Remove profile avatar                    | Protected  |
| GET    | `/api/users/dashboard`                | Volunteer dashboard data                 | Volunteer  |
| GET    | `/api/users/dashboard-ngo`            | NGO dashboard data                       | NGO        |
| POST   | `/api/opportunities`                  | Create an opportunity                    | NGO        |
| GET    | `/api/opportunities`                  | Get all open opportunities               | Protected  |
| GET    | `/api/opportunities/my`               | Get NGO's own opportunities              | NGO        |
| GET    | `/api/opportunities/:id`              | Get a single opportunity                 | Protected  |
| PUT    | `/api/opportunities/:id`              | Update an opportunity                    | NGO        |
| DELETE | `/api/opportunities/:id`              | Delete an opportunity                    | NGO        |
| POST   | `/api/applications/apply/:opportunityId` | Apply to an opportunity               | Volunteer  |
| GET    | `/api/applications/my`                | Volunteer's applications                 | Volunteer  |
| GET    | `/api/applications/ngo`               | Applications to NGO's opportunities      | NGO        |
| PUT    | `/api/applications/:id`               | Accept / reject an application           | NGO        |
| GET    | `/api/messages/conversations`         | List chat conversations                  | Protected  |
| GET    | `/api/messages/:otherUserId`          | Chat history with a user                 | Protected  |
| GET    | `/api/notifications`                  | Get notifications and unread count       | Protected  |
| PUT    | `/api/notifications/:id/read`         | Mark a notification as read              | Protected  |

### Real-time Events (Socket.IO, namespace `/api`)
- `sendMessage` → client sends `{ receiver_id, content }`
- `receiveMessage` → server delivers a new chat message
- `newNotification` → server pushes a new notification

---

## 🗄️ Data Models

- **User**: name, email, password (hashed), role (`volunteer` | `ngo`), location, bio, avatar, skills, organization details
- **Opportunity**: ngo, title, description, required skills, duration, location, status (`open` | `closed`)
- **Application**: opportunity, volunteer, status (`pending` | `accepted` | `rejected`)
- **Message**: sender, receiver, content
- **Notification**: recipient, sender, content, link, read

---

## 🌐 Deployment

- **Frontend:** Netlify (build command: `npm run build`, publish directory: `build`)
- **Backend:** Render (start command: `npm start`)

Remember to set the environment variables on your hosting platforms and add your deployed frontend URL to the CORS origins in `backend/index.js`.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Made with ❤️ to bridge the gap between volunteers and NGOs.
