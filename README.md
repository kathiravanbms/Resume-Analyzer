# Resume Analyzer

An AI-powered web application that analyzes resumes against job descriptions and provides a match score, ATS compatibility feedback, keyword analysis, and actionable suggestions to improve resume quality.

**Live Demo:** https://resume-analyzer-rho-teal.vercel.app

**GitHub Repository:** https://github.com/kathiravanbms/Resume-Analyzer

## Technology Stack

| Technology | Purpose |
|---|---|
| React.js | User interface |
| Vite | Development server and build tool |
| TypeScript | Type safety and maintainable code |
| PDF.js (`pdfjs-dist`) | PDF text extraction |
| Mammoth.js | DOCX text extraction |
| AI Provider APIs | Resume analysis and recommendations |
| Browser Local Storage | Store settings, reports, and history |
| Supabase Auth | Optional user authentication |
| Vercel | Deployment and serverless functions |
| Netlify | Alternative deployment platform |

## Project Structure

```text
Resume-Analyzer/
├── api/
│   └── opencode/          # Vercel serverless proxy
├── netlify/
│   └── functions/         # Netlify serverless functions
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # Application and session state
│   ├── lib/
│   │   ├── analysis/      # Analysis prompts and validation
│   │   ├── parsing/       # PDF, DOCX, and text extraction
│   │   ├── providers/     # AI provider integrations
│   │   ├── storage.ts     # Local storage management
│   │   ├── supabase.ts    # Supabase client
│   │   └── auth-utils.ts  # Authentication helpers
│   └── pages/             # Home, Analyze, Results, Settings,
│                          # History, Login, and Signup
├── .env.example
├── netlify.toml
├── vercel.json
├── PRODUCT.md
├── DESIGN.md
└── package.json
```

## Deployment

### Vercel

1. Push the project to GitHub.
2. Log in to [Vercel](https://vercel.com/).
3. Import the `Resume-Analyzer` repository.
4. Select **Vite** as the framework preset.
5. Set the build command to `npm run build`.
6. Set the output directory to `dist`.
7. Click **Deploy**.

The application is deployed at:

https://resume-analyzer-rho-teal.vercel.app

Vercel automatically creates new deployments when changes are pushed to the connected GitHub repository.

### Netlify

The application can also be deployed using [Netlify](https://www.netlify.com/). The repository includes `netlify.toml` and a serverless function for the OpenCode Go proxy.

