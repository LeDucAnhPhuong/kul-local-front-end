import useRouter from '@/hooks/use-router';
import { deleteClientCookie } from '@/lib/jsCookies';
import { useEffect } from 'react';

const SignOut = () => {
  const router = useRouter();

  useEffect(() => {
    deleteClientCookie('access_token');
    router.replace('/sign-in');
    window.location.reload();
  }, []);
  return <p>Đang đăng xuất...</p>;
};

export default SignOut;
