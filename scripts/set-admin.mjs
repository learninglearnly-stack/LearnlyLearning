import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });

const email = process.argv[2];

if (!email) {
  console.error("Usage: node scripts/set-admin.mjs <email>");
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();

  const result = await client.query(
    `UPDATE public.profiles
     SET role = 'admin'
     WHERE lower(email) = lower($1)
     RETURNING id, email, role`,
    [email],
  );

  if (result.rowCount === 0) {
    const authUser = await client.query(
      `SELECT id, email FROM auth.users WHERE lower(email) = lower($1)`,
      [email],
    );

    if (authUser.rowCount === 0) {
      console.log(`No user found with email: ${email}`);
      console.log("Sign up first at http://localhost:3000/signup, then run this again.");
    } else {
      console.log("User exists in auth.users but has no profile row:");
      console.log(authUser.rows[0]);
    }
  } else {
    console.log("Admin role set successfully:");
    console.log(result.rows[0]);
  }
} catch (error) {
  console.error("Failed:", error.message);
  process.exit(1);
} finally {
  await client.end();
}
