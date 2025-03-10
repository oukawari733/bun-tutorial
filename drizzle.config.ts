import "dotenv/config";
import type {Config} from "drizzle-kit";

export default {
  schema: "./src/entities/**/*.{ts,js}", // Read all subfolders recursively
  out: "./drizzle",
  dialect: "postgresql", // ✅ Explicitly set the dialect
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  breakpoints: true, // Enable versioned migrations
} satisfies Config;
