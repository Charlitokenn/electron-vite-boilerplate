import { MoonIcon, SunIcon } from 'lucide-react'
import { Switch } from '@renderer/components/ui/switch'
import { useTheme } from '@renderer/components/theme-provider'

export const ModeToggle = () => {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      className="group inline-flex items-center gap-2 pr-5"
      data-state={isDark ? 'checked' : 'unchecked'}
    >
      <span
        className="group-data-[state=checked]:text-muted-foreground/70 cursor-pointer"
        onClick={() => setTheme('light')}
      >
        <SunIcon className="size-4" aria-hidden="true" />
      </span>
      <Switch
        checked={isDark}
        onCheckedChange={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label="Toggle between dark and light mode"
      />
      <span
        className="group-data-[state=unchecked]:text-muted-foreground/70 cursor-pointer"
        onClick={() => setTheme('dark')}
      >
        <MoonIcon className="size-4" aria-hidden="true" />
      </span>
    </div>
  )
}
