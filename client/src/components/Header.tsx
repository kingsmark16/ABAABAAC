import { DiamondPlus, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { useLocation } from "react-router"
import { useAuth } from "@/hooks/auth/useAuth"

const Header = () => {
  const [dark, setDark] = useState(false)
  const { isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith("/admin")

  const toggleTheme = () => {
    setDark((prev) => !prev)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-5 md:px-32 backdrop-blur-xl bg-white/10 dark:bg-black/20 border-b border-white/20 dark:border-white/10 shadow-lg">
      {/* Left — Logo + Name */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shrink-0">
          <span className="text-white font-extrabold text-base leading-none select-none">CR</span>
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground select-none">
          CollegeRage
        </span>
      </div>

      {/* Right — Actions */}
      <div className="ml-auto flex items-center gap-1">
        {isAuthenticated && isAdminPage && (
          <button
            className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-foreground cursor-pointer"
            aria-label="Create post"
          >
            <DiamondPlus className="w-5 h-5" />
          </button>
        )}

        {isAuthenticated && isAdminPage && (
          <button
            onClick={logout}
            className="px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-foreground cursor-pointer text-sm font-medium"
            aria-label="Logout"
          >
            Logout
          </button>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors text-foreground cursor-pointer"
          aria-label="Toggle theme"
        >
          {dark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    </header>
  )
}

export default Header