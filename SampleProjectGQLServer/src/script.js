// 1
const { PrismaClient } = require("@prisma/client")

// 2
const prisma = new PrismaClient()

// 3
async function main() {
  const newLink = await prisma.user.create({
    data: {
        name: 'Fullstracj',
        profilePic: 'hello.com',
        description: 'hello'
    },
  })
  const allLinks = await prisma.user.findMany()
  console.log(allLinks)
}

// 4
main()
  .catch(e => {
    throw e
  })
  // 5
  .finally(async () => {
    await prisma.$disconnect()
  })