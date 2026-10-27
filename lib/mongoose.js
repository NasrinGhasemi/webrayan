// NOTE: MongoDB removed. Kept as a no-op shim to avoid touching many routes.
// Prisma is used instead via lib/prisma.js

export default async function dbConnect() {
  return;
}

export async function connectDB() {
  return;
}
