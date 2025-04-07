import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const slideSchema = z.object({
  image: z.string(),
  alt: z.string()
});

const leadershipMemberSchema = z.object({
  name: z.string(),
  position: z.string(),
  department: z.string(),
  imagePath: z.string()
});

const statItemSchema = z.object({
  value: z.number(),
  title: z.string(),
  icon: z.string()
});

const achievementItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  badge: z.string(),
  color: z.string(),
  date: z.string()
});

const configSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.string(),
  siteName: z.string(),
  locale: z.string(),
  type: z.string(),
  logo: z.string(),
  foundingDate: z.string(),
  organizationType: z.string(),
  keywords: z.array(z.string()),
  authors: z.array(z.object({
    name: z.string(),
    url: z.string()
  })),
  creator: z.string(),
  publisher: z.string(),
  alternates: z.object({
    canonical: z.string(),
    languages: z.record(z.string())
  }),
  openGraph: z.object({
    type: z.string(),
    locale: z.string(),
    url: z.string(),
    title: z.string(),
    description: z.string(),
    siteName: z.string(),
    images: z.array(z.object({
      url: z.string(),
      width: z.number(),
      height: z.number(),
      alt: z.string()
    }))
  }),
  twitter: z.object({
    card: z.string(),
    title: z.string(),
    description: z.string(),
    creator: z.string(),
    images: z.array(z.string())
  }),
  robotsConfig: z.object({
    rules: z.object({
      index: z.boolean(),
      follow: z.boolean()
    }),
    googleBot: z.string()
  }),
  verification: z.object({
    google: z.string(),
    yandex: z.string()
  }),
  category: z.string(),
  manifest: z.string(),
  socialMedia: z.object({
    facebook: z.string(),
    instagram: z.string(),
    twitter: z.string()
  }),
  address: z.object({
    "@type": z.string(),
    addressLocality: z.string(),
    addressRegion: z.string(),
    postalCode: z.string(),
    streetAddress: z.string(),
    addressCountry: z.string()
  }),
  parentOrganization: z.object({
    "@type": z.string(),
    name: z.string(),
    url: z.string()
  }),
  slides: z.array(slideSchema),
  leadershipTeam: z.array(leadershipMemberSchema).optional().default([]),
  stats: z.array(statItemSchema).optional().default([]),
  achievements: z.array(achievementItemSchema).optional().default([])
});

const CONFIG_PATH = path.join(process.cwd(), 'data', 'site_config.json');

export async function GET() {
  try {
    const configData = await fs.readFile(CONFIG_PATH, 'utf-8');
    const config = JSON.parse(configData);
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error reading config:', error);
    return NextResponse.json(
      { error: 'Failed to read configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Received POST request to update site config');
    const data = await request.json();
    console.log('Request data structure:', Object.keys(data));
    
    // Log the current structure of specific fields for debugging
    console.log('Stats field type:', typeof data.stats, 'isArray:', Array.isArray(data.stats));
    console.log('Achievements field type:', typeof data.achievements, 'isArray:', Array.isArray(data.achievements));
    
    // Ensure stats and achievements arrays exist and have the right format
    if (!data.stats) {
      console.log('Stats field missing, initializing empty array');
      data.stats = [];
    }
    if (!data.achievements) {
      console.log('Achievements field missing, initializing empty array');
      data.achievements = [];
    }
    
    // Convert any string values in stats to numbers if needed
    if (Array.isArray(data.stats)) {
      data.stats = data.stats.map((stat: { value: string | number; [key: string]: unknown }) => {
        const newValue = typeof stat.value === 'string' ? parseInt(stat.value, 10) || 0 : stat.value;
        console.log(`Converting stat value from ${stat.value} (${typeof stat.value}) to ${newValue} (${typeof newValue})`);
        return {
          ...stat,
          value: newValue
        };
      });
    }
    
    // Validate the incoming data
    try {
      console.log('Attempting to validate config data');
      // First check if there are any missing required fields
      const missingFields = [];
      for (const key of Object.keys(configSchema.shape)) {
        if (data[key] === undefined) {
          missingFields.push(key);
        }
      }
      if (missingFields.length > 0) {
        console.error('Missing required fields:', missingFields);
      }
      
      const validatedConfig = configSchema.parse(data);
      console.log('Config validation successful');
      
      // Write the updated config to file
      await fs.writeFile(
        CONFIG_PATH,
        JSON.stringify(validatedConfig, null, 2),
        'utf-8'
      );
      console.log('Config file updated successfully');
      
      return NextResponse.json({ success: true });
    } catch (validationError: unknown) {
      console.error('Validation error details:');
      if (validationError instanceof z.ZodError) {
        console.error(JSON.stringify(validationError.errors, null, 2));
      } else {
        console.error(validationError);
      }
      
      const errorDetails = validationError instanceof z.ZodError ? validationError.errors : 'Unknown validation error';
      return NextResponse.json(
        { error: 'Validation failed', details: errorDetails },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating config:', error);
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Failed to update configuration', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}