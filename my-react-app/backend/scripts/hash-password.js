import bcrypt from 'bcryptjs'

const password = process.argv[2]
if (!password || password.length < 10) {
  console.error('no work')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)
console.log(`OWNER_PASSWORD_HASH=${hash}`)
