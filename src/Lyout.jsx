import React from 'react'
import POSHeader from './assets/components/POS/POSHeader'
import { Outlet } from 'react-router-dom'

export default function Lyout() {
  return (
    <div>
      <POSHeader/>
      <Outlet/>
    </div>
  )
}
