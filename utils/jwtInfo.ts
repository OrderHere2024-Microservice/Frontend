interface JwtInfo {
  userId: string | null;
  userRole: string | null;
}

interface JwtDecoded {
  userId: string;
  authorities: { authority: string }[];
}

export const jwtInfo = (token: string): JwtInfo => {
  if (!token) {
    return { userId: null, userRole: null };
  } else {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('JWT token error, invalid JWT');
      return { userId: null, userRole: null };
    }
    try {
      const decoded = atob(parts[1]);
      const jwtObject = JSON.parse(decoded) as JwtDecoded;
      const userId = jwtObject.userId;
      const userRole = jwtObject.authorities[0]?.authority || null;
      return { userId, userRole };
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return { userId: null, userRole: null };
    }
  }
};
