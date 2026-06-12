import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { FiBookOpen } from 'react-icons/fi'
import { SiUdemy, SiYoutube } from 'react-icons/si'

// Custom learning/graduation stack SVG representing OpenClassrooms
function OpenClassroomsIcon({ className, title }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <title>{title}</title>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

export default function TrainingCard({ training }) {
  const { title, url, platform, category, status, progress, notes } = training

  // Get Platform Logo/Icon
  const getPlatformIcon = () => {
    const iconSize = "h-5 w-5 transition-transform duration-300 group-hover/card:scale-110"
    const lowerPlatform = platform?.toLowerCase() || ''

    if (lowerPlatform.includes('udemy')) {
      return <SiUdemy className={`${iconSize} text-orange-550`} title="Udemy" />
    }
    if (lowerPlatform.includes('youtube')) {
      return <SiYoutube className={`${iconSize} text-red-600`} title="YouTube" />
    }
    if (lowerPlatform.includes('openclassrooms')) {
      return <OpenClassroomsIcon className={`${iconSize} text-emerald-400`} title="OpenClassrooms" />
    }
    return <FiBookOpen className={`${iconSize} text-zinc-400`} title={platform || 'Formation'} />
  }

  // Get Status Badge
  const getStatusBadge = () => {
    switch (status) {
      case 'en_cours':
        return (
          <Badge className="bg-blue-950/80 text-blue-400 border border-blue-900/30 text-[10px] font-bold uppercase tracking-wider animate-pulse hover:bg-blue-950/80">
            En cours
          </Badge>
        )
      case 'termine':
        return (
          <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-900/30 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-950/80">
            Terminé
          </Badge>
        )
      default:
        return (
          <Badge className="bg-zinc-900/80 text-zinc-400 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-900/80">
            À faire
          </Badge>
        )
    }
  }

  // Get progress percent based on status
  const displayProgress = status === 'termine' ? 100 : status === 'a_faire' ? 0 : (progress || 0)

  // Get progress bar color class
  const getProgressBarClass = () => {
    if (status === 'termine') {
      return '[&>[data-slot=progress-indicator]]:bg-emerald-500 bg-emerald-950/20'
    }
    if (status === 'en_cours') {
      return '[&>[data-slot=progress-indicator]]:bg-blue-500 bg-blue-950/20'
    }
    return '[&>[data-slot=progress-indicator]]:bg-zinc-700 bg-zinc-900/60'
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/10 hover:border-zinc-700 hover:bg-zinc-900/20 transition-all duration-300 flex flex-col justify-between h-full min-h-[220px]">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {getPlatformIcon()}
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              {platform}
            </span>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="px-5 py-2 flex-grow flex flex-col justify-between gap-4">
        <div>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-white hover:text-indigo-400 transition-colors line-clamp-2 tracking-tight"
            >
              {title}
            </a>
          ) : (
            <h3 className="text-sm font-bold text-white line-clamp-2 tracking-tight">
              {title}
            </h3>
          )}
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1 block">
            {category || 'Général'}
          </span>
        </div>

        {/* Progress section */}
        <div className="space-y-1.5 mt-auto">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            <span>Progression</span>
            <span className={status === 'termine' ? 'text-emerald-400' : status === 'en_cours' ? 'text-blue-400' : 'text-zinc-500'}>
              {displayProgress}%
            </span>
          </div>
          <Progress
            value={displayProgress}
            className={`h-1.5 ${getProgressBarClass()}`}
          />
        </div>
      </CardContent>

      {/* Footer */}
      {(notes || url) && (
        <CardFooter className="p-5 pt-3 border-t border-zinc-900 flex flex-col items-stretch gap-3">
          {notes && (
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 bg-zinc-950/30 p-2.5 rounded border border-zinc-900/40">
              {notes}
            </p>
          )}
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-extrabold text-indigo-400 hover:text-indigo-350 hover:underline flex items-center gap-1.5 transition-colors self-end"
            >
              Accéder →
            </a>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
