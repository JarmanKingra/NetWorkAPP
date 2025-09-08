import DashboardLayout from '@/layouts/DashboardLayout'
import UserLayout from '@/layouts/userLayouts'
import React from 'react'

export default function Discover() {
  return (
    <UserLayout>
        <DashboardLayout>
            <div><h1>Connections</h1></div>
        </DashboardLayout>
    </UserLayout>
  )
}