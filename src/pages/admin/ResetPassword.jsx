import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { FiLock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'
import { toast } from 'sonner'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    try {
      await updatePassword(password)
      setSuccess(true)
      toast.success('Mot de passe mis à jour avec succès.')
      setTimeout(() => {
        navigate('/admin/login')
      }, 3000)
    } catch (err) {
      console.error(err)
      setError(err.message || 'Impossible de mettre à jour le mot de passe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/40 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center pb-6 border-b border-zinc-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-950 text-indigo-400 border border-indigo-900 mb-2">
            <FiLock className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-white">
            Nouveau mot de passe
          </CardTitle>
          <CardDescription className="text-zinc-400 text-xs">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </CardDescription>
        </CardHeader>

        {success ? (
          <CardContent className="space-y-4 pt-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900 mb-4">
              <FiCheckCircle className="h-6 w-6" />
            </div>
            <p className="text-sm text-zinc-300">
              Votre mot de passe a été réinitialisé avec succès !
            </p>
            <p className="text-xs text-zinc-500">
              Redirection vers la page de connexion dans quelques instants...
            </p>
            <Button
              onClick={() => navigate('/admin/login')}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
            >
              Aller à la connexion
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-900/50 p-3 text-xs text-red-400">
                  <FiAlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-zinc-300 text-xs font-semibold"
                >
                  Nouveau mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-650 focus-visible:ring-indigo-500 pl-10"
                  />
                  <FiLock className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-zinc-300 text-xs font-semibold"
                >
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-650 focus-visible:ring-indigo-500 pl-10"
                  />
                  <FiLock className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-6 flex flex-col gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer le mot de passe'}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
