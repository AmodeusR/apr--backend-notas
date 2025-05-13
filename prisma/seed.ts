import { db } from "@lib/prisma";

async function main() {
  
  console.log("Creating user...");
  await db.user.deleteMany();
  const user = await db.user.create({
    data: {
      username: "admin",
      email: "admin@localhost",
      password: await Bun.password.hash("123456")
    }
  });
  console.log("User created!");
  
  console.log("Creating notes...");
  const notes = [
    {
      description: "Estudar Vue 3",
      due: null,
    },
    {
      description: "Finalizar o backend com Fastify",
      due: null,
    },
    {
      description: "Refatorar componente de tarefas",
      due: null,
    },
    {
      description: "Ler documentação do Prisma",
      due: null,
    },
    {
      description: "Criar testes para a API",
      due: null,
    },
  ];
  
  await db.note.deleteMany();
  notes.forEach(async (note) => {
    await db.note.create({
      data: {...note, userId: user.id}
    });
  })

  console.log("Notes created!");
}

main().catch(e => {
  console.log(e);
}).finally(async () => {
  await db.$disconnect();
})
