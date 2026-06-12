import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
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
import { FiLock, FiMail, FiAlertTriangle } from 'react-icons/fi'

export default function Login() {
  const { user, signIn, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isResetMode, setIsResetMode] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const navigate = useNavigate()

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Identifiants invalides. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await resetPassword(email)
      setResetSuccess(true)
    } catch (err) {
      console.error(err)
      setError(err.message || "Impossible d'envoyer le mail de récupération.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/40 backdrop-blur-md">
        {isResetMode ? (
          <>
            <CardHeader className="space-y-1 text-center pb-6 border-b border-zinc-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-950 text-indigo-400 border border-indigo-900 mb-2">
                <FiMail className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight text-white">
                Récupération de compte
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Saisissez votre adresse email pour recevoir un lien de réinitialisation.
              </CardDescription>
            </CardHeader>

            {resetSuccess ? (
              <div className="p-6 space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 text-emerald-400 border border-emerald-900 mb-2">
                  <FiCheckCircle className="h-6 w-6" />
                </div>
                <p className="text-sm text-zinc-300">
                  Si un compte est associé à cette adresse, un e-mail de récupération y a été envoyé.
                </p>
                <Button
                  onClick={() => {
                    setIsResetMode(false)
                    setResetSuccess(false)
                    setError('')
                  }}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold"
                >
                  Retour à la connexion
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit}>
                <CardContent className="space-y-4 pt-6">
                  {error && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-900/50 p-3 text-xs text-red-400">
                      <FiAlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-zinc-300 text-xs font-semibold"
                    >
                      Adresse Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-650 focus-visible:ring-indigo-500 pl-10"
                      />
                      <FiMail className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 pb-6 flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    {loading ? 'Envoi...' : 'Envoyer le lien'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(false)
                      setError('')
                    }}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Retour à la connexion
                  </button>
                </CardFooter>
              </form>
            )}
          </>
        ) : (
          <>
            <CardHeader className="space-y-1 text-center pb-6 border-b border-zinc-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-950 text-indigo-400 border border-indigo-900 mb-2">
                <FiLock className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold tracking-tight text-white">
                Espace Admin
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Connectez-vous pour gérer vos informations, projets et formations.
              </CardDescription>
            </CardHeader>

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
                    htmlFor="email"
                    className="text-zinc-300 text-xs font-semibold"
                  >
                    Adresse Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-zinc-950 border-zinc-800 text-white placeholder-zinc-650 focus-visible:ring-indigo-500 pl-10"
                    />
                    <FiMail className="absolute left-3 top-3 h-4 w-4 text-zinc-600" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-zinc-300 text-xs font-semibold"
                    >
                      Mot de passe
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true)
                        setError('')
                      }}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
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
              </CardContent>

              <CardFooter className="pt-2 pb-6 flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </Button>
                <span className="text-[10px] text-zinc-500 text-center">
                  Pour des raisons de sécurité, cette zone est réservée à
                  l'administrateur du portfolio.
                </span>
              </CardFooter>
            </form>
          </>
        )}
      </Card>
    </div>
  )
}
