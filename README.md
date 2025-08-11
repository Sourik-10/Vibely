# Vibely

Vibely is a real-time chat and video calling application built with **React**, **Node.js**, **Express**, and **Socket.IO**, featuring user authentication (via JWT and cookies), profile onboarding, and one-on-one chat with video call support. It uses **MongoDB Atlas** for storage, **Stream** for chat infrastructure, and **Cloudinary** for profile assets.

## Features
- Sign Up / Login / Logout with JWT authentication
- Secure session management via HTTP-only cookies (`SameSite=None`, `Secure`)
- Profile onboarding (full name, bio, languages, location)
- Real-time chat and video calling using Socket.IO
- Stream integration for chat persistence
- Tailwind CSS + DaisyUI for modern styling
- Frontend hosted on Vercel, backend on Render

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Socket.IO, Stream SDK
- **Frontend:** React, React Router, React Query (TanStack), Tailwind CSS, DaisyUI
- **Authentication:** JWT stored in HTTP-only cookies for secure cross-domain flows
- **Infrastructure:** Cloudinary for avatars, MongoDB Atlas, Vercel (frontend), Render (backend)

## Getting Started

### Clone & Install
```bash
git clone https://github.com/Sourik-10/Vibely.git
cd Vibely
```

Install dependencies for both backend and frontend:
```bash
cd backend
npm install

cd ../frontend
npm install
```

### Environment Variables

#### Backend (`/backend/.env`)
```
PORT=5001
MONGO_URI=<your MongoDB connection string>
JWT_SECRET_KEY=<your secret>
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`/frontend/.env`)
```
VITE_API_BASE_URL=http://localhost:5001/api
```

### Run Locally
Start the backend:
```bash
cd backend
npm run dev
```

Start the frontend:
```bash
cd frontend
npm run dev
```

### Deployments
- Frontend on **Vercel**
- Backend on **Render**
- Make sure `FRONTEND_URL` in backend `.env` matches the deployed frontend URL
- Use these cookie settings in production:
```js
sameSite: NODE_ENV === "production" ? "none" : "lax"
secure: NODE_ENV === "production"
```

## Troubleshooting
- **401 Unauthorized after login:** Check that cookies are sent with `withCredentials: true` in frontend Axios requests.
- **CORS issues:** Ensure backend CORS config allows your frontend origin and `credentials: true`.
- **Token expired:** Login again or adjust JWT expiry.

---

## Author
**Sourik-10** – Creator and maintainer of Vibely

Enjoy Vibely — your space to chat and connect in real-time!
