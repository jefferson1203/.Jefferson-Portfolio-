import React, { useState } from 'react'
import { useTrainings } from '@/hooks/useTrainings'
import TrainingCard from '@/components/TrainingCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { FiTrendingUp, FiBookOpen } from 'react-icons/fi'

export default function Trainings() {
  const { trainings, loading, isDemo } = useTrainings()
  const [statusFilter, setStatusFilter] = useState('tous')
  const [categoryFilter, setCategoryFilter] = useState('toutes')

  // Dynamic list of unique categories
  const categories = [
    'toutes',
    ...new Set(trainings.map((t) => t.category).filter(Boolean)),
  ]

  // Filter combined
  const filteredTrainings = trainings.filter((t) => {
    const matchStatus = statusFilter === 'tous' || t.status === statusFilter
    const matchCategory =
      categoryFilter === 'toutes' || t.category === categoryFilter
    return matchStatus && matchCategory
  })

  // Completed count for the counter
  const completedCount = trainings.filter((t) => t.status === 'termine').length

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 flex flex-col gap-6">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div>
            <Skeleton className="h-8 w-64 bg-zinc-900" />
            <Skeleton className="h-4 w-96 mt-2 bg-zinc-900" />
          </div>
          <Skeleton className="h-10 w-48 bg-zinc-900" />
        </div>

        {/* Categories Skeletons */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 bg-zinc-900 rounded-full" />
          <Skeleton className="h-6 w-20 bg-zinc-900 rounded-full" />
          <Skeleton className="h-6 w-24 bg-zinc-900 rounded-full" />
        </div>

        {/* Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/10 min-h-[220px] p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-24 bg-zinc-900" />
                <Skeleton className="h-5 w-16 bg-zinc-900 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-5/6 bg-zinc-900" />
                <Skeleton className="h-3 w-1/3 bg-zinc-900" />
              </div>
              <div className="space-y-1.5 mt-auto">
                <Skeleton className="h-3 w-full bg-zinc-900" />
                <Skeleton className="h-1.5 w-full bg-zinc-900 rounded-full" />
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
        <div className="rounded-lg bg-zinc-900 border border-amber-900/20 p-3 text-center text-xs text-amber-550 animate-pulse">
          Mode Démo : La connexion Supabase a échoué. Affichage des formations locales.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <FiTrendingUp className="h-6 w-6 text-indigo-400" />
            Formations & Certifications
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Suivi en temps réel de mes apprentissages, auto-formations et certifications professionnelles.
          </p>
        </div>

        {/* Counter & Status Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Counter */}
          <div className="bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-900">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {filteredTrainings.length} formation{filteredTrainings.length !== 1 ? 's' : ''} • {completedCount} terminée{completedCount !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Status Tabs */}
          <Tabs
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-fit"
          >
            <TabsList className="bg-zinc-950 border border-zinc-900 p-0.5 h-9">
              <TabsTrigger
                value="tous"
                className="text-xs px-3 py-1.5 font-bold uppercase tracking-wider"
              >
                Tous
              </TabsTrigger>
              <TabsTrigger
                value="en_cours"
                className="text-xs px-3 py-1.5 font-bold uppercase tracking-wider"
              >
                En cours
              </TabsTrigger>
              <TabsTrigger
                value="termine"
                className="text-xs px-3 py-1.5 font-bold uppercase tracking-wider"
              >
                Terminés
              </TabsTrigger>
              <TabsTrigger
                value="a_faire"
                className="text-xs px-3 py-1.5 font-bold uppercase tracking-wider"
              >
                À faire
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 items-center pb-2">
          <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider mr-1">
            Filtrer par catégorie :
          </span>
          {categories.map((cat) => {
            const isActive = categoryFilter === cat
            return (
              <Badge
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-all py-1 px-2.5 rounded-md hover:scale-105 ${
                  isActive
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent'
                    : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat === 'toutes' ? 'Toutes' : cat}
              </Badge>
            )
          })}
        </div>
      )}

      {/* Grid of Trainings */}
      {filteredTrainings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredTrainings.map((training) => (
            <TrainingCard key={training.id} training={training} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center mt-8 rounded-xl border border-zinc-800 bg-zinc-900/10">
          <FiBookOpen className="h-10 w-10 text-zinc-650 mb-3 animate-pulse" />
          <h3 className="text-base font-bold text-zinc-300">
            Aucune formation trouvée
          </h3>
          <p className="text-zinc-500 text-xs mt-1 max-w-xs">
            Aucune formation dans cette catégorie pour le moment.
          </p>
        </div>
      )}
    </div>
  )
}
