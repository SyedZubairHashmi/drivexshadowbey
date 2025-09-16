# Setup Instructions

## Quick Start

1. **Download the project files** to your desired directory
2. **Open terminal/command prompt** in the project directory
3. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
4. **Start the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
5. **Open your browser** and go to `http://localhost:3000`

## Troubleshooting

### If you get dependency errors:
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### If Next.js command is not found:
Make sure you're in the correct directory and run:
\`\`\`bash
npx next dev
\`\`\`

### If port 3000 is busy:
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

## Features Available

- ✅ Complete dashboard with statistics
- ✅ Car inventory management
- ✅ Batch management system
- ✅ Sales and payments tracking
- ✅ Investor management
- ✅ Settings configuration
- ✅ Responsive design
- ✅ Modern UI components

The dashboard will automatically redirect to `/dashboard` when you visit the root URL.
