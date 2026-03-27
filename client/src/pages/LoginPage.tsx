

import { useEffect, useState, type FormEvent } from "react"
import type { AxiosError } from "axios"
import { useNavigate } from "react-router"
import { useAuth } from "@/hooks/auth/useAuth"
import { useLogin } from "@/hooks/auth/useLogin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import errorVideo from "@/assets/error.mp4"
import Particles from "@/components/Particles"

const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showErrorModal, setShowErrorModal] = useState(false)
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/admin", { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await loginMutation.mutateAsync({ username, password })
      navigate("/admin", { replace: true })
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>
      setError(axiosError.response?.data?.error || "Unable to connect to server")
      setShowErrorModal(true)
    }
  }

  if (authLoading || isAuthenticated) {
    return null
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <Particles
            className="w-full h-full"
            particleColors={["#ffffff"]}
            particleCount={500}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
        />
      </div>
      <div className="flex min-h-screen items-center justify-center px-4 relative z-10">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] max-w-sm overflow-hidden p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-lg sm:text-xl">
              Pal pal kaba? Wrong credentials!
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center overflow-hidden">
            <video
              src={errorVideo}
              autoPlay
              loop
              className="max-h-[60vh] w-full rounded-md object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LoginPage