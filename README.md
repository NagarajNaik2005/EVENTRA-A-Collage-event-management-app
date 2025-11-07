# 🎉 EVENTRA – College Event Management Web App

**Eventra** is a full-stack web application designed to simplify and automate college event management.  
Students can log in, view upcoming and recent events, register for cultural or sports sub-events, and track their registrations in a personal dashboard.

---

## 🚀 Features

- 🔐 **Student Login** using name, email, contact number, and USN  
- 🏠 **Home Page** showing upcoming and recently held events  
- 📅 **Event Details** dialog with sub-events and registration option  
- 🧾 **Dashboard** for students to view their registered events  
- ❌ **Cancel Registration** functionality  
- 📞 **Contact Page** for college information  
- 💾 **Superbase Database Integration** for real-time data storage  
- 🌙 **Responsive UI** built with Tailwind CSS and React (Vite + TypeScript)

---

## 🧠 Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Backend:** Node.js, Express.js  
**Database:** Vite Superbase 

---

## ⚙️ Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/NagarajNaik2005/EVENTRA-A-Collage-event-management-app.git
   cd EVENTRA-A-Collage-event-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Edit the `.env` file** in the root directory and add the following variables:

   ```bash
   VITE_SUPABASE_PROJECT_ID="your superbase project id"
   VITE_SUPABASE_PUBLISHABLE_KEY="your publishable key"
   VITE_SUPABASE_URL="your superbase url"
   ```

   ⚠️ **Important:**  
   Make sure to **update your Superbase connection address** in the `.env` file before running the project.

4. **Start the development servers**
   - Backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend:
     ```bash
     cd frontend
     npm run dev
     ```

---

## 📂 Project Structure

```
eventra/
│
├── frontend/          # React + TypeScript + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
│
├── backend/           # Node.js + Express + MongoDB backend
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 💡 How It Works

1. Student logs in using their details → a JWT token is generated.  
2. Home page displays upcoming and recent events fetched from Superbase.  
3. Students can view event details and register for sub-events.  
4. Dashboard shows all registered events for the logged-in student.  
5. Registrations are stored securely in Superbase.

---

## 🖼️ Screenshots

| Login Page | Home Page | Dashboard |
|-------------|------------|------------|
| *(Add screenshots here)* | *(Add screenshots here)* | *(Add screenshots here)* |

---

## 🔮 Future Enhancements

- Admin panel for event creation and management  
- Email/SMS confirmation on registration  
- Certificate generation for participants  
- Event analytics dashboard

---

## 🧑‍💻 Developed By

**Nagaraj Naik**  
B.E. Computer Science and Engineering  
[LinkedIn](https://www.linkedin.com/in/nagaraj-naik-2995852ba) | [GitHub](https://github.com/NagarajNaik2005)

---

⭐ **If you like this project, don't forget to give it a star on GitHub!**
