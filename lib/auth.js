import { hash } from "bcryptjs";

export async function hashPassword(password) {
  const encryptedPwd = await hash(password, 12);
  return encryptedPwd;
}
