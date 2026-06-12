import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdminProjects() {
  const [projects, setProjects] = useState([])
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  const checkSupabase = () => {
    return (
      supabase.supabaseUrl &&
      !supabase.supabaseUrl.includes('placeholder.supabase.co')
    )
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    const hasSupabase = checkSupabase()

    if (!hasSupabase) {
      setIsDemo(true)
      // Seed fallback values
      setProjects([
        {
          id: '1',
          title: 'SaaS de Gestion de Tâches',
          description: 'Une plateforme collaborative premium avec tableaux Kanban en temps réel.',
          url: 'https://taskflow-demo.vercel.app',
          github_url: 'https://github.com',
          status: 'en_ligne',
          iframe_blocked: false,
          screenshot_url: '',
          order_index: 1,
          tools: [
            { id: 't1', name: 'React', category: 'Framework' },
            { id: 't2', name: 'Supabase', category: 'Database' },
          ],
        },
        {
          id: '2',
          title: 'E-commerce High-Tech',
          description: 'Boutique en ligne moderne avec panier persistant et filtrage multicritères.',
          url: 'https://hitech-shop-demo.vercel.app',
          github_url: 'https://github.com',
          status: 'en_cours',
          iframe_blocked: true,
          screenshot_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
          order_index: 2,
          tools: [
            { id: 't1', name: 'React', category: 'Framework' },
            { id: 't3', name: 'Tailwind CSS', category: 'Framework' },
          ],
        },
      ])
      setTools([
        { id: 't1', name: 'React', category: 'Framework' },
        { id: 't2', name: 'Supabase', category: 'Database' },
        { id: 't3', name: 'Tailwind CSS', category: 'Framework' },
        { id: 't4', name: 'Node.js', category: 'Language' },
      ])
      setLoading(false)
      return
    }

    try {
      // 1. Fetch Projects (with tools relationship)
      const { data: projData, error: projErr } = await supabase
        .from('projects')
        .select('*, project_tools(*, tools(*))')
        .order('order_index', { ascending: true })

      if (projErr) throw projErr

      const projectsWithTools = (projData || []).map((project) => ({
        ...project,
        tools: project.project_tools?.map((pt) => pt.tools).filter(Boolean) || [],
      }))

      // 2. Fetch Tools
      const { data: toolsData, error: toolsErr } = await supabase
        .from('tools')
        .select('*')
        .order('name', { ascending: true })

      if (toolsErr) throw toolsErr

      setProjects(projectsWithTools)
      setTools(toolsData || [])
    } catch (err) {
      console.warn('Supabase fetch failed, fallback to demo mode:', err.message)
      setIsDemo(true)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // CREATE project
  const createProject = async (projectData) => {
    if (isDemo) {
      const newProj = {
        id: `demo-${Date.now()}`,
        ...projectData,
        order_index: projects.length + 1,
        tools: [],
      }
      setProjects((prev) => [...prev, newProj])
      return newProj
    }

    const { data, error: err } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single()

    if (err) throw err
    return data
  }

  // UPDATE project
  const updateProject = async (id, projectData) => {
    if (isDemo) {
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...projectData } : p))
      )
      return { id, ...projectData }
    }

    const { data, error: err } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    return data
  }

  // DELETE project
  const deleteProject = async (id) => {
    if (isDemo) {
      setProjects((prev) => prev.filter((p) => p.id !== id))
      return
    }

    const { error: err } = await supabase.from('projects').delete().eq('id', id)
    if (err) throw err
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }

  // ADD tool
  const addTool = async (name, category) => {
    if (isDemo) {
      const newTool = {
        id: `t-${Date.now()}`,
        name,
        category,
      }
      setTools((prev) => [...prev, newTool].sort((a, b) => a.name.localeCompare(b.name)))
      return newTool
    }

    const { data, error: err } = await supabase
      .from('tools')
      .insert([{ name, category }])
      .select()
      .single()

    if (err) throw err
    setTools((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    return data
  }

  // SYNC tools
  const updateProjectTools = async (projectId, toolIds) => {
    if (isDemo) {
      // Sync tools in local state
      const selectedTools = tools.filter((t) => toolIds.includes(t.id))
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, tools: selectedTools } : p))
      )
      return
    }

    // 1. Delete existing connections
    const { error: deleteErr } = await supabase
      .from('project_tools')
      .delete()
      .eq('project_id', projectId)

    if (deleteErr) throw deleteErr

    // 2. Add new links if any selected
    if (toolIds.length > 0) {
      const inserts = toolIds.map((toolId) => ({
        project_id: projectId,
        tool_id: toolId,
      }))
      const { error: insertErr } = await supabase
        .from('project_tools')
        .insert(inserts)

      if (insertErr) throw insertErr
    }

    // Refresh data to get sync relationships
    await fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    projects,
    tools,
    loading,
    error,
    isDemo,
    refresh: fetchData,
    setProjects,
    createProject,
    updateProject,
    deleteProject,
    addTool,
    updateProjectTools,
  }
}
