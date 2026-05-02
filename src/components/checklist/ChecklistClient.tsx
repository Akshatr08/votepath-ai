"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, Trash2, Plus, Calendar } from "lucide-react";
import { getGoogleCalendarLink } from "@/lib/calendar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { DEFAULT_CHECKLIST_ITEMS } from "@/constants";
import type { ChecklistItem } from "@/types";
import { generateId, cn } from "@/lib/utils";
import { getUserChecklist, saveUserChecklist, updateChecklistItem } from "@/lib/firestore";
import toast from "react-hot-toast";

export function ChecklistClient() {
  const { isAuthenticated, user, profile, signInWithGoogle } = useAuthContext();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [checklistId, setChecklistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      
      // 1. Try to load from Firestore if authenticated
      if (isAuthenticated && user) {
        const savedChecklist = await getUserChecklist(user.uid);
        if (savedChecklist) {
          setItems(savedChecklist.items);
          setChecklistId(savedChecklist.id);
          setLoading(false);
          return;
        }
      }

      // 2. Fallback to localStorage
      const saved = localStorage.getItem("votepath_checklist");
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch {
          setItems([...DEFAULT_CHECKLIST_ITEMS]);
        }
      } else {
        setItems([...DEFAULT_CHECKLIST_ITEMS]);
      }
      setLoading(false);
    };
    loadItems();
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("votepath_checklist", JSON.stringify(items));
      
      // Sync to Firestore if authenticated
      if (isAuthenticated && user) {
        const syncToFirestore = async () => {
          try {
            if (checklistId) {
              await updateChecklistItem(checklistId, items);
            } else {
              const id = await saveUserChecklist(user.uid, profile?.state || "general", items);
              setChecklistId(id);
            }
          } catch (error) {
            console.error("Failed to sync checklist:", error);
          }
        };
        
        // Simple debounce for auto-save
        const timer = setTimeout(syncToFirestore, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [items, loading, isAuthenticated, user, checklistId, profile?.state]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: item.status === "completed" ? "pending" : "completed" } : item
      )
    );
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: generateId(),
      title: newItemText.trim(),
      description: "",
      status: "pending",
      category: "general",
    };
    setItems((prev) => [...prev, newItem]);
    setNewItemText("");
    toast.success("Item added to your checklist");
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed");
  };

  const completedCount = items.filter((i) => i.status === "completed").length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  if (loading) {
    return <div className="max-w-3xl mx-auto p-10 text-center">Loading your checklist...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-extrabold mb-4">
          My Voter <span className="gradient-text">Checklist</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Keep track of everything you need to do before election day. Your progress is saved automatically.
        </p>
      </motion.div>

      {/* Progress Bar */}
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
              <p className="text-2xl font-bold">{Math.round(progress)}%</p>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {items.length} items
            </span>
          </div>
          <div
            className="h-2 w-full bg-secondary rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Checklist completion progress"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-primary"
              transition={{ duration: 0.5 }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Item */}
      <form onSubmit={addItem} className="flex gap-2 mb-8">
        <input
          type="text"
          id="new-checklist-item"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add a custom task..."
          aria-label="New checklist item"
          className="flex-1 bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button type="submit" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </form>

      {/* Checklist Items */}
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="group"
            >
              <div
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all",
                  item.status === "completed"
                    ? "bg-secondary/30 border-transparent opacity-60"
                    : "bg-card border-border hover:border-primary/30"
                )}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="shrink-0 transition-transform hover:scale-110"
                  aria-label={item.status === "completed" ? "Mark as incomplete" : "Mark as complete"}
                >
                  {item.status === "completed" ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium transition-all",
                      item.status === "completed" && "line-through text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </p>
                  {item.deadline && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Deadline: {item.deadline}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
                  aria-label="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {item.deadline && (
                  <a
                    href={getGoogleCalendarLink(item.title, item.deadline, "Election Reminder via VotePath AI")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title="Add to Google Calendar"
                  >
                    <Calendar className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!isAuthenticated && (
        <div className="mt-10 p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to sync your checklist across devices.
          </p>
          <Button variant="outline" size="sm" onClick={signInWithGoogle}>
            Sign In with Google
          </Button>
        </div>
      )}
    </div>
  );
}
