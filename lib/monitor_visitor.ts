import { UAParser } from 'ua-parser-js';
import fs from 'fs';
import path from 'path';

export interface Visitor {
  ip: string;
  location: {
    country?: string;
    region?: string;
    city?: string;
  };
  browser: {
    name?: string;
    version?: string;
  };
  os: {
    name?: string;
    version?: string;
  };
  device: {
    vendor?: string; 
    model?: string;
    type?: string;
  };
  visitedAt: string;
}

export const monitorVisitor = async (req: Request) => {
  try {
    // Mendapatkan IP address dari request headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    
    // Mendapatkan info lokasi dari ipapi.co
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoResponse.json();
    
    // Mendapatkan info browser, OS dan device
    const ua = req.headers.get('user-agent') || '';
    const parser = new UAParser();
    parser.setUA(ua);
    const browserInfo = parser.getBrowser();
    const osInfo = parser.getOS();
    const deviceInfo = parser.getDevice();

    // Menyiapkan data visitor
    const visitorData: Visitor = {
      ip,
      location: {
        country: geoData?.country_name || 'Unknown',
        region: geoData?.region || 'Unknown',
        city: geoData?.city || 'Unknown'
      },
      browser: {
        name: browserInfo.name || 'Unknown',
        version: browserInfo.version || 'Unknown'
      },
      os: {
        name: osInfo.name || 'Unknown',
        version: osInfo.version || 'Unknown'
      },
      device: {
        vendor: deviceInfo.vendor || 'Unknown',
        model: deviceInfo.model || 'Unknown',
        type: deviceInfo.type || 'Unknown'
      },
      visitedAt: new Date().toISOString()
    };

    // Path ke file visitor.json
    const filePath = path.join(process.cwd(), 'data', 'visitor.json');
    
    // Membaca data existing
    let visitors: Visitor[] = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      visitors = JSON.parse(fileContent);
    }
    
    // Menambahkan data visitor baru
    visitors.push(visitorData);
    
    // Menyimpan kembali ke file
    fs.writeFileSync(filePath, JSON.stringify(visitors, null, 2));

    return visitorData;
  } catch (error) {
    console.error('Error monitoring visitor:', error);
    throw error;
  }
}
