import React, { useState } from 'react'
import { useProjects } from '@/hooks/useProjects'
import ProjectCard from '@/components/ProjectCard'
import ProjectModal from '@/components/ProjectModal'
import { FiGrid } from 'react-icons/fi'
import { Skeleton } from '@/components/ui/skeleton'

export default function Projects() {
  const { projects, loading, isDemo } = useProjects()
  const [filter, setFilter] = useState('tous')
  const [selectedProject, setSelectedProject] = useState(null)

  const handleOpenDetails = (project) => {
    setSelectedProject(project)
  }

  const handleCloseDetails = () => {
    setSelectedProject(null)
  }

  const filteredProjects = projects.filter((project) => {
    if (filter === 'tous') return true
    if (filter === 'en_ligne') return project.status === 'en_ligne'
    if (filter === 'en_cours') return project.status === 'en_cours'
    if (filter === 'archive') return project.status === 'archive'
    return true
  })

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <Skeleton className="h-8 w-48 bg-zinc-900" />
            <Skeleton className="h-4 w-96 mt-2 bg-zinc-900" />
          </div>
          <Skeleton className="h-10 w-64 bg-zinc-900" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/10 min-h-[200px] grid grid-cols-1 md:grid-cols-5"
            >
              <div className="md:col-span-2 col-span-1 h-[200px] bg-zinc-950 border-r border-zinc-900 flex items-center justify-center p-4">
                <Skeleton className="h-full w-full bg-zinc-900" />
              </div>
              <div className="md:col-span-3 col-span-1 p-5 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-2/3 bg-zinc-900" />
                  <Skeleton className="h-3 w-full bg-zinc-900" />
                  <Skeleton className="h-3 w-5/6 bg-zinc-900" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-14 bg-zinc-900 rounded" />
                  <Skeleton className="h-5 w-14 bg-zinc-900 rounded" />
                  <Skeleton className="h-5 w-14 bg-zinc-900 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-6">
      {isDemo && (
        <div className="rounded-lg bg-zinc-900 border border-amber-900/20 p-3 text-center text-xs text-amber-550">
          Mode Démo : La connexion Supabase a échoué. Affichage des projets locaux.
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <FiGrid className="h-6 w-6 text-indigo-400" />
            Mes Projets
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Découvrez mes dernières réalisations, démos interactives et
            contributions open-source.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1.5 rounded-lg bg-zinc-950 p-1 border border-zinc-900 overflow-x-auto">
          {['tous', 'en_ligne', 'en_cours', 'archive'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-zinc-800 text-white shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {status === 'tous'
                ? 'Tous'
                : status === 'en_ligne'
                ? 'En ligne'
                : status === 'en_cours'
                ? 'En cours'
                : 'Archivés'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenDetails={handleOpenDetails}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center mt-12 rounded-xl border border-zinc-800 bg-zinc-900/10">
          <FiGrid className="h-10 w-10 text-zinc-650 mb-3" />
          <h3 className="text-base font-bold text-zinc-300">
            Aucun projet trouvé
          </h3>
          <p className="text-zinc-500 text-xs mt-1 max-w-xs">
            Il n'y a aucun projet correspondant à ce filtre pour le moment.
          </p>
        </div>
      )}

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  )
}
