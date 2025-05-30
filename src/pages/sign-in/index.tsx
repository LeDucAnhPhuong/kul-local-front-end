import useRouter from '@/hooks/use-router';
import { SignIn } from '@clerk/clerk-react';
import { useSession } from '@clerk/clerk-react';
import { useEffect } from 'react';

function SignInPage() {
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <SignIn fallbackRedirectUrl={'/sign-in'} />
    </div>
  );
}

export default SignInPage;
