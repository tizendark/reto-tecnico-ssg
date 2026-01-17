'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Request = {
    id: number
    title: string
    description: string
    area: string
    priority: string
    status: string
    created_at: string
}

const STATUS_FLOW = ['Asignado', 'En Proceso', 'En Revisión', 'Finalizado']

export default function DesignerDashboard() {
    const [tasks, setTasks] = useState<Request[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        fetchMyTasks()
    }, [])

    async function fetchMyTasks() {
        // 1. Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            // Si no hay usuario, redirigir a login (simple)
            alert("Debes iniciar sesión")
            return
        }

        // 2. Obtener SOLO mis tareas asignadas
        const { data, error } = await supabase
            .from('requests')
            .select('*')
            .eq('designer_id', user.id)
            .neq('status', 'Pendiente') // Opcional: ocultar lo que ya no es relevante si hubiera error
            .order('updated_at', { ascending: false })

        if (error) console.error(error)
        if (data) setTasks(data)
        setLoading(false)
    }

    // Función para avanzar el estado
    async function updateStatus(taskId: number, newStatus: string) {
        // Optimistic UI update (actualiza la interfaz antes de la BD para que se sienta rápido)
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))

        const { error } = await supabase
            .from('requests')
            .update({ status: newStatus })
            .eq('id', taskId)

        if (error) {
            alert("Error al actualizar")
            fetchMyTasks() // Revertir si falló
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando tu espacio de trabajo...</div>

    return (
        <main className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Mis Tareas de Diseño</h1>
                        <p className="text-gray-500 text-sm">Gestiona el flujo de tus asignaciones</p>
                    </div>
                    {/* Aquí podrías poner un botón de Logout */}
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                            <p className="text-gray-400">¡Todo limpio! No tienes tareas asignadas por el momento.</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <div key={task.id} className={`bg-white rounded-lg shadow-sm border-l-4 p-5 transition-all hover:shadow-md ${task.priority === 'Alta' ? 'border-red-500' :
                                    task.priority === 'Media' ? 'border-yellow-400' : 'border-blue-400'
                                }`}>

                                {/* Cabecera de la Tarjeta */}
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded text-gray-600">
                                        {task.area}
                                    </span>
                                    <span className={`text-xs font-bold ${task.priority === 'Alta' ? 'text-red-600' : 'text-gray-500'
                                        }`}>
                                        {task.priority.toUpperCase()}
                                    </span>
                                </div>

                                <h3 className="font-bold text-lg text-gray-800 mb-2">{task.title}</h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>

                                {/* Control de Estado */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Estado Actual</label>
                                    <select
                                        value={task.status}
                                        onChange={(e) => updateStatus(task.id, e.target.value)}
                                        className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 bg-gray-50"
                                    >
                                        {STATUS_FLOW.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Indicador visual de finalizado */}
                                {task.status === 'Finalizado' && (
                                    <div className="mt-3 text-center text-xs text-green-600 font-bold bg-green-50 py-1 rounded">
                                        ✓ Tarea Completada
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    )
}
