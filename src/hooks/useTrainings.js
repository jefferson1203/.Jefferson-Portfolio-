import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export function useTrainings() {
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  const fetchTrainings = useCallback(async () => {
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
        .from('trainings')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setTrainings(data || [])
    } catch (err) {
      console.warn('Using local fallback trainings:', err.message)
      setIsDemo(true)
      setTrainings([
        {
          id: '1',
          title: 'Supabase Mastery Course',
          platform: 'Udemy',
          category: 'DevOps',
          status: 'termine',
          progress: 100,
          notes:
            'Excellent cours couvrant RLS, Functions et Postgres Triggers en profondeur.',
        },
        {
          id: '2',
          title: 'Advanced React Design Patterns',
          platform: 'Frontend Masters',
          category: 'React',
          status: 'en_cours',
          progress: 65,
          notes:
            'Étude des HOC, custom hooks complexes, et state management optimal.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  const addTraining = async (training) => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('trainings')
        .insert([training])
        .select()
        .single()

      if (err) throw err
      setTrainings((prev) => [data, ...prev])
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTraining = async (id, training) => {
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('trainings')
        .update(training)
        .eq('id', id)
        .select()
        .single()

      if (err) throw err
      setTrainings((prev) => prev.map((t) => (t.id === id ? data : t)))
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTraining = async (id) => {
    setLoading(true)
    try {
      const { error: err } = await supabase
        .from('trainings')
        .delete()
        .eq('id', id)

      if (err) throw err
      setTrainings((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrainings()
  }, [fetchTrainings])

  return {
    trainings,
    loading,
    error,
    isDemo,
    refresh: fetchTrainings,
    addTraining,
    updateTraining,
    deleteTraining,
  }
}
