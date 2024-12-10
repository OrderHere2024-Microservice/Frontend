import NextAuth, { NextAuthOptions } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import axios from 'axios';
import { JWT } from 'next-auth/jwt';

interface DecodedJWT {
  resource_access?: {
    [clientId: string]: {
      roles: string[];
    };
  };
}

interface KeycloakTokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in: number;
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
    async jwt({ token, user, account }) {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
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
            token.roles = roles;
          }
        } catch (error) {
          console.error('Failed to decode JWT:', error);
        }
      }

      if (Date.now() < token.accessTokenExpires!) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    session({ session, token }) {
      session.user = token.user;
      session.token = token;
      return session;
    },
  },
};

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await axios.post(
      `${
        process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ||
        'http://localhost:7080/realms/orderhere'
      }/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id:
          process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'orderhere-mono',
        client_secret:
          process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET ||
          'L6gR02XEqhM1IRtr0IPiOAe2T08H4sfo',
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken!,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    const refreshedTokens = response.data as KeycloakTokenResponse;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token || token.refreshToken,
      idToken: refreshedTokens.id_token || token.idToken,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);

    return {
      ...token,
      error: 'RefreshTokenError',
    };
  }
}

export default NextAuth(authOptions);
