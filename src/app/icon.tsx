import { ImageResponse } from 'next/og'

export const runtime = 'edge'
 
export const size = {
  width: 32,
  height: 32,
}
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(to right, #f97316, #ec4899)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '8px',
        }}
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14 16.5V18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1.5" />
            <path d="M20 10h-2" />
            <path d="M6 10H4" />
            <path d="M17 16.5h.5a1.5 1.5 0 0 0 0-3H14v-2h1.5a1.5 1.5 0 0 0 0-3H7.5a1.5 1.5 0 0 0 0 3H9v2H7.5a1.5 1.5 0 0 0 0 3H9" />
            <path d="M14 9.5H9.5" />
            <path d="M5.5 9.5A2.5 2.5 0 0 1 8 7h8a2.5 2.5 0 0 1 2.5 2.5V16" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
