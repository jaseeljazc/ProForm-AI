'use client'

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Upload, Calendar } from "lucide-react";
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
    toast({ title: "Deleted", description: "Progress entry removed." });
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">
              Progress
              <span className="gradient-text"> Tracker</span>
            </h1>
            <p className="text-muted-foreground">
              Document your transformation journey
            </p>
          </div>

          {/* Upload Form */}
          <Card className="glass-card p-6 mb-8">
            <div className="space-y-4">
              <div>
                <Label htmlFor="image">Upload Progress Photo</Label>
                <div className="mt-2">
                  <label htmlFor="image" className="cursor-pointer">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                      {previewImage ? (
                        <img src={previewImage} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click to upload image</p>
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
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="Add notes about your progress..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                onClick={saveEntry} 
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                Save Progress Entry
              </Button>
            </div>
          </Card>

          {/* Timeline */}
          <div className="space-y-6">
            {entries.length === 0 ? (
              <Card className="glass-card p-8 text-center">
                <p className="text-muted-foreground">No progress entries yet. Start tracking today!</p>
              </Card>
            ) : (
              entries.map((entry, index) => (
                <Card key={entry.id} className="glass-card p-6 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <img 
                    src={entry.image} 
                    alt="Progress" 
                    className="w-full rounded-lg mb-4 max-h-96 object-cover"
                  />
                  
                  {entry.note && (
                    <p className="text-sm text-muted-foreground">{entry.note}</p>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

    </div>
  );
};

export default Progress;
