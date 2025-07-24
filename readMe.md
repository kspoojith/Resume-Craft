# ResumeCraft

**ResumeCraft** is a modern, full-stack web application for building, managing, and analyzing professional resumes. It features a LaTeX-powered resume builder, template management (with admin upload), PDF preview and download, AI-powered resume analysis, and a user-friendly dashboard. The project is designed for both end-users and administrators, with a focus on ATS (Applicant Tracking System) compatibility and extensibility.

---

## Features

- **LaTeX Resume Builder:**  
  Edit your resume in LaTeX with live PDF preview and template support.

- **Template Management:**  
  Admins can upload new templates (with `.tex`, `.cls`, and preview images). Users can browse and select templates by type.

- **User Dashboard:**  
  View, edit, download, and manage all your resumes in one place. Track download counts and resume titles.

- **Resume Analyzer (AI):**  
  Analyze your resume for ATS score, get job recommendations, and receive keyword suggestions for improvement using AI.

- **Authentication & Authorization:**  
  Secure login, JWT-based authentication, and admin/user role separation.

- **Responsive UI:**  
  Modern, mobile-friendly interface with dark mode support.

---

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), Multer, JWT, Docker (for LaTeX compilation)
- **AI Integration:** Cohere API (for resume analysis and enhancement)
- **PDF Generation:** LaTeX compiled in Dockerized environment

---

## Project Structure
ResumeCraft/
│
├── backend/ # Express API, LaTeX compilation, MongoDB models, AI endpoints
├── client/ # React frontend (pages, components, hooks, utils)
├── README.md # Project documentation (this file)
├── .env # Environment variables (not committed)
└── ... # Other config files
Apply to readMe.md

---

## Getting Started

### 1. **Clone the Repository**

```sh
git clone https://github.com/yourusername/ResumeCraft.git
cd ResumeCraft
```

### 2. **Backend Setup**

```sh
cd backend
npm install
# Copy .env.example to .env and fill in your values
cp .env.example .env
# Start MongoDB (local or Atlas)
# Build LaTeX Docker image (for PDF compilation)
docker build -f Dockerfile.latex -t mylatex:latest .
npm run dev
```

**.env example:**
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
COHERE_API_KEY=your_cohere_api_key

### 3. **Frontend Setup**

```sh
cd ../client
npm install
npm start
```

- The frontend runs on [http://localhost:8080](http://localhost:8080)
- The backend runs on [http://localhost:5000](http://localhost:5000)

---

## Usage

### **User Features**
- Register and log in.
- Create, edit, and save resumes using the LaTeX builder.
- Select from a variety of templates.
- Download resumes as PDF.
- Analyze resumes for ATS score and job fit using AI.

### **Admin Features**
- Access the Admin Templates page.
- Upload new templates (with preview image, `.tex`, and optional `.cls` files).
- Delete templates as needed.

### **Resume Analyzer**
- Go to the **Analyzer** page.
- Select a resume and click "Analyze Resume".
- View ATS score, job recommendations, and keyword suggestions.

---

## API Endpoints (Backend)

- `/api/auth/*` — Authentication (login, register)
- `/api/resumes/*` — Resume CRUD
- `/api/templates/*` — Template CRUD (admin)
- `/api/latex/upload` — Upload LaTeX files for compilation
- `/api/latex/compile` — Compile LaTeX to PDF
- `/api/ai/enhance` — (Optional) AI resume enhancement
- `/api/ai/analyze` — AI resume analysis (ATS, jobs, keywords)

---

## LaTeX Compilation

- Uses a Docker container with `texlive-full` and `latexmk` for secure, reproducible PDF generation.
- Uploaded `.tex` and `.cls` files are compiled in isolated folders.

---

## AI Integration

- **Cohere API** is used for resume analysis (ATS scoring, job suggestions, keyword extraction).
- You must provide your own Cohere API key in the backend `.env`.

---

## Security

- JWT authentication for all user and admin actions.
- File uploads are validated and stored in unique folders.
- Admin-only routes are protected.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [Cohere](https://cohere.com/) for AI APIs
- [Overleaf](https://www.overleaf.com/) and the LaTeX community for template inspiration
- [Tailwind CSS](https://tailwindcss.com/) for UI styling

---

## Contact

For questions, suggestions, or support, please open an issue or contact the maintainer.

---

**Happy Resume Building!**