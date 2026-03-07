import { prisma } from './lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Seeding database...')

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' }
  })

  if (existingAdmin) {
    console.log('Admin account already exists. Skipping...')
    return
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.error('Admin username or password not set in environment variables.')
    process.exit(1)
  }
  // Hash the password
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(adminPassword, saltRounds)

  // Create admin account
  const admin = await prisma.admin.create({
    data: {
      username: adminUsername,
      password: hashedPassword
    }
  })

  console.log('Admin account created successfully!')
  console.log('ID:', admin.id)
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
