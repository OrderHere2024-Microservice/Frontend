import NextAuth, { NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

interface DecodedJWT {
  resource_access?: {
    [clientId: string]: {
      roles: string[];
    };
  };
}

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

      if (token.accessToken) {
        try {
          const decodedToken: DecodedJWT = JSON.parse(
            Buffer.from(token.accessToken.split('.')[1], 'base64').toString(),
          ) as DecodedJWT;
          const roles =
            decodedToken?.resource_access?.['orderhere-mono']?.roles;
          if (roles) {
            token.roles = roles; // Add roles to the JWT
          }
        } catch (error) {
          console.error('Failed to decode JWT:', error);
        }
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
