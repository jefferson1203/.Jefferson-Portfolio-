import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FiGithub, FiExternalLink, FiEye } from 'react-icons/fi'

export default function ProjectCard({ project, onOpenDetails }) {
  const {
    title,
    description,
    url,
    github_url,
    status,
    iframe_blocked,
    screenshot_url,
    tools,
  } = project
  const [iframeError, setIframeError] = useState(false)

  const getStatusBadge = () => {
    switch (status) {
      case 'en_ligne':
        return (
          <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px] hover:bg-emerald-950">
            En ligne
          </Badge>
        )
      case 'en_cours':
        return (
          <Badge className="bg-amber-950 text-amber-400 border border-amber-800/40 text-[10px] hover:bg-amber-950">
            En cours
          </Badge>
        )
      default:
        return (
          <Badge className="bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px] hover:bg-zinc-900">
            Archivé
          </Badge>
        )
    }
  }

  const truncateUrl = (str) => {
    if (!str) return ''
    const cleanUrl = str.replace(/^https?:\/\//, '')
    return cleanUrl.length > 25 ? `${cleanUrl.substring(0, 22)}...` : cleanUrl
  }

  const handleVisit = (e) => {
    e.stopPropagation()
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const showIframe = url && !iframe_blocked && !iframeError

  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-900/10 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all duration-300">
      <CardContent className="p-0 grid grid-cols-1 md:grid-cols-5 h-full min-h-[200px]">
        {/* Left Column: Iframe Preview or Screenshot */}
        <div className="md:col-span-2 col-span-1 relative h-[200px] w-full bg-zinc-950 border-r border-zinc-900 overflow-hidden group">
          {showIframe ? (
            <div className="w-full h-full">
              {/* Cover overlay to intercept clicks and prevent interaction with iframe */}
              <div
                onClick={handleVisit}
                className="absolute inset-0 z-10 cursor-pointer"
              />
              <iframe
                src={url}
                title={title}
                className="w-full h-full border-none bg-white scale-[0.9] origin-top-left"
                sandbox="allow-scripts allow-same-origin"
                onError={() => setIframeError(true)}
              />
            </div>
          ) : (
            <div
              onClick={handleVisit}
              className="w-full h-full cursor-pointer flex items-center justify-center bg-zinc-900"
            >
              {screenshot_url ? (
                <img
                  src={screenshot_url}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={() => setIframeError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-4 text-center text-zinc-650">
                  <FiExternalLink className="h-8 w-8 mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {title}
                  </span>
                  <span className="text-[10px] mt-1">Aperçu indisponible</span>
                </div>
              )}
            </div>
          )}

          {/* Smooth hover overlay */}
          {url && (
            <div
              onClick={handleVisit}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20 cursor-pointer"
            >
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 shadow-lg transition-all duration-200 hover:scale-105"
              >
                Visiter →
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Project Details */}
        <div className="md:col-span-3 col-span-1 p-5 flex flex-col justify-between h-full gap-4">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-tight">
                {title}
              </h3>
              {getStatusBadge()}
            </div>

            {description && (
              <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed min-h-[2.5rem]">
                {description}
              </p>
            )}

            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-400 hover:text-indigo-350 hover:underline flex items-center gap-1.5 font-semibold transition-colors w-fit"
              >
                <FiExternalLink className="h-3.5 w-3.5" />
                {truncateUrl(url)}
              </a>
            ) : (
              <span className="text-[11px] text-zinc-650 italic">
                Pas de déploiement en ligne
              </span>
            )}
          </div>

          <div className="space-y-3 mt-auto">
            {/* Tools list */}
            <div className="flex flex-wrap gap-1.5">
              {tools && tools.length > 0 ? (
                <>
                  {tools.slice(0, 3).map((tool) => (
                    <Badge
                      key={tool.id}
                      variant="secondary"
                      className="bg-zinc-800 text-zinc-300 border border-zinc-700/30 text-[9px] font-semibold hover:bg-zinc-800"
                    >
                      {tool.name}
                    </Badge>
                  ))}
                  {tools.length > 3 && (
                    <Badge
                      variant="outline"
                      className="border-zinc-800 text-zinc-500 text-[9px] font-semibold"
                    >
                      +{tools.length - 3} autres
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-zinc-600">
                  Aucune technologie associée
                </span>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center gap-2 pt-2 border-t border-zinc-900">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenDetails(project)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 flex items-center gap-1.5 text-xs font-bold px-2.5 h-8"
              >
                <FiEye className="h-4 w-4" />
                Voir détails
              </Button>

              {github_url && (
                <a href={github_url} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-zinc-800 text-zinc-450 hover:text-white hover:bg-zinc-900/50 bg-zinc-950"
                  >
                    <FiGithub className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
