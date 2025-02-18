import { Elysia } from 'elysia'
import fs from 'fs'
import path from 'path'
import type { Visitor } from '@/lib/monitor_visitor'

const app = new Elysia({ prefix: '/api' })
    .get('/visitors', () => {
        try {
            const filePath = path.join(process.cwd(), 'data', 'visitor.json')
            
            if (!fs.existsSync(filePath)) {
                return new Response(
                    JSON.stringify({ success: false, error: 'Visitor data not found' }), 
                    { status: 404 }
                )
            }

            const fileContent = fs.readFileSync(filePath, 'utf-8')
            const visitors = JSON.parse(fileContent) as Visitor[]

            return { 
                success: true,
                total: visitors.length,
                stats: {
                    browsers: countUnique(visitors, 'browser.name'),
                    operatingSystems: countUnique(visitors, 'os.name'),
                    countries: countUnique(visitors, 'location.country'),
                    dailyVisits: countDailyVisits(visitors)
                }
            }
        } catch (error) {
            console.error('Error fetching visitors:', error)
            return new Response(
                JSON.stringify({ success: false, error: 'Failed to fetch visitor data' }), 
                { status: 500 }
            )
        }
    })

// Fungsi helper untuk mengakses nested property
function getNestedValue(obj: Visitor, path: 'browser.name' | 'os.name' | 'location.country'): string {
    switch (path) {
        case 'browser.name':
            return obj.browser?.name || 'Unknown';
        case 'os.name':
            return obj.os?.name || 'Unknown';
        case 'location.country':
            return obj.location?.country || 'Unknown';
        default:
            return 'Unknown';
    }
}

// Tipe yang valid untuk properti yang ingin dihitung
type NestedKey = 'browser.name' | 'os.name' | 'location.country';

// Fungsi helper untuk menghitung nilai unik dan jumlahnya
function countUnique(visitors: Visitor[], path: NestedKey) {
    const counts: Record<string, number> = {};
    visitors.forEach(visitor => {
        const value = getNestedValue(visitor, path);
        counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
}

// Fungsi untuk menghitung kunjungan per tanggal
interface DailyVisit {
    date: string;
    total: number;
    readableDate: string;
}

function countDailyVisits(visitors: Visitor[]): DailyVisit[] {
    const dailyCounts: Record<string, number> = {};
    
    visitors.forEach(visitor => {
        const date = new Date(visitor.visitedAt).toISOString().split('T')[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    });

    // Konversi ke array dengan format yang lebih mudah dibaca
    return Object.entries(dailyCounts)
        .map(([date, total]) => ({
            date,
            total,
            readableDate: new Date(date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }))
        .sort((a, b) => b.date.localeCompare(a.date)); // Urutkan berdasarkan tanggal terbaru
}

export const GET = app.handle
