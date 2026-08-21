import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'

interface ShellProps {
  children: ReactNode
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="app-shell flex h-screen overflow-hidden">
      <Sidebar />
      <div className="app-shell-body flex-1 flex flex-col min-w-0">
        <TopNavbar />
        <main className="app-main flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="app-content mx-auto max-w-7xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
