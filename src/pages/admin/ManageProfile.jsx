import React, { useState, useEffect, useMemo } from 'react'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  FiSave,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiEdit,
  FiMenu,
  FiX,
  FiCheck,
  FiUpload,
  FiLoader,
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
// Sortable Skill Item Component
// =========================================================================
function SortableSkillRow({
  skill,
  onDelete,
  onStartEdit,
  isEditing,
  editName,
  setEditName,
  editCategory,
  setEditCategory,
  editLevel,
  setEditLevel,
  onSaveEdit,
  onCancelEdit,
  isSaving,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 20 : 'auto',
  }

  if (isEditing) {
    return (
      <tr
        ref={setNodeRef}
        style={style}
        className="border-b border-zinc-800 bg-zinc-900/60"
      >
        <td className="p-3 text-center w-10">
          <div className="cursor-grabbing text-zinc-550 p-1">
            <FiMenu className="h-4 w-4" />
          </div>
        </td>
        <td className="p-3">
          <Input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="h-8 bg-zinc-950 border-zinc-800 text-xs w-full text-white"
          />
        </td>
        <td className="p-3 w-40">
          <Select value={editCategory} onValueChange={setEditCategory}>
            <SelectTrigger className="h-8 bg-zinc-950 border-zinc-800 text-xs text-white">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="DevOps">DevOps</SelectItem>
              <SelectItem value="Database">Database</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </td>
        <td className="p-3 w-48">
          <div className="flex items-center gap-3">
            <Slider
              value={[editLevel]}
              onValueChange={(val) => setEditLevel(val[0])}
              min={1}
              max={100}
              className="flex-grow py-2"
            />
            <span className="text-xs font-bold text-indigo-400 w-8 text-right">
              {editLevel}%
            </span>
          </div>
        </td>
        <td className="p-3 text-right w-24">
          <div className="flex items-center justify-end gap-1.5">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onSaveEdit(skill.id)}
              disabled={isSaving}
              className="h-7 w-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/20"
            >
              {isSaving ? (
                <FiLoader className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <FiCheck className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onCancelEdit}
              disabled={isSaving}
              className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-850"
            >
              <FiX className="h-3.5 w-3.5" />
            </Button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-zinc-800 hover:bg-zinc-900/30 transition-colors"
    >
      <td className="p-3 text-center w-10">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-zinc-650 hover:text-zinc-300 p-1"
        >
          <FiMenu className="h-4 w-4" />
        </div>
      </td>
      <td className="p-3 font-bold text-white text-xs">{skill.name}</td>
      <td className="p-3 text-xs text-zinc-400">
        <Badge variant="outline" className="border-zinc-800 text-zinc-450">
          {skill.category}
        </Badge>
      </td>
      <td className="p-3 w-48">
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-zinc-550 font-medium">
            <span>Maitrise</span>
            <span>{skill.level}%</span>
          </div>
          <Progress value={skill.level} className="h-1 bg-zinc-950" />
        </div>
      </td>
      <td className="p-3 text-right w-24">
        <div className="flex items-center justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onStartEdit(skill)}
            className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-850"
          >
            <FiEdit className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(skill.id)}
            className="h-7 w-7 text-zinc-500 hover:text-red-400 hover:bg-red-950/20"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  )
}

