import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIsDemo(false)
    try {
      if (
        !supabase.supabaseUrl ||
        supabase.supabaseUrl.includes('placeholder.supabase.co')
      ) {
        throw new Error('Supabase Url is placeholder')
      }

      const { data, error: err } = await supabase
        .from('projects')
        .select('*, tools(*)')
        .order('order_index', { ascending: true })

      if (err) throw err
      setProjects(data || [])
    } catch (err) {
      console.warn('Using local fallback projects:', err.message)
      setIsDemo(true)
      setProjects([
        {
          id: '1',
          title: 'SaaS de Gestion de Tâches',
          description:
            'Une plateforme collaborative premium avec tableaux Kanban en temps réel, messagerie intégrée et facturation via Stripe.',
          url: 'https://taskflow-demo.vercel.app',
          github_url: 'https://github.com',
          status: 'en_ligne',
          iframe_blocked: false,
          tools: [
            { id: '1', name: 'React' },
            { id: '5', name: 'Supabase' },
          ],
        },
        {
          id: '2',
          title: 'E-commerce High-Tech',
          description:
            'Boutique en ligne moderne avec panier persistant, filtrage multicritères et espace de paiement sécurisé.',
          url: 'https://hitech-shop-demo.vercel.app',
          github_url: 'https://github.com',
          status: 'en_ligne',
          iframe_blocked: true,
          screenshot_url:
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
          tools: [
            { id: '1', name: 'React' },
            { id: '4', name: 'Tailwind CSS' },
          ],
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  const addProject = async (project, toolIds = []) => {
    setLoading(true)
    try {
      const { data: projectData, error: projErr } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single()

      if (projErr) throw projErr

      if (toolIds.length > 0) {
        const links = toolIds.map((toolId) => ({
          project_id: projectData.id,
          tool_id: toolId,
        }))
        const { error: linkErr } = await supabase
          .from('project_tools')
          .insert(links)

        if (linkErr) throw linkErr
      }

      await fetchProjects()
      return projectData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProject = async (id, project, toolIds = []) => {
    setLoading(true)
    try {
      const { data: projectData, error: projErr } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single()

      if (projErr) throw projErr

      const { error: clearErr } = await supabase
        .from('project_tools')
        .delete()
        .eq('project_id', id)

      if (clearErr) throw clearErr

      if (toolIds.length > 0) {
        const links = toolIds.map((toolId) => ({
          project_id: id,
          tool_id: toolId,
        }))
        const { error: linkErr } = await supabase
          .from('project_tools')
          .insert(links)

        if (linkErr) throw linkErr
      }

      await fetchProjects()
      return projectData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteProject = async (id) => {
    setLoading(true)
    try {
      const { error: err } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (err) throw err
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    isDemo,
    refresh: fetchProjects,
    addProject,
    updateProject,
    deleteProject,
  }
}
