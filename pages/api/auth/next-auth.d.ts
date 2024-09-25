import { User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    token?: JWT;
  }

  interface User {
    jwt?: string;
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
  }
}
