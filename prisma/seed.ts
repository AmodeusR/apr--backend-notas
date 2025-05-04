import { PrismaClient } from "../src/generated/prisma";
const db = new PrismaClient();

async function main() {
  console.log("Creating notes...");

  await db.note.deleteMany();
  await db.note.createMany({
    data: [
      {
        description: "Estudar Vue 3",
        due: null,
        expired: false,
      },
      {
        description: "Finalizar o backend com Fastify",
        due: null,
        expired: false,
      },
      {
        description: "Refatorar componente de tarefas",
        due: null,
        expired: false,
      },
      {
        description: "Ler documentação do Prisma",
        due: null,
        expired: false,
      },
      {
        description: "Criar testes para a API",
        due: null,
        expired: false,
      },
    ],
  });

  console.log("Notes created!");
}

main().catch(e => {
  console.log(e);
}).finally(async () => {
  await db.$disconnect();
})