// =========================================================================
// Main Page Component
// =========================================================================
export default function ManageProfile() {
  const { user } = useAuth()
  const {
    profile,
    skills,
    education,
    updateProfile,
    addSkill,
    updateSkill,
    deleteSkill,
    setSkills,
    addEducation,
    updateEducation,
    deleteEducation,
    loading: hookLoading,
  } = useProfile()

  // Tab 1 Profile States
  const [fullName, setFullName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [twitterUrl, setTwitterUrl] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)

  // Tab 2 Skills States
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend')
  const [newSkillLevel, setNewSkillLevel] = useState(50)
  const [skillAdding, setSkillAdding] = useState(false)

  // Skill editing states
  const [editingSkillId, setEditingSkillId] = useState(null)
  const [editSkillName, setEditSkillName] = useState('')
  const [editSkillCategory, setEditSkillCategory] = useState('Frontend')
  const [editSkillLevel, setEditSkillLevel] = useState(50)
  const [skillSaving, setSkillSaving] = useState(false)

  // Tab 3 Education States
  const [newDegree, setNewDegree] = useState('')
  const [newSchool, setNewSchool] = useState('')
  const [newYearStart, setNewYearStart] = useState('')
  const [newYearEnd, setNewYearEnd] = useState('')
  const [newEduDesc, setNewEduDesc] = useState('')
  const [educationAdding, setEducationAdding] = useState(false)

  // Education Dialog Editing States
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEduId, setEditingEduId] = useState(null)
  const [editDegree, setEditDegree] = useState('')
  const [editSchool, setEditSchool] = useState('')
  const [editYearStart, setEditYearStart] = useState('')
  const [editYearEnd, setEditYearEnd] = useState('')
  const [editEduDesc, setEditEduDesc] = useState('')
  const [educationSaving, setEducationSaving] = useState(false)

  // Sync state once profile is loaded
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setTitle(profile.title || '')
      setBio(profile.bio || '')
      setEmail(profile.email || '')
      setGithubUrl(profile.github_url || '')
      setLinkedinUrl(profile.linkedin_url || '')
      setTwitterUrl(profile.twitter_url || '')
      setAvatarUrl(profile.avatar_url || '')
    }
  }, [profile])

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Helper function to compress image if > 1MB on client side
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

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    try {
      let uploadFile = file
      // Check size (> 1MB) and resize on client
      if (file.size > 1024 * 1024) {
        toast.info('Image supérieure à 1Mo. Redimensionnement en cours...')
        uploadFile = await compressImage(file)
      }

      const fileExt = uploadFile.name.split('.').pop()
      const fileName = `${user?.id || 'admin'}-${Date.now()}.${fileExt}`

      const { data, error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(fileName, uploadFile, { cacheControl: '3600', upsert: true })

      if (uploadErr) throw uploadErr

      const { data: linkData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      setAvatarUrl(linkData.publicUrl)
      toast.success('Avatar téléversé avec succès !')
    } catch (err) {
      console.error(err)
      toast.error("Erreur lors de l'upload : " + err.message)
    } finally {
      setUploadingAvatar(false)
    }
  }

  // Update profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileSaving(true)
    try {
      await updateProfile({
        id: user?.id,
        full_name: fullName,
        title,
        bio,
        email,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        twitter_url: twitterUrl,
        avatar_url: avatarUrl,
      })
      toast.success('Profil mis à jour avec succès !')
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde : ' + err.message)
    } finally {
      setProfileSaving(false)
    }
  }

  // Tab 2: Skills Adding
  const handleAddSkill = async (e) => {
    e.preventDefault()
    if (!newSkillName) return
    setSkillAdding(true)
    try {
      await addSkill({
        name: newSkillName,
        category: newSkillCategory,
        level: parseInt(newSkillLevel),
        order_index: skills.length + 1,
      })
      setNewSkillName('')
      setNewSkillLevel(50)
      toast.success('Compétence ajoutée !')
    } catch (err) {
      toast.error("Erreur d'ajout : " + err.message)
    } finally {
      setSkillAdding(false)
    }
  }

  // Skills Editing
  const handleStartEditSkill = (skill) => {
    setEditingSkillId(skill.id)
    setEditSkillName(skill.name || '')
    setEditSkillCategory(skill.category || 'Frontend')
    setEditSkillLevel(skill.level || 50)
  }

  const handleSaveEditSkill = async (id) => {
    if (!editSkillName) return
    setSkillSaving(true)
    try {
      await updateSkill(id, {
        name: editSkillName,
        category: editSkillCategory,
        level: parseInt(editSkillLevel),
      })
      setEditingSkillId(null)
      toast.success('Compétence mise à jour !')
    } catch (err) {
      toast.error('Erreur de sauvegarde : ' + err.message)
    } finally {
      setSkillSaving(false)
    }
  }

  const handleDeleteSkill = async (id) => {
    if (confirm('Voulez-vous supprimer cette compétence ?')) {
      try {
        await deleteSkill(id)
        toast.success('Compétence supprimée !')
      } catch (err) {
        toast.error('Erreur : ' + err.message)
      }
    }
  }

  // Skills Drag & Drop reordering
  const handleDragEnd = async (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = skills.findIndex((s) => s.id === active.id)
    const newIndex = skills.findIndex((s) => s.id === over.id)

    const updatedList = arrayMove(skills, oldIndex, newIndex)
    setSkills(updatedList)

    try {
      const updates = updatedList.map((skill, index) => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        level: skill.level,
        order_index: index + 1,
      }))

      const { error } = await supabase.from('skills').upsert(updates)
      if (error) throw error
      toast.success('Ordre sauvegardé avec succès !')
    } catch (err) {
      toast.error("Erreur de tri : " + err.message)
    }
  }

  // Tab 3: Education Adding
  const handleAddEducation = async (e) => {
    e.preventDefault()
    if (!newDegree || !newSchool || !newYearStart) return
    setEducationAdding(true)
    try {
      await addEducation({
        degree: newDegree,
        school: newSchool,
        year_start: parseInt(newYearStart),
        year_end: newYearEnd ? parseInt(newYearEnd) : null,
        description: newEduDesc || null,
        order_index: education.length + 1,
      })
      setNewDegree('')
      setNewSchool('')
      setNewYearStart('')
      setNewYearEnd('')
      setNewEduDesc('')
      toast.success('Formation académique ajoutée !')
    } catch (err) {
      toast.error("Erreur d'ajout : " + err.message)
    } finally {
      setEducationAdding(false)
    }
  }

  // Open Education editing Dialog
  const handleStartEditEducation = (edu) => {
    setEditingEduId(edu.id)
    setEditDegree(edu.degree || '')
    setEditSchool(edu.school || '')
    setEditYearStart(edu.year_start || '')
    setEditYearEnd(edu.year_end || '')
    setEditEduDesc(edu.description || '')
    setDialogOpen(true)
  }

  const handleSaveEditEducation = async () => {
    if (!editDegree || !editSchool || !editYearStart) return
    setEducationSaving(true)
    try {
      await updateEducation(editingEduId, {
        degree: editDegree,
        school: editSchool,
        year_start: parseInt(editYearStart),
        year_end: editYearEnd ? parseInt(editYearEnd) : null,
        description: editEduDesc || null,
      })
      setDialogOpen(false)
      toast.success('Formation mise à jour !')
    } catch (err) {
      toast.error('Erreur de mise à jour : ' + err.message)
    } finally {
      setEducationSaving(false)
    }
  }

  const handleDeleteEducation = async (id) => {
    if (confirm('Voulez-vous supprimer cette formation ?')) {
      try {
        await deleteEducation(id)
        toast.success('Formation supprimée !')
      } catch (err) {
        toast.error('Erreur de suppression : ' + err.message)
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-6 border-b border-zinc-900">
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
          <h1 className="text-xl font-black text-white">Mon Profil & Données</h1>
          <p className="text-zinc-400 text-xs mt-0.5">
            Gérez vos informations personnelles, compétences techniques et parcours académique.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profil" className="w-full">
        <TabsList className="bg-zinc-950 border border-zinc-900 p-0.5 h-10 w-full md:w-auto flex justify-start mb-6">
          <TabsTrigger
            value="profil"
            className="text-xs font-bold uppercase tracking-wider px-6 py-2 flex-grow md:flex-grow-0"
          >
            Profil
          </TabsTrigger>
          <TabsTrigger
            value="competences"
            className="text-xs font-bold uppercase tracking-wider px-6 py-2 flex-grow md:flex-grow-0"
          >
            Compétences
          </TabsTrigger>
          <TabsTrigger
            value="formation"
            className="text-xs font-bold uppercase tracking-wider px-6 py-2 flex-grow md:flex-grow-0"
          >
            Formations
          </TabsTrigger>
        </TabsList>

        {/* =========================================================================
            TAB 1: PROFIL FORM
            ========================================================================= */}
        <TabsContent value="profil">
          <Card className="border-zinc-800 bg-zinc-900/10">
            <CardHeader className="pb-4 border-b border-zinc-900">
              <CardTitle className="text-base font-bold text-white">
                Détails du Profil
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs">
                Ces informations constituent l'en-tête et les coordonnées de votre site public.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-6 pt-6">
                {/* Photo Upload Row */}
                <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
                  <div className="relative h-20 w-20 rounded-full border border-zinc-800 bg-zinc-900 overflow-hidden flex items-center justify-center">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiLoader className="h-6 w-6 text-zinc-650 animate-spin" />
                    )}
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <FiLoader className="h-5 w-5 text-indigo-400 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 flex-grow text-center md:text-left">
                    <Label className="text-zinc-350 text-xs font-bold uppercase tracking-wider">
                      Photo de profil (Avatar)
                    </Label>
                    <p className="text-[10px] text-zinc-500">
                      Formats autorisés : JPG, PNG. Poids max : 1Mo (compressé à l'upload).
                    </p>
                    <div className="flex justify-center md:justify-start gap-2">
                      <Input
                        type="file"
                        id="avatar-file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingAvatar}
                        onClick={() =>
                          document.getElementById('avatar-file')?.click()
                        }
                        className="border-zinc-850 hover:bg-zinc-900 text-zinc-300 font-semibold text-xs gap-1.5 h-8 bg-zinc-950"
                      >
                        <FiUpload className="h-3.5 w-3.5" /> Choisir une photo
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Name & Title Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-350 text-xs font-semibold">
                      Nom Complet
                    </Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-zinc-950 border-zinc-800 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-350 text-xs font-semibold">
                      Titre Professionnel
                    </Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="bg-zinc-950 border-zinc-800 text-white"
                      placeholder="ex: Développeur Full Stack"
                    />
                  </div>
                </div>

                {/* Biography Textarea */}
                <div className="space-y-1.5">
                  <Label className="text-zinc-350 text-xs font-semibold">
                    Biographie Courte
                  </Label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-zinc-850 bg-zinc-950 text-white px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  />
                </div>

                {/* Social links / Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-zinc-350 text-xs font-semibold">
                      Email Public
                    </Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-zinc-950 border-zinc-800 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-350 text-xs font-semibold">
                      Profil GitHub
                    </Label>
                    <Input
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="bg-zinc-950 border-zinc-800 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-350 text-xs font-semibold">
                      Profil LinkedIn
                    </Label>
                    <Input
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="bg-zinc-950 border-zinc-800 text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-zinc-350 text-xs font-semibold">
                      Profil Twitter / X
                    </Label>
                    <Input
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="bg-zinc-950 border-zinc-800 text-white"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-zinc-900 pt-4 mt-6">
                <Button
                  type="submit"
                  disabled={profileSaving}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 font-bold h-9"
                >
                  {profileSaving ? (
                    <FiLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <FiSave className="h-4 w-4" />
                  )}
                  Enregistrer le Profil
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* =========================================================================
            TAB 2: COMPÉTENCES
            ========================================================================= */}
        <TabsContent value="competences" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Skill Column */}
            <div className="lg:col-span-1 col-span-1">
              <Card className="border-zinc-800 bg-zinc-900/10">
                <CardHeader className="pb-4 border-b border-zinc-900">
                  <CardTitle className="text-base font-bold text-white">
                    Ajouter une Compétence
                  </CardTitle>
                </CardHeader>
                <form onSubmit={handleAddSkill}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-1.5">
                      <Label className="text-zinc-350 text-xs">
                        Nom de la compétence
                      </Label>
                      <Input
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        required
                        className="bg-zinc-950 border-zinc-800 text-white"
                        placeholder="ex: Tailwind CSS"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-zinc-350 text-xs">Catégorie</Label>
                      <Select
                        value={newSkillCategory}
                        onValueChange={setNewSkillCategory}
                      >
                        <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white text-xs h-9 w-full">
                          <SelectValue placeholder="Choisir une catégorie" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-zinc-800 text-white">
                          <SelectItem value="Frontend">Frontend</SelectItem>
                          <SelectItem value="Backend">Backend</SelectItem>
                          <SelectItem value="DevOps">DevOps</SelectItem>
                          <SelectItem value="Database">Database</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <Label>Niveau de maîtrise</Label>
                        <span className="font-bold text-indigo-400">
                          {newSkillLevel}%
                        </span>
                      </div>
                      <Slider
                        value={[newSkillLevel]}
                        onValueChange={(val) => setNewSkillLevel(val[0])}
                        min={1}
                        max={100}
                        className="py-2"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      type="submit"
                      disabled={skillAdding}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 font-bold h-9"
                    >
                      {skillAdding ? (
                        <FiLoader className="h-4 w-4 animate-spin" />
                      ) : (
                        <FiPlus className="h-4 w-4" />
                      )}
                      Ajouter la Compétence
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            {/* Skills List Column */}
            <div className="lg:col-span-2 col-span-1">
              <Card className="border-zinc-800 bg-zinc-900/10">
                <CardHeader className="pb-4 border-b border-zinc-900">
                  <CardTitle className="text-base font-bold text-white">
                    Liste des Compétences ({skills.length})
                  </CardTitle>
                  <CardDescription className="text-zinc-550 text-xs">
                    Glissez-déposez les lignes (poignée gauche) pour réorganiser l'affichage du site public.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/20">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-450 text-[10px] uppercase font-bold tracking-wider">
                          <th className="p-3 w-10"></th>
                          <th className="p-3">Nom</th>
                          <th className="p-3">Catégorie</th>
                          <th className="p-3">Maitrise</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skills.length > 0 ? (
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                          >
                            <SortableContext
                              items={skills.map((s) => s.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              {skills.map((skill) => (
                                <SortableSkillRow
                                  key={skill.id}
                                  skill={skill}
                                  onDelete={handleDeleteSkill}
                                  onStartEdit={handleStartEditSkill}
                                  isEditing={editingSkillId === skill.id}
                                  editName={editSkillName}
                                  setEditName={setEditSkillName}
                                  editCategory={editSkillCategory}
                                  setEditCategory={setEditSkillCategory}
                                  editLevel={editSkillLevel}
                                  setEditLevel={setEditSkillLevel}
                                  onSaveEdit={handleSaveEditSkill}
                                  onCancelEdit={() => setEditingSkillId(null)}
                                  isSaving={skillSaving}
                                />
                              ))}
                            </SortableContext>
                          </DndContext>
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="p-8 text-center text-xs text-zinc-550"
                            >
                              Aucune compétence trouvée.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* =========================================================================
            TAB 3: FORMATION
            ========================================================================= */}
        <TabsContent value="formation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Education Column */}
            <div className="lg:col-span-1 col-span-1">
              <Card className="border-zinc-800 bg-zinc-900/10">
                <CardHeader className="pb-4 border-b border-zinc-900">
                  <CardTitle className="text-base font-bold text-white">
                    Ajouter une Formation
                  </CardTitle>
                </CardHeader>
                <form onSubmit={handleAddEducation}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-1.5">
                      <Label className="text-zinc-350 text-xs">Diplôme</Label>
                      <Input
                        value={newDegree}
                        onChange={(e) => setNewDegree(e.target.value)}
                        required
                        className="bg-zinc-950 border-zinc-800 text-white"
                        placeholder="ex: Baccalauréat Scientifique"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-zinc-350 text-xs">École</Label>
                      <Input
                        value={newSchool}
                        onChange={(e) => setNewSchool(e.target.value)}
                        required
                        className="bg-zinc-950 border-zinc-800 text-white"
                        placeholder="ex: Lycée de Bellevue"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-zinc-350 text-xs">Début (Année)</Label>
                        <Input
                          type="number"
                          value={newYearStart}
                          onChange={(e) => setNewYearStart(e.target.value)}
                          required
                          className="bg-zinc-950 border-zinc-800 text-white"
                          placeholder="2018"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-zinc-350 text-xs">Fin (Année)</Label>
                        <Input
                          type="number"
                          value={newYearEnd}
                          onChange={(e) => setNewYearEnd(e.target.value)}
                          className="bg-zinc-950 border-zinc-800 text-white"
                          placeholder="2021 (vide = actuel)"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-zinc-350 text-xs">Description</Label>
                      <textarea
                        value={newEduDesc}
                        onChange={(e) => setNewEduDesc(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-zinc-850 bg-zinc-950 text-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Détails du parcours d'études..."
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      type="submit"
                      disabled={educationAdding}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-1.5 font-bold h-9"
                    >
                      {educationAdding ? (
                        <FiLoader className="h-4 w-4 animate-spin" />
                      ) : (
                        <FiPlus className="h-4 w-4" />
                      )}
                      Ajouter le Parcours
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            {/* List Education Column */}
            <div className="lg:col-span-2 col-span-1">
              <Card className="border-zinc-800 bg-zinc-900/10 animate-fade-in">
                <CardHeader className="pb-4 border-b border-zinc-900">
                  <CardTitle className="text-base font-bold text-white">
                    Parcours Académique ({education.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/20">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-450 text-[10px] uppercase font-bold tracking-wider">
                          <th className="p-3">Diplôme / Titre</th>
                          <th className="p-3">École</th>
                          <th className="p-3">Années</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {education.length > 0 ? (
                          education.map((edu) => (
                            <tr
                              key={edu.id}
                              className="border-b border-zinc-800 hover:bg-zinc-900/30 transition-colors"
                            >
                              <td className="p-3 text-xs font-bold text-white">
                                {edu.degree}
                              </td>
                              <td className="p-3 text-xs text-zinc-400">
                                {edu.school}
                              </td>
                              <td className="p-3 text-xs text-zinc-400">
                                {edu.year_start} - {edu.year_end || 'Présent'}
                              </td>
                              <td className="p-3 text-right w-24">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleStartEditEducation(edu)}
                                    className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-zinc-850"
                                  >
                                    <FiEdit className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDeleteEducation(edu.id)}
                                    className="h-7 w-7 text-zinc-550 hover:text-red-400 hover:bg-red-955/20"
                                  >
                                    <FiTrash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="p-8 text-center text-xs text-zinc-550"
                            >
                              Aucune formation académique trouvée.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* =========================================================================
          EDUCATION EDITING DIALOG MODAL
          ========================================================================= */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white p-6">
          <DialogHeader className="pb-3 border-b border-zinc-900">
            <DialogTitle className="text-base font-extrabold text-white">
              Modifier la Formation
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Mettez à jour les détails de ce parcours académique.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="space-y-1.5">
              <Label className="text-zinc-350 text-xs">Diplôme</Label>
              <Input
                value={editDegree}
                onChange={(e) => setEditDegree(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-850 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-350 text-xs">École</Label>
              <Input
                value={editSchool}
                onChange={(e) => setEditSchool(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-850 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-zinc-350 text-xs">Début (Année)</Label>
                <Input
                  type="number"
                  value={editYearStart}
                  onChange={(e) => setEditYearStart(e.target.value)}
                  required
                  className="bg-zinc-900 border-zinc-850 text-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-350 text-xs">Fin (Année)</Label>
                <Input
                  type="number"
                  value={editYearEnd}
                  onChange={(e) => setEditYearEnd(e.target.value)}
                  className="bg-zinc-900 border-zinc-850 text-white"
                  placeholder="vide = actuel"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-zinc-350 text-xs">Description</Label>
              <textarea
                value={editEduDesc}
                onChange={(e) => setEditEduDesc(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-zinc-850 bg-zinc-900 text-white px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-zinc-900 pt-4">
            <div className="flex items-center justify-end gap-2 w-full">
              <Button
                variant="outline"
                type="button"
                onClick={() => setDialogOpen(false)}
                className="border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs bg-zinc-950 h-9 font-bold"
              >
                Fermer
              </Button>
              <Button
                type="button"
                onClick={handleSaveEditEducation}
                disabled={educationSaving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold h-9 gap-1.5"
              >
                {educationSaving ? (
                  <FiLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <FiSave className="h-4 w-4" />
                )}
                Sauvegarder
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
