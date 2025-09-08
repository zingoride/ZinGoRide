import { ImageResponse } from 'next/og'

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
          background: 'hsl(var(--primary))',
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
            <path d="M12 17.5a1.5 1.5 0 0 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
            <path d="M15 6.5a1.5 1.5 0 0 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
            <path d="M18.5 14.5 16 12l-3 4 1 3h3.5"/>
            <path d="m6 15 4-4-2-3-3.5 4"/>
            <path d="M14 8.5 12 7l-3 4h3l2-1.5Z"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
