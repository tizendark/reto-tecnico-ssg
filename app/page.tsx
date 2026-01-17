'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { z } from 'zod'
import { Send, FileText, AlertCircle, CheckCircle2 } from 'lucide-react'

// Esquema de validación (Igual que tenías)
const requestSchema = z.object({
    title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
    description: z.string().min(10, "Describe la solicitud con más detalle"),
    area: z.enum(["Marketing", "IT", "RRHH", "Ventas", "Operaciones"]),
    priority: z.enum(["Baja", "Media", "Alta"]),
})

export default function PublicRequestForm() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        // Captura segura de la referencia al formulario
        const form = e.currentTarget
        const formData = new FormData(form)

        const rawData = {
            title: formData.get('title'),
            description: formData.get('description'),
            area: formData.get('area'),
            priority: formData.get('priority'),
        }

        const result = requestSchema.safeParse(rawData)

        if (!result.success) {
            setMessage(`Error: ${result.error.errors[0].message}`)
            setLoading(false)
            return
        }

        const { error } = await supabase
            .from('requests')
            .insert([{ ...result.data, status: 'Pendiente' }])

        if (error) {
            setMessage('Error al guardar la solicitud.')
        } else {
            setMessage('¡Solicitud enviada con éxito!')
            form.reset() // Uso seguro de la referencia capturada
        }
        setLoading(false)
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            {/* Encabezado Visual */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Sabbag <span className="text-blue-600">Design</span></h1>
                <p className="text-slate-500 mt-2">Portal de Gestión de Solicitudes Corporativas</p>
            </div>

            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-blue-600 p-4 text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <h2 className="font-semibold text-lg">Nueva Solicitud</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Título del Proyecto</label>
                        <input name="title" required className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" placeholder="Ej: Banner campaña Navidad" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Área */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Área</label>
                            <select name="area" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option value="Marketing">Marketing</option>
                                <option value="IT">IT</option>
                                <option value="RRHH">RRHH</option>
                                <option value="Ventas">Ventas</option>
                                <option value="Operaciones">Operaciones</option>
                            </select>
                        </div>

                        {/* Prioridad */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Prioridad</label>
                            <select name="priority" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                                <option value="Media">Media</option>
                                <option value="Baja">Baja</option>
                                <option value="Alta">Alta</option>
                            </select>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Detalles y Requisitos</label>
                        <textarea name="description" required rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none" placeholder="Describe colores, formatos, textos..."></textarea>
                    </div>

                    {/* Botón con estado de carga */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white transition-all transform active:scale-95 ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                    >
                        {loading ? 'Enviando...' : <><Send className="w-4 h-4" /> Enviar Solicitud</>}
                    </button>

                    {/* Feedback Messages */}
                    {message && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                            {message.includes('Error') ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                            {message}
                        </div>
                    )}
                </form>
            </div>

            <p className="mt-8 text-xs text-slate-400">© 2026 Sistema de Gestión de Diseño Interno</p>
        </main>
    )
}
