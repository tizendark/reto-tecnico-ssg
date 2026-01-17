'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import {
    LayoutDashboard,
    Palette,
    LogOut,
    Settings,
    UserCircle,
    Menu,
    X
} from 'lucide-react'

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    // Detectamos si estamos en zona de admin o diseñador para mostrar el título correcto
    const isAdmin = pathname.includes('/admin')

    // Definimos los links según el rol
    const links = isAdmin
        ? [
            { name: 'Backlog General', href: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Configuración', href: '#', icon: Settings },
        ]
        : [
            { name: 'Mis Tareas', href: '/designer/dashboard', icon: Palette },
            { name: 'Mi Perfil', href: '#', icon: UserCircle },
        ]

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Aside */}
            <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex flex-col shadow-xl z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
                {/* Logo / Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold tracking-wider">
                            Sabbag <span className="text-blue-500">Manager</span>
                        </h2>
                        <span className="text-xs text-slate-400 uppercase tracking-widest mt-1 block">
                            {isAdmin ? 'Administrador' : 'Diseñador'}
                        </span>
                    </div>
                    {/* Close button inside sidebar just in case */}
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Navegación */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)} // Close on navigate (mobile)
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'} />
                                <span className="font-medium text-sm">{link.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-slate-800 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    )
}
