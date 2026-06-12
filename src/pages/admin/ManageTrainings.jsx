import { useState, useMemo } from 'react'
import { useAdminTrainings } from '@/hooks/useAdminTrainings'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiArrowLeft,
  FiExternalLink,
  FiMenu,
  FiLoader,
  FiBookOpen,
  FiSave,
} from 'react-icons/fi'
import { SiUdemy, SiYoutube } from 'react-icons/si'
import { Link } from 'react-router-dom'

// Drag & drop
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Custom learning/graduation stack SVG representing OpenClassrooms
function OpenClassroomsIcon({ className, title }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <title>{title}</title>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

// =========================================================================
// Sortable Card Component
// =========================================================================
function SortableTrainingCard({ training, onStartEdit, onDeleteClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: training.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 20 : 'auto',
  }

  const getPlatformIcon = () => {
    const iconSize = 'h-5 w-5'
    const lowerPlatform = training.platform?.toLowerCase() || ''

    if (lowerPlatform.includes('udemy')) {
      return <SiUdemy className={`${iconSize} text-orange-550`} />
    }
    if (lowerPlatform.includes('youtube')) {
      return <SiYoutube className={`${iconSize} text-red-600`} />
    }
    if (lowerPlatform.includes('openclassrooms')) {
      return <OpenClassroomsIcon className={`${iconSize} text-emerald-400`} />
    }
    return <FiBookOpen className={`${iconSize} text-zinc-400`} />
  }

  const getStatusBadge = () => {
    switch (training.status) {
      case 'en_cours':
        return (
          <Badge className="bg-blue-950/80 text-blue-400 border border-blue-900/30 text-[9px] font-bold uppercase tracking-wider animate-pulse hover:bg-blue-950/80">
            En cours
          </Badge>
        )
      case 'termine':
        return (
          <Badge className="bg-emerald-950/80 text-emerald-400 border border-emerald-900/30 text-[9px] font-bold uppercase tracking-wider hover:bg-emerald-950/80">
            Terminé
          </Badge>
        )
      default:
        return (
          <Badge className="bg-zinc-900/80 text-zinc-400 border border-zinc-800 text-[9px] font-bold uppercase tracking-wider hover:bg-zinc-900/80">
            À faire
          </Badge>
        )
    }
  }

  const progressColor =
    training.status === 'termine'
      ? '[&>[data-slot=progress-indicator]]:bg-emerald-500 bg-emerald-950/20'
      : training.status === 'en_cours'
      ? '[&>[data-slot=progress-indicator]]:bg-blue-500 bg-blue-950/20'
      : '[&>[data-slot=progress-indicator]]:bg-zinc-700 bg-zinc-900/60'

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="border-zinc-800 bg-zinc-900/10 hover:border-zinc-700 hover:bg-zinc-900/20 transition-all duration-300 flex flex-col justify-between h-full min-h-[220px] relative group/card"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 z-10 cursor-grab active:cursor-grabbing text-zinc-650 hover:text-zinc-300 p-1.5 rounded bg-zinc-950/80 border border-zinc-900"
      >
        <FiMenu className="h-3.5 w-3.5" />
      </div>

      <CardHeader className="p-5 pb-2 pt-14">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {getPlatformIcon()}
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              {training.platform}
            </span>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="px-5 py-2 flex-grow flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-white line-clamp-2 tracking-tight">
            {training.title}
          </h3>
          <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-1 block">
            {training.category || 'Général'}
          </span>
        </div>

        <div className="space-y-1 mt-auto">
          <div className="flex justify-between text-[9px] font-bold text-zinc-550 uppercase">
            <span>Progression</span>
            <span>{training.progress}%</span>
          </div>
          <Progress value={training.progress} className={`h-1.5 ${progressColor}`} />
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-3 border-t border-zinc-900 flex justify-between items-center gap-3">
        {training.url ? (
          <a
            href={training.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-zinc-450 hover:text-indigo-400 flex items-center gap-1"
          >
            Lien <FiExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-[10px] text-zinc-600 italic">Pas de lien</span>
        )}
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onStartEdit(training)}
            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-850"
          >
            <FiEdit className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDeleteClick(training)}
            className="h-7 w-7 text-zinc-550 hover:text-red-400 hover:bg-red-955/20"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// =========================================================================
// Main Page component
// =========================================================================
export default function ManageTrainings() {
  const {
    trainings,
    loading,
    setTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    reorderTrainings,
    isDemo,
  } = useAdminTrainings()

  // Filters
  const [statusFilter, setStatusFilter] = useState('tous')
  const [categoryFilter, setCategoryFilter] = useState('toutes')

  // Form
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState('Udemy')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('a_faire')
  const [progress, setProgress] = useState(0)
  const [notes, setNotes] = useState('')
  const [formSaving, setFormSaving] = useState(false)

  // Deletion confirm
  const [deletingTraining, setDeletingTraining] = useState(null)

  // Categories extraction
  const categories = [
    'toutes',
    ...new Set(trainings.map((t) => t.category).filter(Boolean)),
  ]

  // Autocomplete suggestions for form category
  const categorySuggestions = useMemo(() => {
    return [...new Set(trainings.map((t) => t.category).filter(Boolean))].slice(
      0,
      5
    )
  }, [trainings])

  // Filter combined list
  const filteredTrainings = trainings.filter((t) => {
    const matchStatus = statusFilter === 'tous' || t.status === statusFilter
    const matchCategory =
      categoryFilter === 'toutes' || t.category === categoryFilter
    return matchStatus && matchCategory
  })

  // Counters
  const completedCount = trainings.filter((t) => t.status === 'termine').length
  const inProgressCount = trainings.filter((t) => t.status === 'en_cours').length

  // Sensors for Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setUrl('')
    setPlatform('Udemy')
    setCategory('')
    setStatus('a_faire')
    setProgress(0)
    setNotes('')
  }

  const handleOpenCreate = () => {
    resetForm()
    setDialogOpen(true)
  }

  const handleStartEdit = (t) => {
    resetForm()
    setEditingId(t.id)
    setTitle(t.title || '')
    setUrl(t.url || '')
    setPlatform(t.platform || 'Udemy')
    setCategory(t.category || '')
    setStatus(t.status || 'a_faire')
    setProgress(t.progress || 0)
    setNotes(t.notes || '')
    setDialogOpen(true)
  }

  // Handle smart progress changes according to status
  const handleStatusChange = (val) => {
    setStatus(val)
    if (val === 'a_faire') {
      setProgress(0)
    } else if (val === 'termine') {
      setProgress(100)
    } else if (val === 'en_cours' && (progress === 0 || progress === 100)) {
      setProgress(50)
    }
  }

  // Form submit (create or update)
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    if (!title || !platform || !category) return
    setFormSaving(true)

    const payload = {
      title,
      url: url || null,
      platform,
      category,
      status,
      progress: status === 'termine' ? 100 : status === 'a_faire' ? 0 : progress,
      notes: notes || null,
    }

    try {
      if (editingId) {
        await updateTraining(editingId, payload)
        toast.success('Formation mise à jour !')
      } else {
        await createTraining(payload)
        toast.success('Formation créée !')
      }
      setDialogOpen(false)
      resetForm()
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement : " + err.message)
    } finally {
      setFormSaving(false)
    }
  }

  // Deletion confirm
  const handleDeleteClick = (t) => {
    setDeletingTraining(t)
  }

  const handleConfirmDelete = async () => {
    if (!deletingTraining) return
    try {
      await deleteTraining(deletingTraining.id)
      toast.success('Formation supprimée !')
      setDeletingTraining(null)
    } catch (err) {
      toast.error('Erreur de suppression : ' + err.message)
    }
  }

  // Drag & Drop reorder
  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = trainings.findIndex((t) => t.id === active.id)
    const newIndex = trainings.findIndex((t) => t.id === over.id)

    const updatedList = arrayMove(trainings, oldIndex, newIndex)
    setTrainings(updatedList)

    if (isDemo) {
      toast.success('Ordre trié localement !')
      return
    }

    try {
      await reorderTrainings(updatedList)
      toast.success('Ordre des formations sauvegardé !')
    } catch (err) {
      toast.error("Erreur d'ordonnancement : " + err.message)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6">
        <div className="flex justify-between items-center pb-6 border-b border-zinc-900">
          <div>
            <Skeleton className="h-8 w-48 bg-zinc-900" />
            <Skeleton className="h-4 w-96 mt-2 bg-zinc-900" />
          </div>
          <Skeleton className="h-9 w-36 bg-zinc-900" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-56 bg-zinc-900/10 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6">
      {isDemo && (
        <div className="rounded-lg bg-zinc-900 border border-amber-900/20 p-3 text-center text-xs text-amber-550 animate-pulse">
          Mode Démo : Affichage des formations locales.
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-900 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard">
            <Button
              variant="outline"
              size="icon"
              className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
            >
              <FiArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">Gérer les Formations</h1>
            <p className="text-zinc-400 text-xs mt-0.5">
              Organisez vos cours, suivez votre progression et réordonnez l'affichage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-900 hidden sm:block">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              {trainings.length} formations • {completedCount} terminées • {inProgressCount} en cours
            </span>
          </div>

          <Button
            onClick={handleOpenCreate}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold gap-1.5 h-9"
          >
            <FiPlus className="h-4 w-4" /> Ajouter une formation
          </Button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/10 p-4 rounded-xl border border-zinc-900">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-wider mr-1">
            Catégorie :
          </span>
          {categories.map((cat) => (
            <Badge
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`cursor-pointer text-[10px] font-bold uppercase tracking-wider transition-all py-1 px-2 rounded-md ${
                categoryFilter === cat
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-zinc-950 border-zinc-900 text-zinc-450 hover:text-zinc-200'
              }`}
            >
              {cat === 'toutes' ? 'Toutes' : cat}
            </Badge>
          ))}
        </div>

        {/* Status Tabs */}
        <Tabs
          value={statusFilter}
          onValueChange={setStatusFilter}
          className="w-fit"
        >
          <TabsList className="bg-zinc-950 border border-zinc-900 h-9 p-0.5">
            <TabsTrigger
              value="tous"
              className="text-xs px-3 font-bold uppercase tracking-wider"
            >
              Tous
            </TabsTrigger>
            <TabsTrigger
              value="a_faire"
              className="text-xs px-3 font-bold uppercase tracking-wider"
            >
              À faire
            </TabsTrigger>
            <TabsTrigger
              value="en_cours"
              className="text-xs px-3 font-bold uppercase tracking-wider"
            >
              En cours
            </TabsTrigger>
            <TabsTrigger
              value="termine"
              className="text-xs px-3 font-bold uppercase tracking-wider"
            >
              Terminés
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Dynamic Grid list */}
      {filteredTrainings.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredTrainings.map((t) => t.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {filteredTrainings.map((training) => (
                <SortableTrainingCard
                  key={training.id}
                  training={training}
                  onStartEdit={handleStartEdit}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center mt-4 rounded-xl border border-zinc-800 bg-zinc-900/10">
          <FiBookOpen className="h-10 w-10 text-zinc-650 mb-3 animate-pulse" />
          <h3 className="text-base font-bold text-zinc-350">
            Aucune formation trouvée
          </h3>
          <p className="text-zinc-550 text-xs mt-1 max-w-xs">
            Aucune entrée de cours ne correspond à vos filtres de recherche.
          </p>
        </div>
      )}

      {/* =========================================================================
          FORM DIALOG MODAL
          ========================================================================= */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="pb-3 border-b border-zinc-900">
            <DialogTitle className="text-base font-extrabold text-white">
              {editingId ? 'Modifier la Formation' : 'Ajouter une Formation'}
            </DialogTitle>
            <DialogDescription className="text-zinc-450 text-xs">
              Configurez les attributs de la formation et suivez sa progression.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 my-4">
            <div className="space-y-1.5">
              <Label className="text-zinc-350 text-xs font-semibold">Titre</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-850 text-white"
                placeholder="ex: Design Patterns avec React"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-350 text-xs font-semibold">
                Lien ressource (URL)
              </Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-zinc-900 border-zinc-850 text-white"
                placeholder="https://..."
              />
            </div>

            {/* Platform & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-350 text-xs font-semibold">
                  Plateforme
                </Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-850 text-white text-xs h-9">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                    <SelectItem value="Udemy">Udemy</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="OpenClassrooms">OpenClassrooms</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-350 text-xs font-semibold">
                  Catégorie
                </Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-850 text-white"
                  placeholder="ex: React, DevOps"
                />

                {/* Suggestions display */}
                {categorySuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {categorySuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setCategory(suggestion)}
                        className="text-[9px] bg-zinc-900 text-zinc-400 hover:text-white px-1.5 py-0.5 rounded border border-zinc-850 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status & Progress slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <Label className="text-zinc-350 text-xs font-semibold">
                  Statut
                </Label>
                <Select value={status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-850 text-white text-xs h-9">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                    <SelectItem value="a_faire">À faire</SelectItem>
                    <SelectItem value="en_cours">En Cours</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs text-zinc-400">
                  <Label>Progression</Label>
                  <span className="font-bold text-indigo-400">{progress}%</span>
                </div>
                <Slider
                  value={[progress]}
                  onValueChange={(val) => setProgress(val[0])}
                  min={0}
                  max={100}
                  disabled={status === 'a_faire' || status === 'termine'}
                  className="py-2"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label className="text-zinc-350 text-xs font-semibold">Notes</Label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-zinc-850 bg-zinc-900 text-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Ressenti, points acquis..."
              />
            </div>
          </form>

          <DialogFooter className="border-t border-zinc-900 pt-4">
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                type="button"
                onClick={() => setDialogOpen(false)}
                className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs bg-zinc-950 h-9 font-bold"
              >
                Annuler
              </Button>
              <Button
                type="button"
                onClick={handleSubmitForm}
                disabled={formSaving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold h-9 gap-1.5"
              >
                {formSaving ? (
                  <FiLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <FiSave className="h-4 w-4" />
                )}
                Enregistrer
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          CONFIRM DELETE ALERT DIALOG
          ========================================================================= */}
      <AlertDialog
        open={!!deletingTraining}
        onOpenChange={(open) => !open && setDeletingTraining(null)}
      >
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Supprimer la formation "{deletingTraining?.title}" ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-450 text-xs">
              Cette action est irréversible. Toutes les données liées à cette
              formation seront définitivement supprimées du portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={() => setDeletingTraining(null)}
              className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 text-xs font-bold"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
