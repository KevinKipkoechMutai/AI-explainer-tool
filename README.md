# AI EDU

AI EDU is an innovative educational platform designed to transform how users interact with textbooks and educational materials. By leveraging advanced AI and voice technologies, it converts static PDF documents into interactive, conversational learning experiences.

## 🚀 Key Features

- **Interactive Book Uploads**: Seamlessly upload PDF textbooks with automatic cover extraction and text parsing.
- **Voice-Powered Learning**: Engage in real-time voice conversations about book content using AI assistants.
- **Smart Content Segmentation**: Large PDF files are automatically parsed and segmented into manageable pieces for efficient retrieval and AI processing.
- **Personalized AI Personas**: Choose different voice personas for your educational assistants.
- **Subscription Management**: Integrated subscription models for premium educational features.
- **Secure Authentication**: Robust user management and authentication powered by Clerk.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Storage**: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- **Voice AI**: [Vapi AI](https://vapi.ai/)
- **PDF Processing**: [pdfjs-dist](https://github.com/mozilla/pdf.js)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## ⚙️ How It Works (Technical)

### 1. Document Processing Pipeline
When a user uploads a PDF, the application uses `pdfjs-dist` on the client side to:
- Extract text content from each page.
- Generate a high-quality cover image if one isn't provided.
- The document is then uploaded to **Vercel Blob Storage**, and its metadata is stored in **MongoDB**.

### 2. Intelligent Segmentation
The extracted text is segmented into smaller, context-aware chunks. These segments are stored in the database with references to their original page numbers and word counts, allowing the AI to pinpoint exactly where information is located within the book.

### 3. Real-time Voice Interaction
The core "conversational" experience is powered by the **Vapi AI SDK**. 
- A custom `useVapi` hook manages the WebRTC connection to Vapi's servers.
- When a user starts a call, the application provides context from the currently active book segments to the AI assistant.
- This allows the AI to "read" and discuss specific parts of the book with the user in real-time.

### 4. Server Actions & Data Layer
The application follows a modern Next.js architecture using **Server Actions** for database operations (creating books, saving segments, managing sessions). This ensures a secure and performant bridge between the frontend and the MongoDB database.

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB instance
- Clerk account
- Vapi account
- Vercel Blob storage configured

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-edu
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root and add the following:
   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=

   # Database
   MONGO_URI=

   # Vercel Storage
   BLOB_READ_WRITE_TOKEN=

   # Vapi AI
   NEXT_PUBLIC_ASSISTANT_ID=
   NEXT_PUBLIC_VAPI_API_KEY=
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
