import Sidebar from '@/components/Sidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Barra lateral fija */}
            <Sidebar />

            {/* Contenido principal (con margen a la izquierda para no quedar debajo del sidebar) */}
            {/* Contenido principal (con margen a la izquierda para no quedar debajo del sidebar) */}
            <main className="flex-1 md:ml-64 p-8 pt-16 md:pt-8 transition-all duration-300">
                {children}
            </main>
        </div>
    )
}
