import React from 'react'
import '../styles/Shop.scss'
import ProductsList from '../components/ProductsList'

export default function Shop() {
  return (
    <div className='shop'>
        <div className='header-section'><h1>shop</h1>
        <h3>Entire Collection</h3></div>
        <div className='products-section'><ProductsList /></div>
    </div>
  )
}
