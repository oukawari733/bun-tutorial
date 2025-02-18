# 🚀 Backend Template

A clean and modular backend template built with **Bun.js** and **PostgreSQL**. This project provides a foundation for building RESTful APIs with database integration, input validation, and environment configuration.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Setup](#environment-setup)

---

## 🛠️ Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js Alternative**: [Bun.js](https://bun.sh/) (JavaScript runtime).
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Relational database).
- **Git**: For version control (optional but recommended).

---

## 💻 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/backend-template.git
cd backend-template

```

### Step 2: Install Dependencies

```bash
bun install

```
### Step 3: add postgresql

```bash
bun add pg

```

---

## ⚙️ Environment Setup

### Create a .env File
Copy the .env.example file to .env and fill in your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=your_database_name

```
---

## ▶️ Usage

### Start the Server
Run the server using Bun:

```env
bun run src/index.js

```
You can use hot reload

```env
bun --watch src/index.js

```
---