# CampusAI — AI-Native College ERP & Placement Management System

CampusAI is a role-based college ERP backend that manages academics, faculty, and placements, with AI-driven features (performance prediction, placement insights, and a parent dashboard) currently in development.

> Built from scratch as a step-by-step learning and portfolio project — architecture, backend, testing, and (in progress) AI integration.

---

## ✨ Features

- **Authentication & Authorization** — JWT-based login with Role-Based Access Control (RBAC) for students, faculty, and admins
- **Academic Management** — students, faculty, courses, subjects, enrollments, attendance, marks, faculty assignments, and timetables
- **Robust API layer** — standardized REST responses, centralized error handling, request validation
- **Backend engineering** — async error handling, structured logging, filtering, sorting, and pagination
- **Fully documented API** — interactive Swagger/OpenAPI docs
- **Tested** — Jest + Supertest + MongoDB Memory Server covering CRUD, validation, RBAC, and business rules

### 🚧 In Progress
- AI-driven student performance prediction
- Placement-outcome insights
- Parent dashboard
- LangChain + RAG-based features on a vector database (Pinecone/Qdrant)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, RBAC |
| Testing | Jest, Supertest, MongoDB Memory Server |
| API Docs | Swagger (OpenAPI) |
| Planned (AI layer) | LangChain, RAG, OpenAI API / open-source LLMs, Pinecone/Qdrant |
| Planned (Frontend) | React, TypeScript, Tailwind CSS |
| Planned (Infra) | Docker, AWS, Nginx, GitHub Actions (CI/CD) |

---

## 📂 Project Structure

```
campusai/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── middleware/      # Auth, RBAC, validation, error handling
│   ├── config/          # DB connection, env config
│   └── utils/           # Logging, helpers
├── tests/                # Jest + Supertest test suites
├── docs/                 # Swagger/OpenAPI spec
├── .env.example
└── package.json
```
*(adjust to match your actual folder layout)*

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/Aashutosh-arnay/campusai.git
cd campusai
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### Run the app

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### API Documentation

Once running, view interactive Swagger docs at:
```
http://localhost:5000/api-docs
```

---

## 🧪 Testing

This project uses **Jest**, **Supertest**, and **MongoDB Memory Server** for isolated, in-memory integration testing — covering CRUD operations, input validation, RBAC permission checks, and core business rules.

```bash
npm test
```

---

## 🗺️ Roadmap

- [x] Role-based authentication & authorization
- [x] Core academic management modules
- [x] Swagger API documentation
- [x] Automated test suite
- [ ] AI-based performance prediction engine
- [ ] Placement-outcome insights dashboard
- [ ] Parent dashboard
- [ ] RAG-based Q&A over student/placement data
- [ ] Dockerized deployment on AWS with CI/CD

---

## 👤 Author

**Aashutosh Kumar**
B.Tech CS, GLA University, Mathura | AWS Certified Cloud Practitioner

- LinkedIn: [linkedin.com/in/ashutosh-arnay](https://www.linkedin.com/in/ashutosh-arnay)
- Email: aashutosh.kumar_cs23@gla.ac.in

---

## 📄 License

This project is currently unlicensed / for portfolio purposes. *(Add a license — e.g., MIT — if you want others to freely use/contribute to the code.)*
