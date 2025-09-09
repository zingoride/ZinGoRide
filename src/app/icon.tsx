
import { ImageResponse } from 'next/og'
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { Package2, Car, Rocket, Bike, Shield, Ship, Bus, Train, Plane, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';

// Route segment config
export const runtime = 'nodejs'

// Image metadata
export const size = {
  width: 512,
  height: 512,
}
export const contentType = 'image/png'

type LogoType = 'Default' | 'Car' | 'Rocket' | 'Bike' | 'Shield' | 'Ship' | 'Bus' | 'Train' | 'Plane' | 'Bot' | 'ZR';

const ZRLogoComponent = ({ className }: { className?: string }) => (
  <span className={cn("font-bold text-4xl tracking-tighter", className)}>ZR</span>
);

const iconMap: Record<LogoType, React.ComponentType<{ className?: string, strokeWidth?: number }>> = {
    Default: Package2,
    Car: Car,
    Rocket: Rocket,
    Bike: Bike,
    Shield: Shield,
    Ship: Ship,
    Bus: Bus,
    Train: Train,
    Plane: Plane,
    Bot: Bot,
    ZR: ZRLogoComponent as any,
};

async function getLogoFromConfig(): Promise<LogoType> {
    try {
        const { db } = getFirebaseAdmin();
        const configRef = db.collection('configs').doc('appConfig');
        const configSnap = await configRef.get();
        if (configSnap.exists) {
            const configData = configSnap.data();
            if (configData && configData.logo && iconMap[configData.logo as LogoType]) {
                return configData.logo;
            }
        }
    } catch (error) {
        console.error("Error fetching logo config for icon:", error);
    }
    // Return a default logo if anything fails
    return 'ZR';
}

// Image generation
export default async function Icon() {
  const logoName = await getLogoFromConfig();
  const IconComponent = iconMap[logoName];

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 256,
          background: '#10B981', // Careem Green
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '96px',
        }}
      >
        <IconComponent strokeWidth={1.5} />
      </div>
    ),
    {
      ...size,
    }
  )
}
