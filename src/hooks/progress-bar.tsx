import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // style mặc định
NProgress.configure({
  minimum: 0.1,
  speed: 800,
  easing: 'ease',
  trickleSpeed: 300,
  showSpinner: false,
});
function ProgressBar() {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();

    const timer = setTimeout(() => {
      NProgress.done();
    }, 500);

    return () => {
      NProgress.done();
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return null;
}
export default ProgressBar;
