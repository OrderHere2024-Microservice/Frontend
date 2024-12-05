import { User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    token?: JWT;
  }

  interface Account {
    expires_in?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User;
    account?: {
      provider: string;
      providerAccountId: string;
    };
    accessToken?: string;
    refreshToken?: string;
    idToken?: string;
    accessTokenExpires?: number;
    roles?: string[];
    error?: string;
  }
}
