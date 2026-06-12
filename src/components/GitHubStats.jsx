import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  FiGithub,
  FiUsers,
  FiFolder,
  FiStar,
  FiGitBranch,
  FiBookOpen,
} from 'react-icons/fi'

export default function GitHubStats({ githubUrl }) {
  // Extract username from GitHub URL
  const getUsername = (url) => {
    if (!url) return ''
    const cleaned = url.replace(/\/$/, '')
    const parts = cleaned.split('/')
    return parts[parts.length - 1] || ''
  }

  const username = getUsername(githubUrl)

  const [stats, setStats] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(!!username)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) return


    const fetchGitHubData = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch user info
        const userRes = await fetch(`https://api.github.com/users/${username}`)
        if (!userRes.ok) {
          throw new Error(
            "Impossible de charger les statistiques depuis l'API GitHub"
          )
        }
        const userData = await userRes.json()
        setStats({
          followers: userData.followers,
          following: userData.following,
          public_repos: userData.public_repos,
          avatar_url: userData.avatar_url,
          login: userData.login,
        })

        // Fetch user repos (sorted by updated date)
        const reposRes = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
        )
        if (!reposRes.ok) {
          throw new Error('Impossible de charger les dépôts GitHub')
        }
        const reposData = await reposRes.json()

        const recentRepos = reposData.filter((repo) => !repo.fork).slice(0, 4)

        setRepos(recentRepos)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [username])

  if (!githubUrl || !username) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/10 p-6 text-center text-zinc-500">
        <FiGithub className="mx-auto h-8 w-8 text-zinc-700 mb-2" />
        <p className="text-xs">Aucun lien GitHub configuré dans le profil.</p>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[120px] w-full rounded-xl bg-zinc-900" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-[100px] w-full rounded-xl bg-zinc-900" />
          <Skeleton className="h-[100px] w-full rounded-xl bg-zinc-900" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-900/50 bg-red-950/20 p-6 text-center text-red-450">
        <FiGithub className="mx-auto h-8 w-8 text-red-500 mb-2" />
        <p className="text-xs">{error}</p>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Header Card */}
      <Card className="border-zinc-800 bg-zinc-900/10">
        <CardHeader className="pb-4 border-b border-zinc-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiGithub className="h-5 w-5 text-white" />
              <CardTitle className="text-base font-bold text-white">
                Statistiques GitHub
              </CardTitle>
            </div>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-white hover:underline transition-colors"
            >
              @{stats?.login}
            </a>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 py-6">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-zinc-950/50 border border-zinc-900">
            <FiUsers className="h-4 w-4 text-indigo-400 mb-1.5" />
            <span className="text-xl font-black text-white">
              {stats?.followers}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">
              Abonnés
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-zinc-950/50 border border-zinc-900">
            <FiUsers className="h-4 w-4 text-emerald-400 mb-1.5" />
            <span className="text-xl font-black text-white">
              {stats?.following}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">
              Abonnements
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-zinc-950/50 border border-zinc-900">
            <FiFolder className="h-4 w-4 text-pink-400 mb-1.5" />
            <span className="text-xl font-black text-white">
              {stats?.public_repos}
            </span>
            <span className="text-[10px] text-zinc-500 font-medium">
              Dépôts publics
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Repos */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <FiBookOpen className="h-4 w-4 text-indigo-400" />
          Projets GitHub Récents
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-4 hover:border-zinc-700 transition-all flex flex-col justify-between min-h-[120px] group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors truncate">
                    {repo.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-semibold border-zinc-800 text-zinc-450 bg-zinc-950 px-1.5 py-0.5"
                  >
                    Public
                  </Badge>
                </div>
                {repo.description && (
                  <p className="text-zinc-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {repo.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 mt-3 text-[11px] text-zinc-500">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FiStar className="h-3.5 w-3.5" />
                  {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <FiGitBranch className="h-3.5 w-3.5" />
                  {repo.forks_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
