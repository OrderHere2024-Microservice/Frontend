import NextAuth, { NextAuthOptions } from 'next-auth';
import { Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { login } from '@services/Public';

interface JWTBody {
  sub: string;
  userId: string;
  userName: string;
  avatarURL: string;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const response = await login(credentials.email, credentials.password);
          if (response.status === 200 && response.data) {
            const token: string = (response.data as { token: string }).token;

            // Verify and decode JWT token
            const parts = token.split('.');
            if (parts.length !== 3) {
              console.error('JWT token error, invalid JWT');
              return null;
            }

            const decoded = atob(parts[1]);
            const jwtObject = JSON.parse(decoded) as JWTBody;

            // Return user object with custom fields
            return {
              id: jwtObject.userId,
              name: jwtObject.userName,
              email: jwtObject.sub,
              image: jwtObject.avatarURL,
              token: jwtObject, // Custom field for decoded JWT
              jwt: token, // Original JWT string
            };
          }
          return null;
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          scope: 'openid email profile',
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID || '',
      clientSecret: process.env.FACEBOOK_SECRET || '',
    }),
  ],

  callbacks: {
    jwt({ token, user, account }): Promise<JWT> {
      if (user) {
        token.user = user; // Store user data in JWT
      }
      if (account) {
        token.account = account; // Store account information if available
      }
      return Promise.resolve(token);
    },
    session({ session, token }): Session {
      if (token) {
        // Extend session with custom JWT fields
        session.token = token;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
