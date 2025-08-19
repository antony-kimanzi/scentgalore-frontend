import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'
import '../styles/Layout.scss'

const Layout: React.FC = () => {
  const location = useLocation();
  const hideRoutes = ['/signin', '/signup'] as const;
  const hideNavFooter = (hideRoutes as readonly string[]).includes(location.pathname);

  return (
    <div>
        {!hideNavFooter && <div className='navbar'><Navbar /></div>}
        <main className={`${hideNavFooter ? 'main-no-footer' : 'main'}`}>
            <Outlet />
        </main>
        {!hideNavFooter && <Footer />}
    </div>
  )
}

export default Layout;
