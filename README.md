# 🔐 AuthService – Modern Authentication API (Node.js + MongoDB)

A complete **authentication and authorization system** built using **Node.js**, **Express**, and **MongoDB**.  
Includes **user registration**, **login**, **email verification**, **password reset via email**, and **JWT-based authentication** — all secured and production-ready.

---

## 🚀 Features

✅ **User Registration** with email + password  
✅ **Email Verification** via secure link  
✅ **User Login** with JWT Token  
✅ **Protected Routes** using Middleware  
✅ **Forgot Password & Reset via Email Code**  
✅ **Token Expiration & Secure Hashing (bcrypt)**  
✅ **Clean Project Structure & Easy to Extend**

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express  
- **Database:** MongoDB (Mongoose ORM)  
- **Authentication:** JSON Web Token (JWT)  
- **Password Security:** bcrypt  
- **Email Service:** Nodemailer (Gmail SMTP)  
- **Environment Config:** dotenv  
- **CORS Enabled** for API testing via Postman

---

## ⚙️ Environment Variables (.env)

```env
MONGO_URI=mongodb://127.0.0.1:27017/AuthService
JWT_SECRET=supersecretkey123
PORT=5000

EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_app_password

---

# 1️⃣ Install dependencies
npm install

# 2️⃣ Start MongoDB locally or use MongoDB Atlas

# 3️⃣ Run the server
npm start


---

📧 Email Verification Flow

User registers via /auth/register

An email is sent with a verification link

When clicked, it activates their account

The user can now login securely

🧠 Security Highlights

Passwords are hashed with bcrypt

JWT tokens stored safely in headers

Email verification ensures valid accounts only

Secure token expiry system for both JWT & verification



