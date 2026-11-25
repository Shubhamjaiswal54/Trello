import { useState, type FormEvent } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface QuickCreateProps {
  placeholder: string
  buttonLabel: string
  type?: 'text' | 'email'
  // Return true when the value was saved so the field is cleared.
  onCreate: (value: string) => Promise<boolean>
}

export default function QuickCreate({ placeholder, buttonLabel, type = 'text', onCreate }: QuickCreateProps) {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || busy) return
    setBusy(true)
    const ok = await onCreate(trimmed)
    setBusy(false)
    if (ok) setValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2 sm:w-auto">
      <Input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 sm:w-64"
        maxLength={120}
      />
      <Button type="submit" size="lg" disabled={busy || !value.trim()}>
        {busy ? <Loader2 className="animate-spin" /> : <Plus />}
        {buttonLabel}
      </Button>
    </form>
  )
}
