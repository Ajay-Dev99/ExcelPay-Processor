# ExcelPay Processor

## Overview
A full-stack application where authenticated users upload Excel files containing employee salary data. Files are processed asynchronously in the background, CTC is calculated per employee, and users are notified in real-time via WebSockets and email when processing completes.

---

## Tech Stack
- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL + Prisma ORM
- **Queue**: BullMQ + Redis
- **WebSockets**: Socket.io
- **Auth**: JWT + bcrypt
- **Email**: Nodemailer
- **Excel Parsing**: ExcelJS (streaming)

---

## Prerequisites
- Node.js >= 18
- MySQL running on port 3306
- Redis running on port 6379

---

## Environment Variables

### Backend
Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://root:yourpassword@127.0.0.1:3306/ExcelPayprocessor"
JWT_SECRET=your_jwt_secret_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### Frontend
Create a `.env` file inside the `frontend/` folder:
```env
VITE_API_URL=http://localhost:5000
```

> A `.env.example` file is provided in both `backend/` and `frontend/` for reference.

---

## Setup & Run

### 1. Clone the repository
```bash
git clone https://github.com/Ajay-Dev99/ExcelPay-Processor.git
cd ExcelPay-Processor
```

### 2. Start Redis
**Windows** (using WSL or Redis installer):
```bash
redis-server
```
**Mac**:
```bash
brew services start redis
```
**Linux**:
```bash
sudo systemctl start redis
```

### 3. Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```
> `prisma migrate dev` automatically runs the seed — no need to run it separately.

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔔 Browser Notifications

When you open the dashboard for the first time, the browser will ask:

> **"Allow ExcelPay Processor to send notifications?"**

Click **Allow** to receive real-time desktop notifications when:
- ✅ File processing completes — shows filename + total rows processed
- ❌ File processing fails — shows filename + error message

> Notifications work even when the browser tab is minimized or in the background.
> If you accidentally blocked notifications, re-enable them from your browser settings:
> **Chrome**: Settings → Privacy & Security → Site Settings → Notifications

### 5. Open in browser
```
http://localhost:5173
```

## Seed User (for evaluation)

| Email | Password |
|-------|----------|
| lusaibnetstager@gmail.com | password123 |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/auth/signup | No | Register |
| POST | /api/v1/auth/login | No | Login |
| POST | /api/v1/upload | Yes | Upload Excel file |
| GET | /api/v1/upload | Yes | Upload history |
| GET | /api/v1/upload/:id/status | Yes | Upload status |
| GET | /health | No | Health check |

---

## Excel File Format

| Column | Field |
|--------|-------|
| A | Employee ID |
| B | Employee Name |
| C | Department |
| D | Basic Pay |
| E | Variable Pay |
| F | Allowance |
| G | Bonus |

**CTC = Basic Pay + Variable Pay + Allowance + Bonus**

---

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| join-room | Client → Server | Join user-specific room |
| upload-progress | Server → Client | Rows processed so far |
| upload-completed | Server → Client | Processing done |
| upload-failed | Server → Client | Processing failed |

---

## Architecture

1. User uploads Excel file → Multer saves to disk (max 100MB, .xlsx only)
2. Upload record created in MySQL → BullMQ job queued immediately
3. API responds instantly — does not wait for processing to finish
4. Worker streams Excel file row by row (no full file load into memory)
5. Rows inserted into MySQL in batches of 500
6. Socket.io notifies only the uploading user via private room
7. Email sent to user on completion

---

## Assumptions & Trade-offs

- **Streaming over readFile** — ExcelJS streaming handles 2M+ rows without OOM crashes
- **Batch size 500** — Balances memory usage and DB insert performance
- **Indeterminate progress bar** — totalRows not counted upfront to avoid memory overhead
- **Per-user socket rooms** — Users only receive their own upload events
- **BullMQ jobId deduplication** — Prevents the same upload from being processed twice
- **File deleted after processing** — Prevents disk accumulation on the server