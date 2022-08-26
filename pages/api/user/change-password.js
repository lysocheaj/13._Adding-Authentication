import { getSession } from "next-auth/react";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { ConnectDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "PATCH") return;

  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await ConnectDatabase();
  const userCollection = client.db().collection("users");
  const user = await userCollection.findOne({ email: userEmail });
  console.log("user:", user);
  
  if (!user) {
    res.status(404).json({ message: "User not found!" });
    client.close();
    return;
  }

  const currentPassword = user.password;
  const passwordIsEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordIsEqual) {
    res.status(403).json({ message: "Invalid password!" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);
  userCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  client.close();
  res.status(200).json({ message: "Password updated!" });
}

export default handler;
