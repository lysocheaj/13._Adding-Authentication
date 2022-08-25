import NextAuth from 'next-auth';
import CredentialProvider from "next-auth/providers/credentials";
import { verifyPassword } from '../../../lib/auth';
import { ConnectDatabase } from '../../../lib/db';

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialProvider({
      async authorize(credentials) {
        const client = await ConnectDatabase();

        const usersCollection = client.db().collection('users');

        const user = await usersCollection.findOne({
          email: credentials.email,
        });

        

        if (!user) {
          client.close();
          throw new Error('No user found!');
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error('Could not log you in!');
        }

        client.close();
        return { email: user.email };
        
      },
    }),
  ],
});