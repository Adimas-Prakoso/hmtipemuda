import { Elysia } from 'elysia';
import fs from 'fs/promises';
import path from 'path';

const SUBSCRIPTION_FILE = path.join(process.cwd(), 'data', 'subscription.json');
const API_KEY = process.env.APIKEY;

interface SubscriberData {
  email: string;
  whatsapp: string;
  timestamp: string;
}

// Helper function to read the subscription data
async function getSubscriptions(): Promise<SubscriberData[]> {
  try {
    const data = await fs.readFile(SUBSCRIPTION_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

// Helper function to write to the subscription file
async function saveSubscription(data: SubscriberData[]): Promise<void> {
  await fs.writeFile(SUBSCRIPTION_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const app = new Elysia({ prefix: '/api' })
  .post('/subscribe', async ({ body }) => {
    // POST endpoint remains publicly accessible for user subscriptions
    try {
      const { email, whatsapp } = body as { email: string; whatsapp: string };

      // Validate input
      if (!email || !whatsapp) {
        return new Response(
          JSON.stringify({ error: 'Email dan nomor WhatsApp wajib diisi' }), 
          { status: 400 }
        );
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Format email tidak valid' }), 
          { status: 400 }
        );
      }

      if (!/^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/.test(whatsapp)) {
        return new Response(
          JSON.stringify({ error: 'Format nomor WhatsApp tidak valid' }), 
          { status: 400 }
        );
      }

      // Get current subscriptions
      const currentSubscriptions = await getSubscriptions();

      // Check if email or WhatsApp already exists
      const emailExists = currentSubscriptions.some(
        (sub) => sub.email.toLowerCase() === email.toLowerCase()
      );
      const whatsappExists = currentSubscriptions.some(
        (sub) => sub.whatsapp === whatsapp
      );

      if (emailExists) {
        return new Response(
          JSON.stringify({ error: 'Email ini sudah terdaftar' }), 
          { status: 409 }
        );
      }

      if (whatsappExists) {
        return new Response(
          JSON.stringify({ error: 'Nomor WhatsApp ini sudah terdaftar' }), 
          { status: 409 }
        );
      }

      // Add new subscription
      const newSubscription: SubscriberData = {
        email,
        whatsapp,
        timestamp: new Date().toISOString(),
      };

      currentSubscriptions.push(newSubscription);

      // Save updated subscriptions
      await saveSubscription(currentSubscriptions);

      return new Response(
        JSON.stringify({ success: true, message: 'Berhasil berlangganan' }), 
        { status: 201 }
      );
    } catch (error) {
      console.error('Subscription error:', error);
      return new Response(
        JSON.stringify({ error: 'Terjadi kesalahan server' }), 
        { status: 500 }
      );
    }
  })
  .get('/subscribe', async ({ headers, query }) => {
    // Validate API key from header or query parameter for the GET endpoint
    const headerApiKey = headers['x-api-key'];
    const queryApiKey = query.apikey;
    
    // Check API key from header or query parameter
    const providedApiKey = headerApiKey || queryApiKey;
    
    if (!providedApiKey || providedApiKey !== API_KEY) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Unauthorized: Invalid or missing API key' 
        }), 
        { status: 401 }
      );
    }
    
    try {
      const subscriptions = await getSubscriptions();
      
      // Return detailed information only when properly authenticated
      return { 
        success: true, 
        count: subscriptions.length,
        subscriptions: subscriptions.map(sub => ({
          email: sub.email,
          whatsapp: sub.whatsapp,
          date: new Date(sub.timestamp).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        }))
      };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return new Response(
        JSON.stringify({ error: 'Terjadi kesalahan server' }), 
        { status: 500 }
      );
    }
  });

export const POST = app.handle;
export const GET = app.handle;
