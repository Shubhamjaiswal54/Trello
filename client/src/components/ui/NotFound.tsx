import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import BrandMark from '@/components/BrandMark'
import { buttonVariants } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <BrandMark className="mb-10" />
      <div
        className="mb-8 rotate-[-3deg] rounded-[3px] bg-paper px-6 py-4 font-mono text-4xl font-semibold text-paper-foreground shadow-[0_10px_24px_rgba(0,0,0,0.35)]"
        aria-hidden="true"
      >
        404
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">This card isn’t pinned anywhere</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className={buttonVariants({ size: 'lg', className: 'mt-8' })}>
        <ArrowLeft />
        Back to home
      </Link>
    </div>
  )
}

export default NotFound
