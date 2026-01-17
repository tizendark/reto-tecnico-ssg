import Sidebar from '@/components/Sidebar'

export default function DesignerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 md:ml-64 p-8 pt-16 md:pt-8 transition-all duration-300">
                {children}
            </main>
        </div>
    )
}
