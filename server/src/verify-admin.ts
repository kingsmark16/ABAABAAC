import { prisma } from './lib/db'
import bcrypt from 'bcryptjs'

async function verifyAdmin(username: string, password: string) {
  console.log(`Verifying credentials for: ${username}`)

  // Find admin by username
  const admin = await prisma.admin.findUnique({
    where: { username }
  })

  if (!admin) {
    console.log('Admin not found')
    return false
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password)

  if (isPasswordValid) {
    console.log('Login successful!')
    console.log('Admin ID:', admin.id)
    console.log('Username:', admin.username)
    return true
  } else {
    console.log('Invalid password')
    return false
  }
}

// Test login
async function main() {
  console.log('Testing admin login...\n')
  
  const adminUsername : string = process.env.ADMIN_USERNAME ?? '';
  const adminPassword : string = process.env.ADMIN_PASSWORD ?? '';
  
  if (!adminUsername || !adminPassword) {
    console.log('Missing ADMIN_USERNAME or ADMIN_PASSWORD environment variables')
    return
  }
  
  const result = await verifyAdmin(adminUsername, adminPassword)
  
  console.log('\n---\n')
  if (result) {
    console.log('Successfully tested with correct credentials.\n')
  } else {
    console.log('Failed to verify with provided credentials.\n')
  }
}

main()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
