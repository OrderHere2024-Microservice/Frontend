import { ReactNode, useState, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

const NextClientOnly = ({ children }: Props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted) {
    return <>{children}</>;
  }
  return null;
};

export default NextClientOnly;
