import { useLocation, useNavigate } from 'react-router-dom';
import 'nprogress/nprogress.css';

const useRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
    location,
  };
};

export default useRouter;
