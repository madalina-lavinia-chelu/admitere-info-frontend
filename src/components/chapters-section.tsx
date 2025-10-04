"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, FolderOpen, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  getChaptersRequest,
  upsertChapterRequest,
  deleteChapterRequest,
} from "@/requests/question.requests";

interface Chapter {
  id: number;
  name: string;
  parent_id?: number;
  order?: number;
  description?: string;
  type?: string;
  parent?: Chapter;
  children?: Chapter[];
  level?: number;
}

interface ChapterFormData {
  name: string;
  parent_id: string;
  order: string;
  description: string;
}

export default function ChaptersSection() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [deletingChapter, setDeletingChapter] = useState<Chapter | null>(null);
  const [formData, setFormData] = useState<ChapterFormData>({
    name: "",
    parent_id: "none",
    order: "",
    description: "",
  });

  const loadChapters = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getChaptersRequest();
      if (!response.error) {
        setChapters(response.data || []);
      } else {
        toast.error("Nu s-au putut încărca capitolele.");
      }
    } catch {
      toast.error("Nu s-au putut încărca capitolele.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChapters();
  }, [loadChapters]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Numele capitolului este obligatoriu.");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        parent_id:
          formData.parent_id !== "none"
            ? parseInt(formData.parent_id)
            : undefined,
        order: formData.order ? parseInt(formData.order) : undefined,
        description: formData.description.trim(),
        ...(editingChapter && { id: editingChapter.id }),
      };

      const response = await upsertChapterRequest(payload);
      if (!response.error) {
        toast.success(
          editingChapter
            ? "Capitolul a fost actualizat cu succes."
            : "Capitolul a fost adăugat cu succes."
        );
        setIsDialogOpen(false);
        setEditingChapter(null);
        setFormData({
          name: "",
          parent_id: "none",
          order: "",
          description: "",
        });
        loadChapters();
      } else {
        toast.error("Nu s-a putut salva capitolul.");
      }
    } catch {
      toast.error("Nu s-a putut salva capitolul.");
    }
  };

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setFormData({
      name: chapter.name,
      parent_id: chapter.parent_id?.toString() || "none",
      order: chapter.order?.toString() || "",
      description: chapter.description || "",
    });
    setIsDialogOpen(true);
  };
  const handleDelete = async (id: number) => {
    try {
      const response = await deleteChapterRequest(id);
      if (!response.error) {
        toast.success("Capitolul a fost șters cu succes.");
        loadChapters();
        setIsDeleteDialogOpen(false);
        setDeletingChapter(null);
      } else {
        toast.error("Nu s-a putut șterge capitolul.");
      }
    } catch {
      toast.error("Nu s-a putut șterge capitolul.");
    }
  };

  const openDeleteDialog = (chapter: Chapter) => {
    setDeletingChapter(chapter);
    setIsDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingChapter(null);
    setFormData({ name: "", parent_id: "none", order: "", description: "" });
    setIsDialogOpen(true);
  };

  // Create hierarchical structure for display
  const createHierarchy = (
    chapters: Chapter[],
    parentId: number | null = null,
    level = 0
  ): Chapter[] => {
    return chapters
      .filter((chapter) => chapter.parent_id === parentId)
      .map((chapter) => ({
        ...chapter,
        level,
        children: createHierarchy(chapters, chapter.id, level + 1),
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const flattenHierarchy = (hierarchy: Chapter[]): Chapter[] => {
    const result: Chapter[] = [];
    const traverse = (chapters: Chapter[]) => {
      chapters.forEach((chapter) => {
        result.push(chapter);
        if (chapter.children) {
          traverse(chapter.children);
        }
      });
    };
    traverse(hierarchy);
    return result;
  };

  const hierarchicalChapters = createHierarchy(chapters);
  const flatChapters = flattenHierarchy(hierarchicalChapters);

  // Get parent options (exclude current chapter and its descendants when editing)
  const getParentOptions = () => {
    if (!editingChapter) return chapters.filter((c) => !c.parent_id); // Only root chapters for new chapters

    const excludeIds = new Set([editingChapter.id]);
    const addDescendants = (chapterId: number) => {
      chapters
        .filter((c) => c.parent_id === chapterId)
        .forEach((c) => {
          excludeIds.add(c.id);
          addDescendants(c.id);
        });
    };
    addDescendants(editingChapter.id);

    return chapters.filter((c) => !excludeIds.has(c.id));
  };

  const getChapterDisplayName = (chapter: Chapter, level: number = 0) => {
    const indent = "  ".repeat(level);
    return `${indent}${chapter.name}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Capitole</CardTitle>
            <CardDescription>
              Gestionează structura ierarhică a capitolelor
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă capitol
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Se încarcă...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nume</TableHead>
                <TableHead>Ordine</TableHead>
                <TableHead>Descriere</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flatChapters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Nu există capitole definite
                  </TableCell>
                </TableRow>
              ) : (
                flatChapters.map((chapter) => (
                  <TableRow key={chapter.id}>
                    <TableCell className="font-medium">
                      {" "}
                      <div className="flex items-center">
                        {(chapter.level || 0) > 0 && (
                          <span className="mr-2 text-muted-foreground">
                            {"└─".repeat(chapter.level || 0)}
                          </span>
                        )}
                        {chapter.children && chapter.children.length > 0 ? (
                          <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
                        ) : (
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        )}
                        {chapter.name}
                      </div>
                    </TableCell>
                    <TableCell>{chapter.order || "-"}</TableCell>
                    <TableCell>
                      {chapter.description ? (
                        <span className="truncate max-w-xs block">
                          {chapter.description}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(chapter)}>
                          <Pencil className="h-4 w-4" />
                        </Button>{" "}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(chapter)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingChapter ? "Editează capitolul" : "Adaugă capitol nou"}
              </DialogTitle>
              <DialogDescription>
                {editingChapter
                  ? "Modifică informațiile capitolului"
                  : "Completează informațiile pentru noul capitol"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nume *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Numele capitolului"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent_id">Capitol părinte</Label>
                <Select
                  value={formData.parent_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parent_id: value })
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează capitolul părinte (opțional)" />
                  </SelectTrigger>{" "}
                  <SelectContent>
                    <SelectItem value="none">
                      Fără părinte (capitol rădăcină)
                    </SelectItem>
                    {getParentOptions().map((chapter) => (
                      <SelectItem
                        key={chapter.id}
                        value={chapter.id.toString()}>
                        {getChapterDisplayName(chapter, chapter.level || 0)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="order">Ordine</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  placeholder="Ordinea de afișare (opțional)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descriere</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descrierea capitolului (opțional)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Anulează
              </Button>
              <Button onClick={handleSave}>
                {editingChapter ? "Actualizează" : "Adaugă"}
              </Button>{" "}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmă ștergerea</DialogTitle>{" "}
              <DialogDescription>
                Sigur doriți să ștergeți capitolul &ldquo;
                {deletingChapter?.name}&rdquo;? Această acțiune nu poate fi
                anulată.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeletingChapter(null);
                }}>
                Anulează
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  deletingChapter && handleDelete(deletingChapter.id)
                }>
                Șterge
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
