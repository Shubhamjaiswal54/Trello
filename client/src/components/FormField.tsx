import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormFieldProps extends ComponentProps<'input'> {
  id: string
  label: string
  error?: string
}

export default function FormField({ id, label, error, type, ...props }: FormFieldProps) {
  const [reveal, setReveal] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={isPassword && reveal ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={isPassword ? 'h-9 pr-9' : 'h-9'}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
            aria-label={reveal ? 'Hide password' : 'Show password'}
          >
            {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
