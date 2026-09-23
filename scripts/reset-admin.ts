import "dotenv/config";
import { db } from "../lib/db";
import { users } from "../drizzle/schema";
import { hashPassword } from "../lib/auth";
import { eq } from "drizzle-orm";

async function resetAdmin() {
  console.log("Resetting admin credentials...");

  const email = "admin@shaaciye.so";
  const password = "admin123";

  const hashedPassword = await hashPassword(password);

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existing.length > 0) {
    await db.update(users)
      .set({ password: hashedPassword, role: "admin" })
      .where(eq(users.email, email));
    console.log("Admin password reset successfully");
  } else {
    await db.insert(users).values({ email, password: hashedPassword, role: "admin" });
    console.log("Admin user created");
  }

  console.log("Email:    " + email);
  console.log("Password: " + password);
  console.log("Done!");
  process.exit(0);
}

resetAdmin().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
