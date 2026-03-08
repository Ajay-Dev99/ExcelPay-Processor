import { useState } from "react";

function CopyBlock({ label, code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mb-4">
      {label && <p className="text-xs text-gray-400 mb-1 font-mono">{label}</p>}
      <div className="relative">
        <pre className="bg-gray-950 border border-gray-700 text-green-400 text-sm rounded-lg p-4 overflow-x-auto font-mono whitespace-pre-wrap">
          {code}
        </pre>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1 rounded"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default function Readme() {
  const [allCopied, setAllCopied] = useState(false);

  const fullReadme = `# ExcelPay Processor

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

Create a \`.env\` file inside the \`backend/\` folder:

\`\`\`env
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
\`\`\`

> For Gmail, use an App Password (not your account password).
> Generate one at: https://myaccount.google.com/apppasswords

---

## Setup & Run

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/Ajay-Dev99/ExcelPay-Processor.git
cd ExcelPay-Processor
\`\`\`

### 2. Backend
\`\`\`bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
\`\`\`

### 3. Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### 4. Open in browser
\`\`\`
http://localhost:5173
\`\`\`

---

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
| C | Basic Pay |
| D | Variable Pay |
| E | Allowance |
| F | Bonus |

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
1. User uploads Excel file → Multer saves it to disk (max 100MB, .xlsx only)
2. Upload record created in MySQL → BullMQ job queued immediately
3. API responds instantly — upload request does not wait for processing
4. Worker streams the Excel file row by row (no full file load into memory)
5. Rows inserted into MySQL in batches of 500
6. Socket.io notifies only the uploading user via private room
7. Email sent to user on completion

---

## Assumptions & Trade-offs
- **Streaming over readFile**: ExcelJS streaming used to handle 2M+ rows without OOM crashes
- **Batch size 500**: Balances memory usage and DB insert performance
- **Indeterminate progress bar**: totalRows not counted upfront to avoid memory overhead
- **Per-user socket rooms**: Users only receive their own upload events
- **BullMQ jobId deduplication**: Prevents same upload from being processed twice
- **File deleted after processing**: Prevents disk accumulation on the server`;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">📄 README.md</h1>
            <p className="text-gray-400 text-sm mt-1">ExcelPay Processor — Setup Guide</p>
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(fullReadme); setAllCopied(true); setTimeout(() => setAllCopied(false), 2000); }}
            className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-semibold text-sm"
          >
            {allCopied ? "✓ Copied!" : "📋 Copy Full README"}
          </button>
        </div>

        {/* Step 1 - Clone */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-4 overflow-hidden">
          <div className="px-4 py-3 bg-gray-750 border-b border-gray-700">
            <h2 className="font-bold text-white">1. Clone the Repository</h2>
          </div>
          <div className="p-4">
            <CopyBlock code={`git clone https://github.com/Ajay-Dev99/ExcelPay-Processor.git\ncd ExcelPay-Processor`} />
          </div>
        </div>

        {/* Step 2 - ENV */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-4 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h2 className="font-bold text-white">2. Create <span className="text-green-400 font-mono">backend/.env</span></h2>
          </div>
          <div className="p-4">
            <CopyBlock code={`PORT=5000\nNODE_ENV=development\nDATABASE_URL="mysql://root:yourpassword@127.0.0.1:3306/ExcelPayprocessor"\nJWT_SECRET=your_jwt_secret_here\nSMTP_HOST=smtp.gmail.com\nSMTP_PORT=587\nSMTP_USER=your_email@gmail.com\nSMTP_PASS=your_app_password\nREDIS_HOST=127.0.0.1\nREDIS_PORT=6379`} />
            <p className="text-yellow-400 text-xs mt-1">⚠️ For Gmail use an App Password — generate at: myaccount.google.com/apppasswords</p>
          </div>
        </div>

        {/* Step 3 - Backend */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-4 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h2 className="font-bold text-white">3. Run Backend</h2>
          </div>
          <div className="p-4">
            <CopyBlock label="Install dependencies" code={`cd backend\nnpm install`} />
            <CopyBlock label="Run database migrations" code={`npx prisma migrate dev`} />
            <CopyBlock label="Seed the database (creates evaluator user)" code={`npx prisma db seed`} />
            <CopyBlock label="Start the backend server" code={`npm run dev`} />
          </div>
        </div>

        {/* Step 4 - Frontend */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-4 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h2 className="font-bold text-white">4. Run Frontend</h2>
          </div>
          <div className="p-4">
            <CopyBlock label="Open a new terminal" code={`cd frontend\nnpm install\nnpm run dev`} />
            <p className="text-gray-400 text-sm mt-2">Opens at: <span className="text-blue-400 font-mono">http://localhost:5173</span></p>
          </div>
        </div>

        {/* Seed User */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-4 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h2 className="font-bold text-white">🌱 Seed User (for evaluation)</h2>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Password</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 font-mono text-green-400">lusaibnetstager@gmail.com</td>
                  <td className="py-2 font-mono text-green-400">password123</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Architecture */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-4 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h2 className="font-bold text-white">🏛 Architecture</h2>
          </div>
          <div className="p-4 text-gray-300 text-sm space-y-2">
            {[
              "User uploads Excel file → Multer saves to disk (max 100MB, .xlsx only)",
              "Upload record created in MySQL → BullMQ job queued immediately",
              "API responds instantly — does not wait for processing to finish",
              "Worker streams Excel file row by row (no full file load into memory)",
              "Rows inserted into MySQL in batches of 500",
              "Socket.io notifies only the uploading user via private room",
              "Email sent to user on completion"
            ].map((step, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-blue-400 font-bold shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trade-offs */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-4 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-700">
            <h2 className="font-bold text-white">⚖️ Assumptions & Trade-offs</h2>
          </div>
          <div className="p-4 text-gray-300 text-sm space-y-2">
            {[
              ["Streaming over readFile", "ExcelJS streaming handles 2M+ rows without OOM crashes"],
              ["Batch size 500", "Balances memory usage and DB insert performance"],
              ["Indeterminate progress bar", "totalRows not counted upfront to avoid memory overhead"],
              ["Per-user socket rooms", "Users only receive their own upload events"],
              ["BullMQ jobId deduplication", "Prevents the same upload from being processed twice"],
              ["File deleted after processing", "Prevents disk accumulation on the server"],
            ].map(([title, desc], i) => (
              <div key={i} className="flex gap-2">
                <span className="text-yellow-400 shrink-0">•</span>
                <span><span className="text-white font-semibold">{title}</span> — {desc}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}