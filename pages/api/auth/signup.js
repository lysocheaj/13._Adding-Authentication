import { hashPassword } from "../../../lib/auth";
import { ConnectDatabase } from "../../../lib/db";

async function handler(req, res) {
  if (req.method !== "POST") return;

  const { email, password } = req.body;

  if (!email || !email.includes("@") || !password || password.length < 7) {
    res.json({ message: "Invalid input." });
    return;
  }

  let client;
  try {
    client = await ConnectDatabase();
  } catch {
    res.json({ message: "Failed to connect database!" });
    return;
  }

  try {
    const db = client.db();

    const existingUser = await db.collection("users").findOne({ email: email });
    if (existingUser) {
      res.status(422).json({ message: "User already exist" });
      return;
    }
    
    const enteredData = await db.collection("users").insertOne({
      email: email,
      password: hashPassword(password),
    });

    res
      .status(201)
      .json({ message: "Insert data to db successfully.", enteredData });
    client.close();
  } catch {
    res.status(422).json({ message: "Insert data to db failed." });
    return;
  }

  res.json({ message: "User created successfully!", data });
}

export default handler;
