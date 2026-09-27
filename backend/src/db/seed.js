import { initializeDatabase, seedDatabase } from "./database.js";

initializeDatabase();
seedDatabase();
console.log("Database initialized and seeded.");
