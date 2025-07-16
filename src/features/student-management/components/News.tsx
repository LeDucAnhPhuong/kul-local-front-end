"use client"

import React from "react"
import { useRef } from "react"

import type { ReactElement } from "react"
import { useState, useCallback, useMemo, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Upload,
  Calendar,
  User,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"

export type News = {
  id: number
  title: string
  content: string
  image?: string
  class_id: number
  user_id: number
  isActive: boolean
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
  date?: string
  source?: string
}

const initialNews: News[] = [
  {
    id: 1,
    title: "Sustainable Farming Initiatives in Vietnam's Mekong Delta: A Path to Resilience",
    content:
      "The article focuses on Vietnamese farmers and local government officials working together to implement sustainable farming practices in the Mekong Delta region. These initiatives aim to combat climate change effects and improve agricultural resilience.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
    class_id: 101,
    user_id: 5,
    isActive: true,
    created_by: "admin",
    updated_by: "admin",
    created_at: "2024-06-01",
    updated_at: "2024-06-01",
    date: "27/6/2025",
    source: "ABC news",
  },
  {
    id: 2,
    title: "Vietnam's Tech Boom: Innovations Shaping the Future",
    content:
      "Vietnamese entrepreneurs and tech startups are driving innovation across various sectors, from fintech to e-commerce, positioning Vietnam as a major tech hub in Southeast Asia.",
    image: "https://dulichviet.com.vn/images/bandidau/danh-sach-nhung-buc-anh-viet-nam-lot-top-anh-dep-the-gioi.jpg",
    class_id: 102,
    user_id: 6,
    isActive: true,
    created_by: "admin",
    updated_by: "admin",
    created_at: "2024-06-02",
    updated_at: "2024-06-02",
    date: "27/6/2025",
    source: "ABC news",
  },
  {
    id: 3,
    title: "Cultural Heritage Preservation in Vietnam: A Community Effort",
    content:
      "Local communities and cultural organizations are working together to preserve Vietnam's rich cultural heritage through various conservation programs and educational initiatives.",
    image:
      "https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg",
    class_id: 103,
    user_id: 7,
    isActive: true,
    created_by: "admin",
    updated_by: "admin",
    created_at: "2024-06-03",
    updated_at: "2024-06-03",
    date: "27/6/2025",
    source: "ABC news",
  },
]

// Rich Text Editor Component
const RichTextEditor = React.memo(
  ({
    content,
    setContent,
    fontSize,
    setFontSize,
    textAlign,
    setTextAlign,
  }: {
    content: string
    setContent: (content: string) => void
    fontSize: number
    setFontSize: (size: number) => void
    textAlign: "left" | "center" | "right"
    setTextAlign: (align: "left" | "center" | "right") => void
  }) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

    const updateActiveFormats = useCallback(() => {
      const formats = new Set<string>()
      try {
        if (document.queryCommandState("bold")) formats.add("bold")
        if (document.queryCommandState("italic")) formats.add("italic")
        if (document.queryCommandState("underline")) formats.add("underline")
        if (document.queryCommandState("justifyLeft")) formats.add("justifyLeft")
        if (document.queryCommandState("justifyCenter")) formats.add("justifyCenter")
        if (document.queryCommandState("justifyRight")) formats.add("justifyRight")
      } catch (e) {
        // Ignore errors
      }
      setActiveFormats(formats)
    }, [])

    const execCommand = useCallback(
      (command: string, value?: string) => {
        try {
          document.execCommand(command, false, value)
          if (editorRef.current) {
            setContent(editorRef.current.innerHTML)
            setTimeout(updateActiveFormats, 10)
          }
        } catch (e) {
          console.error("Error executing command:", e)
        }
      },
      [setContent, updateActiveFormats],
    )

    const handleInput = useCallback(() => {
      if (editorRef.current) {
        setContent(editorRef.current.innerHTML)
      }
    }, [setContent])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
          switch (e.key.toLowerCase()) {
            case "b":
              e.preventDefault()
              execCommand("bold")
              break
            case "i":
              e.preventDefault()
              execCommand("italic")
              break
            case "u":
              e.preventDefault()
              execCommand("underline")
              break
          }
        }
      },
      [execCommand],
    )

    const handleAlignmentChange = useCallback(
      (alignment: "left" | "center" | "right") => {
        setTextAlign(alignment)
        const command = alignment === "left" ? "justifyLeft" : alignment === "center" ? "justifyCenter" : "justifyRight"
        execCommand(command)
      },
      [execCommand, setTextAlign],
    )

    const handleFontSizeChange = useCallback(
      (size: number) => {
        setFontSize(size)
        if (editorRef.current) {
          editorRef.current.style.fontSize = `${size}px`
        }
      },
      [setFontSize],
    )

    useEffect(() => {
      if (editorRef.current && content !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = content
      }
    }, [content])

    return (
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">
          News Content <span className="text-red-500">*</span>
        </Label>
        <div className="overflow-hidden border border-gray-300 rounded-lg">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-3 border-b border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 transition-colors ${
                activeFormats.has("bold")
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => execCommand("bold")}
              type="button"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 transition-colors ${
                activeFormats.has("italic")
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => execCommand("italic")}
              type="button"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 transition-colors ${
                activeFormats.has("underline")
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => execCommand("underline")}
              type="button"
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 mx-2 bg-gray-300" />
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 transition-colors ${
                activeFormats.has("justifyLeft")
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleAlignmentChange("left")}
              type="button"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 transition-colors ${
                activeFormats.has("justifyCenter")
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleAlignmentChange("center")}
              type="button"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`w-8 h-8 p-0 transition-colors ${
                activeFormats.has("justifyRight")
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              onClick={() => handleAlignmentChange("right")}
              type="button"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 mx-2 bg-gray-300" />
            <div className="flex items-center gap-1">
              <span className="mr-1 text-xs text-gray-600">Size:</span>
              {[10, 12, 14, 16, 18, 20, 24].map((size) => (
                <Button
                  key={size}
                  variant="ghost"
                  size="sm"
                  className={`h-8 px-2 text-xs transition-colors ${
                    fontSize === size
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
                  }`}
                  onClick={() => handleFontSizeChange(size)}
                  type="button"
                  title={`Font Size ${size}px`}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
          {/* Content Area */}
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[300px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset text-gray-900 relative"
            onInput={handleInput}
            onFocus={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            onKeyUp={updateActiveFormats}
            onKeyDown={handleKeyDown}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: "1.6",
            }}
            suppressContentEditableWarning={true}
            data-placeholder="Enter your news content here..."
          />
        </div>
        <style jsx>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
            position: absolute;
          }
        `}</style>
      </div>
    )
  },
)

