import { useState } from "react";
import { useIssues } from "@/hooks/use-issues";
import { LayoutShell } from "@/components/layout-shell";
import { IssueCard } from "@/components/issue-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FilterX, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertIssueSchema, type InsertIssue, type Issue } from "@shared/routes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardPage() {
  const { issues, isLoading, createIssue, deleteIssue, updateIssue } = useIssues();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);

  const filteredIssues = issues?.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase()) || 
                          issue.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const IssueForm = ({ defaultValues, onSubmit, isSubmitting }: { 
    defaultValues?: Partial<InsertIssue>, 
    onSubmit: (data: InsertIssue) => void,
    isSubmitting: boolean 
  }) => {
    const form = useForm<InsertIssue>({
      resolver: zodResolver(insertIssueSchema),
      defaultValues: {
        title: "",
        description: "",
        category: "Road",
        location: "",
        image: "",
        status: "pending",
        ...defaultValues
      },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Large pothole on Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Road", "Water", "Electricity", "Garbage"].map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Address or coordinates" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the issue in detail..." className="resize-none h-24" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {defaultValues?.title ? "Update Issue" : "Submit Report"}
          </Button>
        </form>
      </Form>
    );
  };

  return (
    <LayoutShell>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage and track your reported infrastructure issues.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="shadow-lg shadow-primary/20">
              <Plus className="mr-2 h-5 w-5" />
              Report Issue
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Report New Issue</DialogTitle>
              <DialogDescription>
                Provide details about the infrastructure problem you've encountered.
              </DialogDescription>
            </DialogHeader>
            <IssueForm 
              onSubmit={(data) => createIssue.mutate(data, { onSuccess: () => setIsCreateOpen(false) })}
              isSubmitting={createIssue.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-border/60 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search issues..." 
            className="pl-9 bg-gray-50 border-transparent focus:bg-white focus:border-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-50 border-transparent focus:bg-white focus:border-primary">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {["Road", "Water", "Electricity", "Garbage"].map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || categoryFilter !== "all") && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => { setSearch(""); setCategoryFilter("all"); }}
            title="Clear filters"
          >
            <FilterX className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredIssues?.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-border">
          <div className="bg-primary/5 p-4 rounded-full inline-flex mb-4">
            <Search className="h-8 w-8 text-primary/50" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No issues found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            We couldn't find any issues matching your search criteria. Try adjusting your filters or report a new issue.
          </p>
          <Button 
            variant="link" 
            className="mt-4 text-primary" 
            onClick={() => { setSearch(""); setCategoryFilter("all"); }}
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues?.map((issue) => (
            <IssueCard 
              key={issue.id} 
              issue={issue} 
              onDelete={(id) => deleteIssue.mutate(id)}
              onEdit={(issue) => setEditingIssue(issue)}
            />
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingIssue} onOpenChange={(open) => !open && setEditingIssue(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
          </DialogHeader>
          {editingIssue && (
            <IssueForm
              defaultValues={editingIssue}
              onSubmit={(data) => updateIssue.mutate({ id: editingIssue.id, ...data }, { onSuccess: () => setEditingIssue(null) })}
              isSubmitting={updateIssue.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </LayoutShell>
  );
}
