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
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  getSourcesRequest,
  upsertSourceRequest,
  deleteSourceRequest,
} from "@/requests/question.requests";

interface Source {
  id: number;
  name: string;
  description?: string;
}

interface SourceFormData {
  name: string;
  description: string;
}

export default function SourcesSection() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [deletingSource, setDeletingSource] = useState<Source | null>(null);
  const [formData, setFormData] = useState<SourceFormData>({
    name: "",
    description: "",
  });

  const loadSources = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getSourcesRequest();
      if (!response.error) {
        setSources(response.data || []);
      } else {
        toast.error("Nu s-au putut încărca sursele.");
      }
    } catch {
      toast.error("Nu s-au putut încărca sursele.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSources();
  }, [loadSources]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Numele sursei este obligatoriu.");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        ...(editingSource && { id: editingSource.id }),
      };

      const response = await upsertSourceRequest(payload);
      if (!response.error) {
        toast.success(
          editingSource
            ? "Sursa a fost actualizată cu succes."
            : "Sursa a fost adăugată cu succes."
        );
        setIsDialogOpen(false);
        setEditingSource(null);
        setFormData({ name: "", description: "" });
        loadSources();
      } else {
        toast.error("Nu s-a putut salva sursa.");
      }
    } catch {
      toast.error("Nu s-a putut salva sursa.");
    }
  };

  const handleEdit = (source: Source) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      description: source.description || "",
    });
    setIsDialogOpen(true);
  };
  const handleDelete = async (id: number) => {
    try {
      const response = await deleteSourceRequest(id);
      if (!response.error) {
        toast.success("Sursa a fost ștearsă cu succes.");
        loadSources();
        setIsDeleteDialogOpen(false);
        setDeletingSource(null);
      } else {
        toast.error("Nu s-a putut șterge sursa.");
      }
    } catch {
      toast.error("Nu s-a putut șterge sursa.");
    }
  };

  const openDeleteDialog = (source: Source) => {
    setDeletingSource(source);
    setIsDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSource(null);
    setFormData({ name: "", description: "" });
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Surse</CardTitle>
            <CardDescription>
              Gestionează sursele pentru întrebări
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă sursă
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
                <TableHead>Descriere</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Nu există surse definite
                  </TableCell>
                </TableRow>
              ) : (
                sources.map((source) => (
                  <TableRow key={source.id}>
                    <TableCell className="font-medium">{source.name}</TableCell>
                    <TableCell>{source.description || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(source)}>
                          <Pencil className="h-4 w-4" />
                        </Button>{" "}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(source)}>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSource ? "Editează sursa" : "Adaugă sursă nouă"}
              </DialogTitle>
              <DialogDescription>
                {editingSource
                  ? "Modifică informațiile sursei"
                  : "Completează informațiile pentru noua sursă"}
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
                  placeholder="Numele sursei"
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
                  placeholder="Descrierea sursei (opțional)"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Anulează
              </Button>
              <Button onClick={handleSave}>
                {editingSource ? "Actualizează" : "Adaugă"}
              </Button>{" "}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmă ștergerea</DialogTitle>
              <DialogDescription>
                Sigur doriți să ștergeți sursa &ldquo;{deletingSource?.name}
                &rdquo;? Această acțiune nu poate fi anulată.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setDeletingSource(null);
                }}>
                Anulează
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  deletingSource && handleDelete(deletingSource.id)
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
