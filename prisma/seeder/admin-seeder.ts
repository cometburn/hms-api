import bcrypt from "bcrypt";
import crypto from "crypto";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // user types first
  const userTypes = [
    { id: 1, name: "super-admin" },
    { id: 2, name: "admin" },
    { id: 3, name: "staff" },
  ];

  const promiseUserTypes = await Promise.all(
    userTypes.map(async (userType) => {
      return {
        ...userType,
      };
    })
  );

  await prisma.userType.createMany({
    data: promiseUserTypes,
    skipDuplicates: true,
  });

  //admin
  const users = [
    {
      email: "jc@baseone.com",
      first_name: "Jc",
      last_name: "Cometa",
      user_type_id: 1,
      status: "active",
    },
    {
      email: "joel@baseone.com",
      first_name: "Jameskirt",
      last_name: "Tabaranza",
      user_type_id: 2,
      status: "active",
    },
    {
      email: "staff@baseone.com",
      first_name: "Staff",
      last_name: "One",
      user_type_id: 3,
      status: "active",
    },
  ];

  const hashedUsers = await Promise.all(
    users.map(async (user) => {
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashed = await bcrypt.hash(randomPassword, 10);

      return {
        ...user,
        password: hashed,
      };
    })
  );

  // You can use createMany if you don’t need to relate other models
  await prisma.user.createMany({
    data: hashedUsers,
    skipDuplicates: true, // optional
  });

  console.log("✅ Seeded multiple users");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
