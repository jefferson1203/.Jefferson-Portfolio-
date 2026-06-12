import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  FiUser,
  FiGrid,
  FiTrendingUp,
  FiLogOut,
  FiArrowRight,
  FiEye,
} from 'react-icons/fi'

export default function Dashboard() {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header with Welcome and Logout */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white">
            Console d'Administration
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Bienvenue <span className="text-indigo-400 font-semibold">{user?.email}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/">
            <Button
              variant="outline"
              className="border-zinc-800 text-zinc-350 hover:bg-zinc-800 bg-zinc-950 text-xs font-bold"
            >
              Retour au site
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="bg-red-950 text-red-200 hover:bg-red-900 flex items-center gap-2 text-xs font-bold"
          >
            <FiLogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* 4 shadcn Cards to manage different modules */}
      <h2 className="text-lg font-bold text-white mt-12 mb-6">
        Gestion des modules
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Manage Profile */}
        <Card className="border-zinc-800 bg-zinc-900/10 hover:border-zinc-700 transition-all flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-950 border border-indigo-900 text-indigo-400 flex items-center justify-center">
                <FiUser className="h-4.5 w-4.5" />
              </div>
              <CardTitle className="text-base font-bold text-white">
                Mon Profil
              </CardTitle>
            </div>
            <CardDescription className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Mettez à jour vos informations personnelles, votre biographie, compétences et liens sociaux.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 mt-auto">
            <Link to="/admin/profile">
              <Button
                size="sm"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white gap-1.5 font-bold text-xs"
              >
                Gérer le profil <FiArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 2: Manage Projects */}
        <Card className="border-zinc-800 bg-zinc-900/10 hover:border-zinc-700 transition-all flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-950 border border-emerald-900 text-emerald-400 flex items-center justify-center">
                <FiGrid className="h-4.5 w-4.5" />
              </div>
              <CardTitle className="text-base font-bold text-white">
                Mes Projets
              </CardTitle>
            </div>
            <CardDescription className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Ajoutez de nouveaux projets, gérez les liens GitHub/Déploiement et associez-y vos technos.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 mt-auto">
            <Link to="/admin/projects">
              <Button
                size="sm"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white gap-1.5 font-bold text-xs"
              >
                Gérer les projets <FiArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 3: Manage Trainings */}
        <Card className="border-zinc-800 bg-zinc-900/10 hover:border-zinc-700 transition-all flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-pink-950 border border-pink-900 text-pink-400 flex items-center justify-center">
                <FiTrendingUp className="h-4.5 w-4.5" />
              </div>
              <CardTitle className="text-base font-bold text-white">
                Mes Formations
              </CardTitle>
            </div>
            <CardDescription className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Planifiez de nouveaux cours, suivez votre progression globale et rédigez vos notes.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 mt-auto">
            <Link to="/admin/trainings">
              <Button
                size="sm"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white gap-1.5 font-bold text-xs"
              >
                Gérer les formations <FiArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Card 4: View Public Site */}
        <Card className="border-zinc-800 bg-zinc-900/10 hover:border-zinc-700 transition-all flex flex-col h-full">
          <CardHeader className="pb-4 flex-grow">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center border border-zinc-700">
                <FiEye className="h-4.5 w-4.5" />
              </div>
              <CardTitle className="text-base font-bold text-white">
                Site Public
              </CardTitle>
            </div>
            <CardDescription className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Consultez la version publique de votre portfolio pour valider le rendu final de vos modifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 mt-auto">
            <Link to="/">
              <Button
                size="sm"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white gap-1.5 font-bold text-xs"
              >
                Voir le portfolio <FiArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
