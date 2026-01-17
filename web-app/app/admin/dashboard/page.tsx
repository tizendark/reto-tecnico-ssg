'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

// Definimos los tipos para TypeScript
type Request = {
    id: number
    title: string
    area: string
    priority: string
    status: string
    created_at: string
}

type Designer = {
    id: string
    full_name: string
}

export default function AdminBacklog() {
    const [requests, setRequests] = useState<Request[]>([])
    const [designers, setDesigners] = useState<Designer[]>([])
    const [loading, setLoading] = useState(true)

    // Cargar datos al iniciar
    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        // 1. Obtener solicitudes pendientes (El Backlog)
        const { data: requestsData } = await supabase
            .from('requests')
            .select('*')
            .eq('status', 'Pendiente') // Filtramos solo lo pendiente 
            .order('created_at', { ascending: false })

        // 2. Obtener lista de diseñadores para el dropdown
        const { data: designersData } = await supabase
            .from('profiles')
            .select('id, full_name')
            .eq('role', 'designer')

        if (requestsData) setRequests(requestsData)
        if (designersData) setDesigners(designersData)
        setLoading(false)
    }

    // Función para asignar diseñador
    async function handleAssign(requestId: number, designerId: string) {
        if (!designerId) return

        const { error } = await supabase
            .from('requests')
            .update({
                designer_id: designerId,
                status: 'Asignado' // Cambiamos estado automáticamente 
            })
            .eq('id', requestId)

        if (!error) {
            alert('¡Diseñador asignado correctamente!')
            // Recargar la lista para quitar la tarea asignada del backlog
            fetchData()
        } else {
            console.error(error)
            alert('Error al asignar')
        }
    }

    if (loading) return <div className="p-8">Cargando Backlog...</div>

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel de Administración</h1>
                <p className="text-gray-600 mb-8">Backlog de solicitudes pendientes de asignación</p>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitud</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área / Prioridad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción (Asignar)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                        No hay solicitudes pendientes en el backlog.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{req.title}</div>
                                            <div className="mt-1">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${req.status === 'Pendiente' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                                                        req.status === 'Asignado' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                            req.status === 'En Proceso' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                                                req.status === 'Finalizado' ? 'bg-green-50 text-green-600 border-green-200' :
                                                                    'bg-white text-gray-900'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${req.status === 'Pendiente' ? 'bg-gray-400' :
                                                            req.status === 'Asignado' ? 'bg-blue-500' :
                                                                req.status === 'En Proceso' ? 'bg-purple-500' :
                                                                    'bg-green-500'
                                                        }`}></span>
                                                    {req.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {req.area}
                                            </span>
                                            <div className="mt-2">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${req.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                                                        req.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {req.priority}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {/* Dropdown de asignación */}
                                                <select
                                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                                    onChange={(e) => handleAssign(req.id, e.target.value)}
                                                    defaultValue=""
                                                >
                                                    <option value="" disabled>Seleccionar Diseñador...</option>
                                                    {designers.map((d) => (
                                                        <option key={d.id} value={d.id}>
                                                            {d.full_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}
