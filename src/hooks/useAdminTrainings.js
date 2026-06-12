import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdminTrainings() {
  const [trainings, setTrainings] = useState([])
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
      setTrainings([
        {
          id: '1',
          title: 'Supabase Mastery Course',
          platform: 'Udemy',
          category: 'DevOps',
          status: 'termine',
          progress: 100,
          notes: 'Excellent cours couvrant RLS, Functions et Postgres Triggers en profondeur.',
          url: 'https://udemy.com',
          order_index: 1,
        },
        {
          id: '2',
          title: 'Advanced React Design Patterns',
          platform: 'YouTube',
          category: 'React',
          status: 'en_cours',
          progress: 65,
          notes: 'Étude des HOC, custom hooks complexes, et state management optimal.',
          url: 'https://youtube.com',
          order_index: 2,
        },
        {
          id: '3',
          title: 'Intégration d\'une maquette web',
          platform: 'OpenClassrooms',
          category: 'Design',
          status: 'a_faire',
          progress: 0,
          notes: 'Apprendre à intégrer proprement une maquette Figma avec HTML et CSS sémantique.',
          url: 'https://openclassrooms.com',
          order_index: 3,
        },
      ])
      setLoading(false)
      return
    }

    try {
      const { data, error: err } = await supabase
        .from('trainings')
        .select('*')
        .order('order_index', { ascending: true })

      if (err) throw err
      setTrainings(data || [])
    } catch (err) {
      console.warn('Supabase fetch failed, fallback to demo mode:', err.message)
      setIsDemo(true)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // CREATE training
  const createTraining = async (trainingData) => {
    if (isDemo) {
      const newTraining = {
        id: `demo-${Date.now()}`,
        ...trainingData,
        order_index: trainings.length + 1,
      }
      setTrainings((prev) => [...prev, newTraining])
      return newTraining
    }

    const { data, error: err } = await supabase
      .from('trainings')
      .insert([trainingData])
      .select()
      .single()

    if (err) throw err
    setTrainings((prev) => [...prev, data])
    return data
  }

  // UPDATE training
  const updateTraining = async (id, trainingData) => {
    if (isDemo) {
      setTrainings((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...trainingData } : t))
      )
      return { id, ...trainingData }
    }

    const { data, error: err } = await supabase
      .from('trainings')
      .update(trainingData)
      .eq('id', id)
      .select()
      .single()

    if (err) throw err
    setTrainings((prev) => prev.map((t) => (t.id === id ? data : t)))
    return data
  }

  // DELETE training
  const deleteTraining = async (id) => {
    if (isDemo) {
      setTrainings((prev) => prev.filter((t) => t.id !== id))
      return
    }

    const { error: err } = await supabase
      .from('trainings')
      .delete()
      .eq('id', id)

    if (err) throw err
    setTrainings((prev) => prev.filter((t) => t.id !== id))
  }

  // REORDER trainings (Batch updates)
  const reorderTrainings = async (orderedList) => {
    if (isDemo) {
      setTrainings(orderedList)
      return
    }

    try {
      const updates = orderedList.map((t, index) => ({
        id: t.id,
        title: t.title,
        platform: t.platform,
        category: t.category,
        status: t.status,
        progress: t.progress,
        notes: t.notes,
        url: t.url,
        order_index: index + 1,
      }))

      const { error: err } = await supabase.from('trainings').upsert(updates)
      if (err) throw err
      setTrainings(orderedList)
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    trainings,
    loading,
    error,
    isDemo,
    refresh: fetchData,
    setTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    reorderTrainings,
  }
}
