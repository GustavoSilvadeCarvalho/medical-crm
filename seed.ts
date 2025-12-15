const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

async function main() {
  const passwordAdmin = await bcrypt.hash("admin123", 10);
  await db.user.upsert({
    where: { email: "medico@crm.com" },
    update: {},
    create: {
      email: "medico@crm.com",
      name: "Dr. Gustavo Silva",
      password: passwordAdmin,
      role: "ADMIN",
    },
  });

  const passwordUser = await bcrypt.hash("user123", 10);
  await db.user.upsert({
    where: { email: "secretaria@crm.com" },
    update: {},
    create: {
      email: "secretaria@crm.com",
      name: "Recepcionista Maria",
      password: passwordUser,
      role: "USER",
    },
  });

  console.log("Usuários criados com sucesso!");
}

main()
  .then(async () => await db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
