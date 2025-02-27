import { Elysia } from 'elysia'
import { monitorVisitor } from '@/lib/monitor_visitor'

const app = new Elysia({ prefix: '/api' })
    .post('/monitor', async ({ request }) => {
        try {
            const visitorData = await monitorVisitor(request)
            
            // Jika IP adalah ::1, kembalikan response khusus
            if (!visitorData) {
                return { success: true, message: 'Skipped localhost IPv6 visitor' }
            }
            
            return { success: true, data: visitorData }
        } catch (error) {
            console.error('Error monitoring visitor:', error)
            return new Response(
                JSON.stringify({ success: false, error: 'Failed to monitor visitor' }), 
                { status: 500 }
            )
        }
    })

export const POST = app.handle
