import { prisma } from './lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('🌱 Seeding database...')

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' }
  })

  if (existingAdmin) {
    console.log('⚠️  Admin account already exists. Skipping...')
    return
  }

  // Hash the password
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash('bacdadbcbc', saltRounds)

  // Create admin account
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword
    }
  })

  console.log('✅ Admin account created successfully!')
  console.log('   Username: admin')
  console.log('   Password: admin123')
  console.log('   ID:', admin.id)
}

main()
  .catch((error) => {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
