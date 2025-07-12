# 🔁 Skill Swap Platform

A collaborative AI-integrated **Skill Swap Platform** that enables users to list their skills and request others in return. Built to promote a barter-based service exchange system with secure authentication, admin moderation, and real-time interactions.

🎥 **Demo:** [Watch on YouTube](https://youtu.be/J-zRMQM3Ok8)

---

## 🧩 Problem Statement

Build a mini web application where:
- Users list skills they **offer** and **want**
- Swap requests can be sent, accepted, rejected, or deleted
- Users manage availability, profile visibility, and receive feedback
- Admins can ban users, reject inappropriate content, and download reports

---

## 👥 Team 1799 – Odoo Hackathon

### 👨‍💼 Team Leader
- **Name:** Jaimish Satani  
- **Email:** jaimishsatani@gmail.com  
- **Phone:** +91 97124 22126

### 👨‍💻 Team Members
- **Jasmin Radadiya** – jasminradadiya29@gmail.com – 8320711810  
- **Nakulkumar Rathod** – nakulrathod8586@gmail.com – 9081007646  
- **Hiren Savaliya** – hirenn158@gmail.com – 9016954158  

### 🧑‍🏫 Reviewer
- **Jitendra Kumar Prajapat (jipr)** – jipr@odoo.com

---

## 🚀 Features

### User Side
- 🔐 JWT Authentication (register/login/logout)
- 🧠 Skill Management (offered/wanted)
- 🔁 Skill Swap Requests (create, accept, reject, delete)
- 🌐 Search & Filter by skills
- 👤 Profile Photo Uploads
- ⭐ Ratings & Feedback after swaps
- 📱 Mobile-first responsive UI

### Admin Panel
- 🚫 Ban inappropriate users
- ❌ Reject skill descriptions
- 📊 View & download reports (users, swaps, feedback)
- 📢 Send platform-wide notifications

---

## 🛠️ Tech Stack

| Layer        | Technology                            |
|--------------|----------------------------------------|
| Frontend     | React.js, TailwindCSS, ShadCN/UI       |
| Backend      | Node.js, Express.js                    |
| Database     | MongoDB Atlas                          |
| Authentication | JWT                                  |
| File Uploads | Multer                                 |
| State Management | React Context API                  |
| Deployment   | Vercel (Frontend), Render (Backend)    |

---

# Clone the repo
git clone https://github.com/jaimishsatani/SkillSwap-Odoo.git
cd SkillSwap-Odoo

# Frontend Setup
cd frontend
npm install
npm start

# Backend Setup
cd ../backend
npm install
npm run dev

## 🔐 Authentication & Roles

- **Public Users**: View public profiles and skills
- **Registered Users**: Manage profile, request swaps
- **Admin**: Moderate content, download data, broadcast alerts

