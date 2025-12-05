'use client'

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Upload, Calendar, X, ZoomIn, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProgressEntry {
  id: string;
  date: string;
  note: string;
  image: string;
}

const Progress = () => {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [note, setNote] = useState("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const [fullViewImage, setFullViewImage] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const saved = JSON.parse(localStorage.getItem('progressEntries') || '[]');
    setEntries(saved);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveEntry = () => {
    if (!previewImage) {
      toast({
        title: "Error",
        description: "Please upload an image.",
        variant: "destructive"
      });
      return;
    }

    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      note: note,
      image: previewImage
    };

    const updated = [newEntry, ...entries];
    localStorage.setItem('progressEntries', JSON.stringify(updated));
    setEntries(updated);
    setNote("");
    setPreviewImage("");
    toast({ title: "Success", description: "Progress entry saved!" });
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    localStorage.setItem('progressEntries', JSON.stringify(updated));
    setEntries(updated);
    setDeleteId("");
    toast({ title: "Deleted", description: "Progress entry removed." });
  };

  const openDeleteDialog = (id: string) => {
    setDeleteId(id);
  };

  const closeDeleteDialog = () => {
    setDeleteId("");
  };

  const openFullView = (image: string) => {
    setFullViewImage(image);
  };

  const closeFullView = () => {
    setFullViewImage("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Progress
            <span className="gradient-text"> Tracker</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Document your transformation journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Upload Form */}
          <div className="lg:col-span-1">
            <Card className="glass-card p-6 shadow-md sticky top-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">New Entry</h2>
                </div>

                <div>
                  <Label htmlFor="image" className="text-sm font-medium mb-2 block">
                    Progress Photo
                  </Label>
                  <div className="mt-2">
                    <label htmlFor="image" className="cursor-pointer">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors bg-secondary/20">
                        {previewImage ? (
                          <div className="relative">
                            <img 
                              src={previewImage} 
                              alt="Preview" 
                              className="max-h-48 mx-auto rounded-lg object-cover" 
                            />
                            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                              <Upload className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 py-4">
                            <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium text-foreground">Upload Photo</p>
                              <p className="text-xs text-muted-foreground mt-1">Click to browse</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="note" className="text-sm font-medium mb-2 block">
                    Note (Optional)
                  </Label>
                  <Textarea
                    id="note"
                    placeholder="Weight, measurements, how you feel..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button 
                  onClick={saveEntry} 
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-md"
                >
                  Save Progress Entry
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-3xl font-bold">Your Journey</h2>
              <span className="ml-auto text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            {entries.length === 0 ? (
              <Card className="glass-card p-12 text-center shadow-md">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground text-lg">No progress entries yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start tracking your journey today!
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {entries.map((entry, index) => (
                  <Card 
                    key={entry.id} 
                    className="glass-card overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(entry.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div 
                          className="relative group cursor-pointer rounded-lg overflow-hidden border border-border/50 bg-secondary/20 hover:shadow-lg transition-all"
                          onClick={() => openFullView(entry.image)}
                        >
                          <img 
                            src={entry.image} 
                            alt="Progress" 
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>

                        <div className="md:col-span-2 flex items-start">
                          {entry.note ? (
                            <div className="p-4 bg-secondary/50 rounded-lg border border-border/50 w-full">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {entry.note}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground/50 italic pt-4">
                              No notes added for this entry
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Full View Modal */}
      {fullViewImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeFullView}
        >
          <button
            onClick={closeFullView}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <img 
            src={fullViewImage} 
            alt="Full view" 
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {deleteId && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeDeleteDialog}
        >
          <div 
            className="bg-background rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Delete Progress Entry?</h2>
                <p className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete this progress entry and its photo.
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={closeDeleteDialog}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteEntry(deleteId)}
                  className="flex-1 bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;