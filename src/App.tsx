import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import SingleProduct from './pages/SingleProduct'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/cart' element={<Cart />} />
            <Route path = '/contact' element={<Contact />} />
            <Route path ='/signup' element={<SignUp />} />
            <Route path = '/signin' element={<SignIn />} />
            <Route path = 'product/:id' element={<SingleProduct />} />
            <Route path='/checkout' element={<Checkout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
