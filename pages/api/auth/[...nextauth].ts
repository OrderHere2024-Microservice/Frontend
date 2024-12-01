import NextAuth, { NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'orderhere-mono',
      clientSecret:
        process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET ||
        'L6gR02XEqhM1IRtr0IPiOAe2T08H4sfo',
      issuer:
        process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ||
        'http://localhost:7080/realms/orderhere',
    }),
  ],

  secret: process.env.NEXT_PUBLIC_SECRET,

  callbacks: {
    jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.user = user;
      }
      return token;
    },
    session({ session, token }) {
      session.user = token.user;
      session.token = token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
