import { ImageResponse } from 'next/og'
import { Bike } from 'lucide-react';

export const runtime = 'edge'
 
export const size = {
  width: 512,
  height: 512,
}
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 256,
          background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '96px',
        }}
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="300"
            height="300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m18 17 4 4-4 4"/>
            <path d="m10 14-4-4 4-4"/>
            <path d="m18 7-4 4-4-4"/>
            <path d="m6 21-4-4 4-4"/>
            <path d="m14 3-4 4-4-4"/>
            <path d="M7 14h11"/>
            <path d="M10 3h5"/>
            <path d="M10 21h5"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
