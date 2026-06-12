import { useState } from 'react'
import { useAdminProjects } from '@/hooks/useAdminProjects'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
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
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  FiPlus,
  FiTrash2,
  FiEdit,
  FiArrowLeft,
  FiX,
  FiMenu,
  FiExternalLink,
  FiUpload,
  FiLoader,
  FiSave,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'

// Drag and drop imports
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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// =========================================================================
// Sortable Project Row Component
// =========================================================================
function SortableProjectRow({ project, onStartEdit, onDeleteClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'en_ligne':
        return (
          <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-900/40 text-[10px] hover:bg-emerald-950">
            En ligne
          </Badge>
        )
      case 'en_cours':
        return (
          <Badge className="bg-amber-950 text-amber-400 border border-amber-900/40 text-[10px] hover:bg-amber-950">
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

  const truncateUrl = (str) => {
    if (!str) return ''
    const cleanUrl = str.replace(/^https?:\/\//, '')
    return cleanUrl.length > 20 ? `${cleanUrl.substring(0, 18)}...` : cleanUrl
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-zinc-850 hover:bg-zinc-900/20 transition-colors"
    >
      <td className="p-3 text-center w-10">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300 p-1"
        >
          <FiMenu className="h-4 w-4" />
        </div>
      </td>
      <td className="p-3 w-36">
        <div className="w-[120px] h-[80px] bg-zinc-950 rounded border border-zinc-900 overflow-hidden relative group">
          {project.url && !project.iframe_blocked ? (
            <>
              <div className="absolute inset-0 z-10" />
              <iframe
                src={project.url}
                title={project.title}
                className="w-[240px] h-[160px] border-none bg-white scale-[0.5] origin-top-left pointer-events-none"
                sandbox="allow-scripts allow-same-origin"
              />
            </>
          ) : project.screenshot_url ? (
            <img
              src={project.screenshot_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-650 font-bold uppercase text-center p-1">
              Aucun aperçu
            </div>
          )}
        </div>
      </td>
      <td className="p-3">
        <div className="font-bold text-white text-xs">{project.title}</div>
        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-indigo-400 hover:underline mt-0.5 inline-flex items-center gap-1"
          >
            {truncateUrl(project.url)} <FiExternalLink className="h-2.5 w-2.5" />
          </a>
        ) : (
          <span className="text-[10px] text-zinc-600 italic">Pas de déploiement</span>
        )}
      </td>
      <td className="p-3">{getStatusBadge(project.status)}</td>
      <td className="p-3">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {project.tools && project.tools.length > 0 ? (
            <>
              {project.tools.slice(0, 3).map((t) => (
                <Badge
                  key={t.id}
                  variant="secondary"
                  className="bg-zinc-900 text-zinc-350 border border-zinc-800 text-[9px] px-1.5 py-0"
                >
                  {t.name}
                </Badge>
              ))}
              {project.tools.length > 3 && (
                <span className="text-[9px] text-zinc-500 font-bold ml-1">
                  +{project.tools.length - 3}
                </span>
              )}
            </>
          ) : (
            <span className="text-[9px] text-zinc-600 italic">Aucun</span>
          )}
        </div>
      </td>
      <td className="p-3 text-right w-24">
        <div className="flex items-center justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onStartEdit(project)}
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-850"
          >
            <FiEdit className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDeleteClick(project)}
            className="h-8 w-8 text-zinc-550 hover:text-red-400 hover:bg-red-955/20"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

// =========================================================================
// Main Manage Projects Page
// =========================================================================
export default function ManageProjects() {
  const {
    projects,
    tools,
    loading,
    setProjects,
    createProject,
    updateProject,
    deleteProject,
    addTool,
    updateProjectTools,
    isDemo,
  } = useAdminProjects()

  // Form states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProjId, setEditingProjId] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [status, setStatus] = useState('en_cours')
  const [iframeBlocked, setIframeBlocked] = useState(false)
  const [screenshotUrl, setScreenshotUrl] = useState('')
  const [selectedToolIds, setSelectedToolIds] = useState([])
  const [formSaving, setFormSaving] = useState(false)

  // Upload state
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)

  // New Tool Add inline state
  const [newToolName, setNewToolName] = useState('')
  const [newToolCategory, setNewToolCategory] = useState('Framework')
  const [toolAdding, setToolAdding] = useState(false)

  // Delete confirm state
  const [deletingProject, setDeletingProject] = useState(null)

  // Sensors for Drag & Drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const resetForm = () => {
    setEditingProjId(null)
    setTitle('')
    setDescription('')
    setUrl('')
    setGithubUrl('')
    setStatus('en_cours')
    setIframeBlocked(false)
    setScreenshotUrl('')
    setSelectedToolIds([])
  }

  const handleOpenCreate = () => {
    resetForm()
    setDialogOpen(true)
  }

  const handleStartEdit = (proj) => {
    resetForm()
    setEditingProjId(proj.id)
    setTitle(proj.title || '')
    setDescription(proj.description || '')
    setUrl(proj.url || '')
    setGithubUrl(proj.github_url || '')
    setStatus(proj.status || 'en_cours')
    setIframeBlocked(proj.iframe_blocked || false)
    setScreenshotUrl(proj.screenshot_url || '')
    setSelectedToolIds(proj.tools ? proj.tools.map((t) => t.id) : [])
    setDialogOpen(true)
  }

  // Client-side image compress
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          const MAX_WIDTH = 800
          const MAX_HEIGHT = 800
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            },
            'image/jpeg',
            0.8
          )
        }
        img.onerror = (err) => reject(err)
      }
      reader.onerror = (err) => reject(err)
    })
  }

  // Handle Screenshot file upload
  const handleScreenshotUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingScreenshot(true)
    try {
      let uploadFile = file
      if (file.size > 1024 * 1024) {
        toast.info('Image > 1Mo. Compression en cours...')
        uploadFile = await compressImage(file)
      }

      const fileExt = uploadFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadErr } = await supabase.storage
        .from('screenshots')
        .upload(fileName, uploadFile, { cacheControl: '3600', upsert: true })

      if (uploadErr) throw uploadErr

      const { data } = supabase.storage
        .from('screenshots')
        .getPublicUrl(fileName)

      setScreenshotUrl(data.publicUrl)
      toast.success('Screenshot téléversé avec succès !')
    } catch (err) {
      console.error(err)
      toast.error("Erreur de téléversement : " + err.message)
    } finally {
      setUploadingScreenshot(false)
    }
  }

  // Handle Tool inline creation
  const handleCreateTool = async () => {
    if (!newToolName) return
    setToolAdding(true)
    try {
      const tool = await addTool(newToolName, newToolCategory)
      setSelectedToolIds((prev) => [...prev, tool.id])
      setNewToolName('')
      toast.success(`Outil "${tool.name}" créé et sélectionné !`)
    } catch (err) {
      toast.error("Erreur de création de l'outil : " + err.message)
    } finally {
      setToolAdding(false)
    }
  }

  // Form submit (create or update)
  const handleSubmitForm = async (e) => {
    e.preventDefault()
    if (!title) return
    setFormSaving(true)

    const payload = {
      title,
      description: description || null,
      url: url || null,
      github_url: githubUrl || null,
      status,
      iframe_blocked: iframeBlocked,
      screenshot_url: screenshotUrl || null,
    }

    try {
      if (editingProjId) {
        // Update
        await updateProject(editingProjId, payload)
        await updateProjectTools(editingProjId, selectedToolIds)
        toast.success('Projet mis à jour avec succès !')
      } else {
        // Create
        const newProj = await createProject(payload)
        await updateProjectTools(newProj.id, selectedToolIds)
        toast.success('Projet créé avec succès !')
      }
      setDialogOpen(false)
      resetForm()
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement : " + err.message)
    } finally {
      setFormSaving(false)
    }
  }

  // Deletion trigger
  const handleDeleteClick = (proj) => {
    setDeletingProject(proj)
  }

  const handleConfirmDelete = async () => {
    if (!deletingProject) return
    try {
      await deleteProject(deletingProject.id)
      toast.success('Projet supprimé !')
      setDeletingProject(null)
    } catch (err) {
      toast.error('Erreur de suppression : ' + err.message)
    }
  }

  // Reordering drag & drop handler
  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = projects.findIndex((p) => p.id === active.id)
    const newIndex = projects.findIndex((p) => p.id === over.id)

    const updatedList = arrayMove(projects, oldIndex, newIndex)
    setProjects(updatedList)

    if (isDemo) {
      toast.success('Ordre trié localement !')
      return
    }

    try {
      const updates = updatedList.map((proj, index) => ({
        id: proj.id,
        title: proj.title,
        description: proj.description,
        url: proj.url,
        github_url: proj.github_url,
        status: proj.status,
        iframe_blocked: proj.iframe_blocked,
        screenshot_url: proj.screenshot_url,
        order_index: index + 1,
      }))

      const { error } = await supabase.from('projects').upsert(updates)
      if (error) throw error
      toast.success('Ordre des projets mis à jour !')
    } catch (err) {
      toast.error("Erreur lors de la mise à jour de l'ordre : " + err.message)
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
        <Skeleton className="h-64 w-full bg-zinc-900/10 rounded-xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6">
      {isDemo && (
        <div className="rounded-lg bg-zinc-900 border border-amber-900/20 p-3 text-center text-xs text-amber-550 animate-pulse">
          Mode Démo : Affichage des projets locaux.
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
            <h1 className="text-xl font-black text-white">Gérer les Projets</h1>
            <p className="text-zinc-400 text-xs mt-0.5">
              Créez, modifiez ou organisez l'ordre de présentation de vos projets.
            </p>
          </div>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold gap-1.5 h-9"
        >
          <FiPlus className="h-4 w-4" /> Ajouter un projet
        </Button>
      </div>

      {/* Projects Table Card */}
      <Card className="border-zinc-800 bg-zinc-900/10">
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left min-w-[700px]">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-450 text-[10px] uppercase font-bold tracking-wider">
                  <th className="p-3 w-10"></th>
                  <th className="p-3 w-36">Aperçu</th>
                  <th className="p-3">Titre / URL</th>
                  <th className="p-3">Statut</th>
                  <th className="p-3">Technos</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={projects.map((p) => p.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {projects.map((project) => (
                        <SortableProjectRow
                          key={project.id}
                          project={project}
                          onStartEdit={handleStartEdit}
                          onDeleteClick={handleDeleteClick}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-12 text-center text-xs text-zinc-550 font-bold"
                    >
                      Aucun projet. Ajoutez-en un pour commencer !
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* =========================================================================
          PROJECT CREATION & EDITION FORM DIALOG MODAL
          ========================================================================= */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-zinc-950 border-zinc-800 text-white p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader className="pb-3 border-b border-zinc-900">
            <DialogTitle className="text-base font-extrabold text-white">
              {editingProjId ? 'Modifier le Projet' : 'Créer un Projet'}
            </DialogTitle>
            <DialogDescription className="text-zinc-450 text-xs">
              Remplissez les détails du projet et associez ses langages ou outils.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4 my-4">
            {/* Title & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-350 text-xs font-semibold">
                  Titre du Projet
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-850 text-white"
                  placeholder="ex: Mon SaaS de facturation"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-350 text-xs font-semibold">
                  Statut
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-850 text-white text-xs h-9">
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                    <SelectItem value="en_ligne">En Ligne</SelectItem>
                    <SelectItem value="en_cours">En Cours</SelectItem>
                    <SelectItem value="archive">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-zinc-350 text-xs font-semibold">
                Description
              </Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-zinc-850 bg-zinc-900 text-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Description succincte du projet..."
              />
            </div>

            {/* URL & GitHub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-350 text-xs font-semibold">
                  URL Déploiement
                </Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-zinc-900 border-zinc-850 text-white"
                  placeholder="https://monprojet.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-zinc-350 text-xs font-semibold">
                  URL GitHub
                </Label>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="bg-zinc-900 border-zinc-850 text-white"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            {/* Iframe blocked toggle & file upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-900 bg-zinc-950/20">
                <div className="space-y-0.5">
                  <Label className="text-xs text-zinc-350">Iframe bloquée ?</Label>
                  <p className="text-[10px] text-zinc-550">
                    Activez si le site public n'autorise pas d'affichage dans un cadre iframe (CORS).
                  </p>
                </div>
                <Switch
                  checked={iframeBlocked}
                  onCheckedChange={setIframeBlocked}
                />
              </div>

              {iframeBlocked && (
                <div className="p-4 rounded-lg border border-zinc-900 bg-zinc-950/40 space-y-3">
                  <Label className="text-zinc-350 text-xs font-bold uppercase tracking-wider block">
                    Screenshot Fallback
                  </Label>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex-grow">
                      <Input
                        value={screenshotUrl}
                        onChange={(e) => setScreenshotUrl(e.target.value)}
                        placeholder="https://image-url.com/ou-choisir-fichier..."
                        className="bg-zinc-900 border-zinc-850 text-white h-9"
                      />
                    </div>
                    <div className="shrink-0 flex items-center justify-start gap-2">
                      <Input
                        type="file"
                        id="screenshot-file"
                        accept="image/*"
                        onChange={handleScreenshotUpload}
                        disabled={uploadingScreenshot}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingScreenshot}
                        onClick={() =>
                          document.getElementById('screenshot-file')?.click()
                        }
                        className="border-zinc-800 hover:bg-zinc-900 text-zinc-350 bg-zinc-950 h-9 gap-1.5"
                      >
                        {uploadingScreenshot ? (
                          <FiLoader className="h-4 w-4 animate-spin" />
                        ) : (
                          <FiUpload className="h-4 w-4" />
                        )}
                        Téléverser
                      </Button>
                    </div>
                  </div>

                  {screenshotUrl && (
                    <div className="relative h-20 w-32 rounded border border-zinc-800 bg-zinc-950 overflow-hidden">
                      <img
                        src={screenshotUrl}
                        alt="Screenshot Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setScreenshotUrl('')}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black/90 p-0.5 rounded-full text-zinc-400 hover:text-white"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tools Checkboxes list */}
            <div className="space-y-2">
              <Label className="text-zinc-350 text-xs font-bold uppercase tracking-wider block">
                Associer des technologies
              </Label>
              {tools.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border border-zinc-900 p-2.5 rounded bg-zinc-950/25 max-h-[140px] overflow-y-auto">
                  {tools.map((tool) => (
                    <div key={tool.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`tool-${tool.id}`}
                        checked={selectedToolIds.includes(tool.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedToolIds((prev) => [...prev, tool.id])
                          } else {
                            setSelectedToolIds((prev) =>
                              prev.filter((id) => id !== tool.id)
                            )
                          }
                        }}
                      />
                      <Label
                        htmlFor={`tool-${tool.id}`}
                        className="text-xs text-zinc-300 font-medium cursor-pointer"
                      >
                        {tool.name}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-650 italic">
                  Aucun outil existant dans la base de données.
                </p>
              )}
            </div>

            {/* Create tool inline form */}
            <div className="p-3 rounded-lg border border-zinc-900 bg-zinc-950/10 space-y-2.5">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                Ajouter un outil à la volée
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-grow">
                  <Input
                    size="sm"
                    value={newToolName}
                    onChange={(e) => setNewToolName(e.target.value)}
                    placeholder="Nom du nouvel outil (ex: GraphQL)"
                    className="bg-zinc-900 border-zinc-850 h-8 text-xs text-white"
                  />
                </div>
                <div className="w-32">
                  <Select value={newToolCategory} onValueChange={setNewToolCategory}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-850 text-white text-xs h-8">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                      <SelectItem value="Language">Language</SelectItem>
                      <SelectItem value="Framework">Framework</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="Platform">Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  onClick={handleCreateTool}
                  disabled={toolAdding}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white h-8 text-xs font-bold shrink-0 px-4"
                >
                  {toolAdding ? (
                    <FiLoader className="h-3 w-3 animate-spin" />
                  ) : (
                    'Créer'
                  )}
                </Button>
              </div>
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
        open={!!deletingProject}
        onOpenChange={(open) => !open && setDeletingProject(null)}
      >
        <AlertDialogContent className="bg-zinc-950 border-zinc-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Supprimer le projet "{deletingProject?.title}" ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-450 text-xs">
              Cette action est irréversible. Toutes les relations de technologies
              associées à ce projet seront également définitivement effacées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel
              onClick={() => setDeletingProject(null)}
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
