import type { ComponentType, ReactNode } from 'react'
import DotField from '@/components/DotField'
import BrandMark from '@/components/BrandMark'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// DotField is a JS React Bits component without type declarations.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Dots = DotField as ComponentType<any>

export default function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="fixed inset-0 -z-10 bg-background" aria-hidden="true">
        <Dots
          dotRadius={1.4}
          dotSpacing={16}
          bulgeStrength={50}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={420}
          cursorForce={0.08}
          bulgeOnly
          gradientFrom="#5b7ea3"
          gradientTo="#d1495b"
          glowColor="#12151b"
        />
      </div>

      <BrandMark className="mb-8 text-lg" />

      <Card className="w-full max-w-sm bg-card/90 shadow-2xl shadow-black/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      <p className="mt-6 text-sm text-muted-foreground">{footer}</p>
    </div>
  )
}
