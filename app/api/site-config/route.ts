import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const slideSchema = z.object({
  image: z.string(),
  alt: z.string()
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
  slides: z.array(slideSchema)
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
    const data = await request.json();
    
    // Validate the incoming data
    const validatedConfig = configSchema.parse(data);
    
    // Write the updated config to file
    await fs.writeFile(
      CONFIG_PATH,
      JSON.stringify(validatedConfig, null, 2),
      'utf-8'
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating config:', error);
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 400 }
    );
  }
}