// Move this outside the main component, before the export default function
const NewsForm = React.memo(
  ({
    isEdit = false,
    newTitle,
    setNewTitle,
    newDate,
    setNewDate,
    newSource,
    setNewSource,
    newImage,
    newContent,
    setNewContent,
    showDatePicker,
    setShowDatePicker,
    currentMonth,
    setCurrentMonth,
    generateCalendarDays,
    handleDateSelect,
    formatDate,
    handleImageUpload,
    fontSize,
    setFontSize,
    textAlign,
    setTextAlign,
  }: {
    isEdit?: boolean
    newTitle: string
    setNewTitle: (value: string) => void
    newDate: string
    setNewDate: (value: string) => void
    newSource: string
    setNewSource: (value: string) => void
    newImage: string
    newContent: string
    setNewContent: (value: string) => void
    showDatePicker: boolean
    setShowDatePicker: (value: boolean) => void
    currentMonth: Date
    setCurrentMonth: (value: Date) => void
    generateCalendarDays: () => any[]
    handleDateSelect: (dateStr: string) => void
    formatDate: (date: Date) => string
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
    fontSize: number
    setFontSize: (size: number) => void
    textAlign: "left" | "center" | "right"
    setTextAlign: (align: "left" | "center" | "right") => void
  }): ReactElement => (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
          News Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder="Enter news title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          autoComplete="off"
        />
        <div className="text-xs text-right text-gray-500">{newTitle.length}/100 characters</div>
      </div>

      {/* Date and Source */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative space-y-2">
          <Label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Calendar className="w-4 h-4" />
            Date
          </Label>
          <div className="relative">
            <Input
              id="date"
              placeholder="DD/MM/YYYY"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="pr-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              autoComplete="off"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute w-8 h-8 p-0 transform -translate-y-1/2 right-1 top-1/2 hover:bg-gray-100"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
          {showDatePicker && (
            <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[280px]">
              <div className="flex items-center justify-between mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="font-semibold text-gray-900">
                  {currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-medium text-center text-gray-500">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                  <div key={day} className="p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 text-xs ${
                      day.isCurrentMonth
                        ? "text-gray-900 hover:bg-blue-50 hover:text-blue-600"
                        : "text-gray-300 cursor-not-allowed"
                    } ${day.isToday ? "bg-blue-100 text-blue-600 font-semibold" : ""}`}
                    onClick={() => day.isCurrentMonth && handleDateSelect(formatDate(day.date))}
                    disabled={!day.isCurrentMonth}
                  >
                    {day.date.getDate()}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="source" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <User className="w-4 h-4" />
            Source
          </Label>
          <Input
            id="source"
            placeholder="ABC news"
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            className="text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label htmlFor="image" className="text-sm font-semibold text-gray-700">
          Image
        </Label>
        <div className="p-8 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400">
          <input type="file" id="image" accept="image/*" onChange={handleImageUpload} className="hidden" />
          <label htmlFor="image" className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
            {newImage ? (
              <img
                src={newImage || "/placeholder.svg"}
                alt="Preview"
                className="object-cover w-32 h-32 rounded-lg shadow-md"
              />
            ) : (
              <>
                <Upload className="w-12 h-12 text-gray-400" />
                <div className="text-center">
                  <span className="text-sm font-medium text-gray-700">Click to upload image</span>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Rich Text Editor */}
      <RichTextEditor
        content={newContent}
        setContent={setNewContent}
        fontSize={fontSize}
        setFontSize={setFontSize}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
      />
    </div>
  ),
)

export default function NewsTable() {
  const [newsData, setNewsData] = useState<News[]>(initialNews)
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)

  // Form states
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newImage, setNewImage] = useState("")
  const [newDate, setNewDate] = useState("")
  const [newSource, setNewSource] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Rich text editor states
  const [fontSize, setFontSize] = useState(14)
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("left")

  // Reset form when dialogs close
  useEffect(() => {
    if (!open && !editOpen) {
      resetForm()
    }
  }, [open, editOpen])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }, [])

  const handleDateSelect = useCallback((dateStr: string) => {
    setNewDate(dateStr)
    setShowDatePicker(false)
  }, [])

  const generateCalendarDays = useCallback(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      days.push({
        date: date,
        isCurrentMonth: date.getMonth() === month,
        isToday: date.toDateString() === new Date().toDateString(),
      })
    }
    return days
  }, [currentMonth])

  // Helper function to strip HTML tags for plain text content
  const stripHtml = useCallback((html: string) => {
    const tmp = document.createElement("div")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }, [])

  const handleAddNews = useCallback(() => {
    const plainTextContent = stripHtml(newContent)
    if (!newTitle.trim() || !plainTextContent.trim()) {
      toast.error("Please fill in both Title and Content")
      return
    }

    const newNews: News = {
      id: Date.now(),
      title: newTitle,
      content: newContent, // Store HTML content
      image: newImage || undefined,
      class_id: 0,
      user_id: 0,
      isActive: true,
      created_by: "admin",
      updated_by: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      date: newDate || formatDate(new Date()),
      source: newSource || "ABC news",
    }

    setNewsData((prev) => [newNews, ...prev])
    toast.success("News created successfully")
    setOpen(false)
  }, [newTitle, newContent, newImage, newDate, newSource, formatDate, stripHtml])

  const handleEditNews = useCallback(() => {
    const plainTextContent = stripHtml(newContent)
    if (!selectedNews || !newTitle.trim() || !plainTextContent.trim()) {
      toast.error("Please fill in both Title and Content")
      return
    }

    const updatedNews = {
      ...selectedNews,
      title: newTitle,
      content: newContent, // Store HTML content
      image: newImage || selectedNews.image,
      date: newDate || selectedNews.date,
      source: newSource || selectedNews.source,
      updated_at: new Date().toISOString(),
    }

    setNewsData((prev) => prev.map((news) => (news.id === selectedNews.id ? updatedNews : news)))
    toast.success("News updated successfully")
    setEditOpen(false)
  }, [selectedNews, newTitle, newContent, newImage, newDate, newSource, stripHtml])

  const resetForm = useCallback(() => {
    setNewTitle("")
    setNewContent("")
    setNewImage("")
    setNewDate("")
    setNewSource("")
    setImageFile(null)
    setSelectedNews(null)
    setFontSize(14)
    setTextAlign("left")
  }, [])

  const handleView = useCallback((news: News) => {
    setSelectedNews(news)
    setViewOpen(true)
  }, [])

  const handleEdit = useCallback((news: News) => {
    setSelectedNews(news)
    setNewTitle(news.title)
    setNewContent(news.content)
    setNewImage(news.image || "")
    setNewDate(news.date || "")
    setNewSource(news.source || "")
    setEditOpen(true)
  }, [])

  const handleDelete = useCallback((id: number) => {
    setNewsData((prev) => prev.filter((n) => n.id !== id))
    toast.success("News deleted")
  }, [])

  const columns: ColumnDef<News>[] = useMemo(
    () => [
      {
        accessorKey: "image",
        header: "Image",
        cell: ({ row }) => (
          <div className="w-16 h-12 overflow-hidden bg-gray-100 rounded">
            {row.original.image ? (
              <img
                src={row.original.image || "/placeholder.svg"}
                alt={row.getValue("title")}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <Upload className="w-4 h-4" />
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "TITLE",
        cell: ({ row }) => (
          <div className="max-w-xs font-medium leading-tight" title={row.getValue("title")}>
            {row.getValue("title")}
          </div>
        ),
      },
      {
        accessorKey: "content",
        header: "CONTENT",
        cell: ({ row }) => {
          const content = row.getValue("content") as string
          const plainText = stripHtml(content)
          return (
            <div className="max-w-xs text-muted-foreground line-clamp-2" title={plainText}>
              {plainText}
            </div>
          )
        },
      },
      {
        accessorKey: "date",
        header: "DATE",
        cell: ({ row }) => (
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <Calendar className="w-3 h-3" />
            {row.original.date}
          </div>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <DotsHorizontalIcon className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(row.original)}>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  View
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <div className="flex items-center gap-2">
                  <Edit className="w-4 h-4 text-green-500" />
                  Edit
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [handleView, handleEdit, handleDelete, stripHtml],
  )

  return (
    <div className="p-6 bg-white border dark:bg-background rounded-xl border-stone-200 dark:border-stone-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">List News Title</h1>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 shadow-md hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Write News
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="p-6 mb-0 -m-6 text-white bg-gradient-to-r from-red-500 to-red-600">
              <DialogTitle className="text-xl font-semibold text-center">Write News</DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <NewsForm
                isEdit={false}
                newTitle={newTitle}
                setNewTitle={setNewTitle}
                newDate={newDate}
                setNewDate={setNewDate}
                newSource={newSource}
                setNewSource={setNewSource}
                newImage={newImage}
                newContent={newContent}
                setNewContent={setNewContent}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                generateCalendarDays={generateCalendarDays}
                handleDateSelect={handleDateSelect}
                formatDate={formatDate}
                handleImageUpload={handleImageUpload}
                fontSize={fontSize}
                setFontSize={setFontSize}
                textAlign={textAlign}
                setTextAlign={setTextAlign}
              />
            </div>
            <DialogFooter className="gap-3 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="px-8 border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button onClick={handleAddNews} className="px-8 bg-green-500 shadow-md hover:bg-green-600">
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* View Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 mb-0 -m-6 text-white bg-gradient-to-r from-blue-500 to-blue-600">
            <DialogTitle className="text-xl font-semibold text-center">View News</DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">{selectedNews.title}</h3>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedNews.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {selectedNews.source}
                  </div>
                </div>
              </div>
              {selectedNews.image && (
                <div className="flex justify-center">
                  <img
                    src={selectedNews.image || "/placeholder.svg"}
                    alt={selectedNews.title}
                    className="h-auto max-w-full rounded-lg shadow-md"
                  />
                </div>
              )}
              <div
                className="leading-relaxed prose text-gray-700 max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedNews.content }}
              />
            </div>
          )}
          <DialogFooter className="pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={() => setViewOpen(false)} className="px-8">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 mb-0 -m-6 text-white bg-gradient-to-r from-green-500 to-green-600">
            <DialogTitle className="text-xl font-semibold text-center">Edit News</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <NewsForm
              isEdit={true}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              newDate={newDate}
              setNewDate={setNewDate}
              newSource={newSource}
              setNewSource={setNewSource}
              newImage={newImage}
              newContent={newContent}
              setNewContent={setNewContent}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
              generateCalendarDays={generateCalendarDays}
              handleDateSelect={handleDateSelect}
              formatDate={formatDate}
              handleImageUpload={handleImageUpload}
              fontSize={fontSize}
              setFontSize={setFontSize}
              textAlign={textAlign}
              setTextAlign={setTextAlign}
            />
          </div>
          <DialogFooter className="gap-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              className="px-8 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button onClick={handleEditNews} className="px-8 bg-blue-500 shadow-md hover:bg-blue-600">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th key={index} className="px-4 py-3 text-sm font-medium text-left text-gray-900">
                    {typeof column.header === "string" ? column.header : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {newsData.map((news) => (
                <tr key={news.id} className="hover:bg-gray-50">
                  {columns.map((column, index) => (
                    <td key={index} className="px-4 py-3">
                      {typeof column.cell === "function"
                        ? column.cell({
                            row: { original: news, getValue: (key: string) => news[key as keyof News] },
                          } as any)
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
