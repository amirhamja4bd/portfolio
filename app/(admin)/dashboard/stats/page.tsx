"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRequireAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import { statsApi } from "@/lib/api-client";
import { Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface StatItem {
  label: string;
  value: string;
  order: number;
}

export default function StatsPage() {
  const { user, loading } = useRequireAuth();
  const [stats, setStats] = useState<StatItem[]>([]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await statsApi.get();
      if (response.success) {
        if (response.data?.items) {
          setStats(
            response.data.items.sort(
              (a: StatItem, b: StatItem) => a.order - b.order
            )
          );
        }
        if (response.data?.description) {
          setDescription(response.data.description);
        }
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStat = () => {
    setStats([...stats, { label: "", value: "", order: stats.length + 1 }]);
  };

  const handleRemoveStat = (index: number) => {
    const newStats = [...stats];
    newStats.splice(index, 1);
    setStats(newStats);
  };

  const handleUpdateStat = (
    index: number,
    field: keyof StatItem,
    value: string | number
  ) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Ensure order is correct
      const statsToSave = stats.map((stat, index) => ({
        ...stat,
        order: index + 1,
      }));

      const response = await statsApi.update({
        items: statsToSave,
        description: description,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Statistics updated successfully",
        });
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to save stats:", error);
      toast({
        title: "Error",
        description: "Failed to save statistics",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Portfolio Statistics
          </h1>
          <p className="text-muted-foreground">
            Manage the statistics shown on your projects page.
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Projects Section Description</CardTitle>
          <CardDescription>
            The introductory text that appears above your projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for your projects section..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stats Items</CardTitle>
          <CardDescription>
            Add or edit the statistics that appear in the projects section
            header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex items-end gap-4 p-4 border rounded-lg bg-muted/30 relative group"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      placeholder="e.g. Projects Completed"
                      value={stat.label}
                      onChange={(e) =>
                        handleUpdateStat(index, "label", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input
                      placeholder="e.g. 50+"
                      value={stat.value}
                      onChange={(e) =>
                        handleUpdateStat(index, "value", e.target.value)
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveStat(index)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full border-dashed"
            onClick={handleAddStat}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Stat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
