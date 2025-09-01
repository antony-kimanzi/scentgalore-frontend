import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'
import '../styles/Layout.scss'

const Layout: React.FC = () => {
  const location = useLocation();
  const hideRoutes = ['/signin', '/signup'] as const;
  const hideCheckout = '/checkout' as const;
  const hideNavFooter = (hideRoutes as readonly string[]).includes(location.pathname);
  const hideFooter = location.pathname.includes(hideCheckout);

  return (
    <div>
        {!hideNavFooter && <div className='navbar'><Navbar /></div>}
        <main className={`${hideFooter ? 'main-no-footer' : `${hideNavFooter ? 'main-no-navbar' : 'main'}` }`}>
            <Outlet />
        </main>
        {hideFooter ? null : (!hideNavFooter && <Footer />)}
    </div>
  )
}

export default Layout;
