import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useProfile() {
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [education, setEducation] = useState([])
  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  const fetchData = useCallback(async () => {
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

      // 1. Fetch Profile
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .maybeSingle()

      if (profileErr) throw profileErr
      setProfile(profileData)

      // 2. Fetch Skills (ordered)
      const { data: skillsData, error: skillsErr } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true })

      if (skillsErr) throw skillsErr
      setSkills(skillsData || [])

      // 3. Fetch Education (ordered)
      const { data: eduData, error: eduErr } = await supabase
        .from('education')
        .select('*')
        .order('order_index', { ascending: true })

      if (eduErr) throw eduErr
      setEducation(eduData || [])

      // 4. Fetch Tools
      const { data: toolsData, error: toolsErr } = await supabase
        .from('tools')
        .select('*')

      if (toolsErr) throw toolsErr
      setTools(toolsData || [])
    } catch (err) {
      console.warn(
        'Using local fallback data because Supabase connection failed:',
        err.message
      )
      setIsDemo(true)
      // Provide mock data
      setProfile({
        full_name: 'Jefferson',
        title: 'Développeur Full Stack',
        bio: "Spécialisé dans la création d'applications web modernes et performantes. Expertise solide en React, Node.js, et architecture de bases de données cloud.",
        avatar_url:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        email: 'jefferson@example.com',
        github_url: 'https://github.com/github',
        linkedin_url: 'https://linkedin.com',
        twitter_url: 'https://twitter.com',
      })
      setSkills([
        {
          id: '1',
          name: 'React / Next.js',
          category: 'Frontend',
          level: 5,
          order_index: 1,
        },
        {
          id: '2',
          name: 'Tailwind CSS',
          category: 'Frontend',
          level: 5,
          order_index: 2,
        },
        {
          id: '3',
          name: 'TypeScript',
          category: 'Frontend',
          level: 4,
          order_index: 3,
        },
        {
          id: '4',
          name: 'Node.js / Express',
          category: 'Backend',
          level: 4,
          order_index: 4,
        },
        {
          id: '5',
          name: 'PostgreSQL',
          category: 'Backend',
          level: 4,
          order_index: 5,
        },
        {
          id: '6',
          name: 'Supabase Services',
          category: 'Backend',
          level: 5,
          order_index: 6,
        },
      ])
      setEducation([
        {
          id: '1',
          degree: "Diplôme d'Ingénieur en Informatique",
          school: 'Institut National des Sciences Appliquées',
          year_start: 2018,
          year_end: 2021,
          description:
            "Spécialisation Génie Logiciel et Web. Projets d'études sur l'architecture et les systèmes distribués.",
        },
        {
          id: '2',
          degree: 'Licence en Informatique',
          school: 'Université de Technologie',
          year_start: 2015,
          year_end: 2018,
          description:
            'Bases théoriques solides : algorithmique, structures de données, POO, bases de données.',
        },
      ])
      setTools([
        { id: '1', name: 'React' },
        { id: '2', name: 'Node.js' },
        { id: '3', name: 'PostgreSQL' },
        { id: '4', name: 'Tailwind CSS' },
        { id: '5', name: 'Supabase' },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = async (profileData) => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
        .single()

      if (err) throw err
      setProfile(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addSkill = async (skill) => {
    const { data, error: err } = await supabase
      .from('skills')
      .insert([skill])
      .select()
    if (err) throw err
    setSkills((prev) =>
      [...prev, data[0]].sort((a, b) => a.order_index - b.order_index)
    )
    return data[0]
  }

  const updateSkill = async (id, updatedFields) => {
    const { data, error: err } = await supabase
      .from('skills')
      .update(updatedFields)
      .eq('id', id)
      .select()
    if (err) throw err
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? data[0] : s)).sort((a, b) => a.order_index - b.order_index)
    )
    return data[0]
  }

  const deleteSkill = async (id) => {
    const { error: err } = await supabase.from('skills').delete().eq('id', id)
    if (err) throw err
    setSkills((prev) => prev.filter((s) => s.id !== id))
  }

  const addEducation = async (edu) => {
    const { data, error: err } = await supabase
      .from('education')
      .insert([edu])
      .select()
    if (err) throw err
    setEducation((prev) =>
      [...prev, data[0]].sort((a, b) => a.order_index - b.order_index)
    )
    return data[0]
  }

  const updateEducation = async (id, updatedFields) => {
    const { data, error: err } = await supabase
      .from('education')
      .update(updatedFields)
      .eq('id', id)
      .select()
    if (err) throw err
    setEducation((prev) =>
      prev.map((e) => (e.id === id ? data[0] : e)).sort((a, b) => a.order_index - b.order_index)
    )
    return data[0]
  }

  const deleteEducation = async (id) => {
    const { error: err } = await supabase
      .from('education')
      .delete()
      .eq('id', id)
    if (err) throw err
    setEducation((prev) => prev.filter((e) => e.id !== id))
  }

  const addTool = async (tool) => {
    const { data, error: err } = await supabase
      .from('tools')
      .insert([tool])
      .select()
    if (err) throw err
    setTools((prev) => [...prev, data[0]])
    return data[0]
  }

  const deleteTool = async (id) => {
    const { error: err } = await supabase.from('tools').delete().eq('id', id)
    if (err) throw err
    setTools((prev) => prev.filter((t) => t.id !== id))
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    profile,
    skills,
    education,
    tools,
    loading,
    error,
    isDemo,
    refresh: fetchData,
    updateProfile,
    addSkill,
    updateSkill,
    deleteSkill,
    setSkills,
    addEducation,
    updateEducation,
    deleteEducation,
    setEducation,
    addTool,
    deleteTool,
  }
}
