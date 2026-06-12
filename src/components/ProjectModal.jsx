import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FiExternalLink, FiGithub, FiLink } from 'react-icons/fi'

export default function ProjectModal({ project, isOpen, onClose }) {
  const [iframeError, setIframeError] = useState(false)

  if (!project) return null

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

  const handleVisit = (e) => {
    if (e) e.stopPropagation()
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const showIframe = url && !iframe_blocked && !iframeError

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-800 text-white p-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="pb-4 border-b border-zinc-900">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-xl font-extrabold tracking-tight text-white">
              {title}
            </DialogTitle>
            {getStatusBadge()}
          </div>
          <DialogDescription className="text-zinc-400 text-xs mt-1">
            Détails et aperçu en temps réel du projet.
          </DialogDescription>
        </DialogHeader>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 overflow-y-auto max-h-[55vh] pr-1">
          {/* Left Column: Iframe live preview / screenshot fallback */}
          <div className="relative h-[400px] w-full rounded-lg border border-zinc-900 bg-zinc-950 overflow-hidden group">
            {showIframe ? (
              <div className="w-full h-full relative">
                {/* Cover overlay to intercept clicks and open URL in new tab */}
                <div
                  onClick={handleVisit}
                  className="absolute inset-0 z-10 cursor-pointer"
                />
                <iframe
                  src={url}
                  title={title}
                  className="w-[111.11%] h-[111.11%] border-none bg-white scale-[0.9] origin-top-left"
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
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4 text-center text-zinc-650">
                    <FiExternalLink className="h-8 w-8 mb-2 animate-bounce" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {title}
                    </span>
                    <span className="text-[10px] mt-1">Aperçu indisponible</span>
                  </div>
                )}
              </div>
            )}

            {/* Overlay icon in top right */}
            {url && (
              <div
                onClick={handleVisit}
                className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-zinc-950/80 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer shadow-lg hover:scale-105"
                title="Ouvrir dans un nouvel onglet"
              >
                <FiExternalLink className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Right Column: Details & Description */}
          <div className="flex flex-col gap-4 justify-start">
            {/* Deployment URL with icon */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Déploiement
              </span>
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-350 hover:underline flex items-center gap-1.5 font-semibold transition-colors w-fit"
                >
                  <FiLink className="h-3.5 w-3.5" />
                  {url}
                </a>
              ) : (
                <span className="text-xs text-zinc-600 italic">
                  Pas de déploiement en ligne
                </span>
              )}
            </div>

            {/* GitHub with icon */}
            {github_url && (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Code Source
                </span>
                <a
                  href={github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-350 hover:underline flex items-center gap-1.5 font-semibold transition-colors w-fit"
                >
                  <FiGithub className="h-3.5 w-3.5" />
                  {github_url}
                </a>
              </div>
            )}

            {/* Stack/Tools badges (all tools) */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Technologies / Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {tools && tools.length > 0 ? (
                  tools.map((tool) => (
                    <Badge
                      key={tool.id}
                      variant="secondary"
                      className="bg-zinc-900 text-zinc-350 border border-zinc-800 text-[10px] font-semibold hover:bg-zinc-900"
                    >
                      {tool.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-zinc-650 italic">
                    Aucune technologie associée
                  </span>
                )}
              </div>
            </div>

            {/* Accordion shadcn for description */}
            <div className="mt-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description" className="border-b border-zinc-900">
                  <AccordionTrigger className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider py-2 hover:no-underline flex items-center justify-between">
                    Description
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-zinc-300 leading-relaxed pt-2">
                    {description || "Aucune description disponible pour ce projet."}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="mt-auto border-t border-zinc-900 pt-4">
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs bg-zinc-950 font-bold h-9"
            >
              Fermer
            </Button>
            {url && (
              <Button
                onClick={handleVisit}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold gap-1.5 h-9"
              >
                Visiter le site <FiExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
