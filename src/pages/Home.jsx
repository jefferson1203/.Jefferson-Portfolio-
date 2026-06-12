import React from 'react'
import { useProfile } from '@/hooks/useProfile'
import GitHubStats from '@/components/GitHubStats'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiCalendar,
  FiCpu,
  FiAward,
} from 'react-icons/fi'

export default function Home() {
  const { profile, skills, education, loading, error, isDemo } = useProfile()

  if (loading) {
    return (
      <div className="space-y-12 py-10">
        {/* Hero Skeleton */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Skeleton className="h-28 w-28 rounded-full bg-zinc-900" />
          <Skeleton className="h-8 w-48 bg-zinc-900" />
          <Skeleton className="h-5 w-32 bg-zinc-900" />
          <Skeleton className="h-20 w-full max-w-md bg-zinc-900" />
        </div>

        <Separator className="border-zinc-900" />

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[300px] bg-zinc-900 rounded-xl" />
          <Skeleton className="h-[300px] bg-zinc-900 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error && !profile) {
    return (
      <div className="py-20 text-center text-red-400">
        <p className="font-bold">
          Une erreur est survenue lors du chargement du profil.
        </p>
        <p className="text-xs text-zinc-500 mt-2">{error}</p>
      </div>
    )
  }

  // Fallback defaults if database tables are empty
  const devProfile = profile || {
    full_name: 'Jefferson',
    title: 'Développeur Full Stack',
    bio: "Spécialisé dans la création d'applications web modernes et performantes. Expertise solide en React, Node.js, et architecture de bases de données cloud.",
    avatar_url:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    email: 'jefferson@example.com',
    github_url: 'https://github.com/github',
    linkedin_url: 'https://linkedin.com',
    twitter_url: 'https://twitter.com',
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Général'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div className="py-10 flex flex-col gap-12">
      {isDemo && (
        <div className="rounded-lg bg-zinc-900 border border-amber-900/20 p-3 text-center text-xs text-amber-550">
          Mode Démo : La connexion Supabase a échoué (les clés sont probablement des placeholders). Affichage de données locales.
        </div>
      )}
      {/* SECTION 1: Hero / Profil */}
      <section className="flex flex-col items-center text-center gap-6">
        <Avatar className="h-28 w-28 border-2 border-zinc-800 shadow-xl bg-zinc-900">
          <AvatarImage
            src={devProfile.avatar_url}
            alt={devProfile.full_name}
            className="object-cover"
          />
          <AvatarFallback className="bg-zinc-800 text-white font-black text-xl">
            {devProfile.full_name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {devProfile.full_name}
          </h1>
          <p className="text-sm sm:text-base text-indigo-400 font-bold uppercase tracking-wider">
            {devProfile.title}
          </p>
        </div>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
          {devProfile.bio}
        </p>

        {/* Social Links */}
        <div className="flex gap-4">
          {devProfile.github_url && (
            <a
              href={devProfile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:text-white text-zinc-400 flex items-center justify-center transition-all"
            >
              <FiGithub className="h-5 w-5" />
            </a>
          )}
          {devProfile.linkedin_url && (
            <a
              href={devProfile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:text-white text-zinc-400 flex items-center justify-center transition-all"
            >
              <FiLinkedin className="h-5 w-5" />
            </a>
          )}
          {devProfile.twitter_url && (
            <a
              href={devProfile.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:text-white text-zinc-400 flex items-center justify-center transition-all"
            >
              <FiTwitter className="h-5 w-5" />
            </a>
          )}
          {devProfile.email && (
            <a
              href={`mailto:${devProfile.email}`}
              className="h-10 w-10 rounded-full border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:text-white text-zinc-400 flex items-center justify-center transition-all"
            >
              <FiMail className="h-5 w-5" />
            </a>
          )}
        </div>
      </section>

      <Separator className="bg-zinc-900" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Skills & Education */}
        <div className="flex flex-col gap-10 col-span-1">
          {/* SECTION 2: Skills */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <FiCpu className="h-5 w-5 text-indigo-400" />
              Compétences Techniques
            </h2>

            <div className="flex flex-col gap-6 mt-2">
              {Object.keys(skillsByCategory).length > 0 ? (
                Object.entries(skillsByCategory).map(([category, catSkills]) => (
                  <div key={category} className="space-y-3">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      {category}
                    </span>
                    <div className="grid grid-cols-1 gap-3.5">
                      {catSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="space-y-1.5 bg-zinc-900/10 border border-zinc-900 p-3 rounded-lg"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-zinc-200">
                            <span>{skill.name}</span>
                            <span className="text-indigo-400">
                              {skill.level}%
                            </span>
                          </div>
                          <Progress
                            value={skill.level}
                            className="h-1.5 bg-zinc-800"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-550">
                  Aucune compétence ajoutée.
                </p>
              )}
            </div>
          </section>

          {/* SECTION 3: Education */}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <FiAward className="h-5 w-5 text-indigo-400" />
              Cursus & Formations Académiques
            </h2>

            <div className="relative border-l border-zinc-900 pl-6 ml-2 mt-4 flex flex-col gap-6">
              {education && education.length > 0 ? (
                education.map((edu) => (
                  <div key={edu.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                        <FiCalendar className="h-3.5 w-3.5" />
                        {edu.year_start} - {edu.year_end || 'Présent'}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1">
                        {edu.degree}
                      </h3>
                      <p className="text-xs text-indigo-400 font-medium">
                        {edu.school}
                      </p>
                      {edu.description && (
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed bg-zinc-950/30 p-2.5 rounded border border-zinc-900">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-550">
                  Aucun parcours d'éducation.
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: GitHub Stats & Repositories */}
        <div className="col-span-1">
          {/* SECTION 4: GitHub Stats (Standalone) */}
          <section>
            <GitHubStats githubUrl={devProfile.github_url} />
          </section>
        </div>
      </div>
    </div>
  )
}
