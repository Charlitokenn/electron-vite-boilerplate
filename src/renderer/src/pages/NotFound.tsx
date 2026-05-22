import { Button } from '@renderer/components/ui/base-button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppConfig } from '@renderer/config'

const NotFound = () => {
  const navigate = useNavigate()

  const handleBack = (): void => {
    // If there's a history entry to go back to, use it.
    // Otherwise fall back to home so the user is never stuck.
    if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate('/', { replace: true })
    }
  }

  return (
    <div className="grid min-h-screen w-full xl:grid-cols-2">
      <div className="flex flex-col p-16">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2 xl:justify-start">
          <div className="bg-primary flex size-8 items-center justify-center rounded-lg">
            <svg
              className="text-primary-foreground size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold">{AppConfig.app.name}</span>
        </div>

        <div className="mt-8 flex flex-1 flex-col items-center justify-center text-center xl:items-start xl:text-start">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-sm font-semibold">404</span>
          </div>
          <h1 className="mb-2 text-4xl font-bold">Page Not Found</h1>
          <p>Oops! The page you're trying to access doesn't exist.</p>
          <Button
            className="h-9 px-4 py-2 mt-8 cursor-pointer"
            asChild
            size="lg"
            onClick={handleBack}
          >
            <ArrowLeft />
            <span>Go Back</span>
          </Button>
        </div>
      </div>
      <div className="relative hidden xl:block">
        <img
          src="https://ui.shadcn.com/placeholder.svg"
          alt="placeholder image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.95] dark:invert"
        />
      </div>
    </div>
  )
}

export default NotFound
