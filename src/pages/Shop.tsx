import React from 'react'
import '../styles/Shop.scss'
import ShopList from '../components/ShopList'

export default function Shop() {
  return (
    <div className='shop'>
        <div className='header-section'><h1>shop</h1>
        <h3>Entire Collection</h3></div>
        <div className='products-section'><ShopList /></div>
    </div>
  )
}
