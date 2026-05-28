import "dotenv/config"
import bcrypt from "bcryptjs"

async function main() {
  const password = process.argv[2]
  const hash = process.env.PATIENT_RECORD_ACCESS_PASSWORD_HASH

  if (!password) {
    throw new Error("Pass the password as an argument.")
  }

  if (!hash) {
    throw new Error("PATIENT_RECORD_ACCESS_PASSWORD_HASH is missing from .env.")
  }

  const isValid = await bcrypt.compare(password, hash)

  console.log({
    hashLoaded: Boolean(hash),
    hashStartsWith: hash.slice(0, 7),
    passwordMatchesHash: isValid,
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})