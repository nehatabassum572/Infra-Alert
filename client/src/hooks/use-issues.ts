import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertIssue } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useIssues() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const issuesQuery = useQuery({
    queryKey: [api.issues.list.path],
    queryFn: async () => {
      const res = await fetch(api.issues.list.path);
      if (!res.ok) throw new Error("Failed to fetch issues");
      return api.issues.list.responses[200].parse(await res.json());
    },
  });

  const createIssueMutation = useMutation({
    mutationFn: async (data: InsertIssue) => {
      const res = await fetch(api.issues.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create issue");
      }
      return api.issues.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.issues.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
      toast({
        title: "Issue Reported",
        description: "Your report has been submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateIssueMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<InsertIssue>) => {
      const url = buildUrl(api.issues.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update issue");
      return api.issues.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.issues.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
      toast({
        title: "Issue Updated",
        description: "The issue status has been updated.",
      });
    },
  });

  const deleteIssueMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.issues.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete issue");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.issues.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.stats.get.path] });
      toast({
        title: "Deleted",
        description: "The issue has been removed.",
      });
    },
  });

  return {
    issues: issuesQuery.data,
    isLoading: issuesQuery.isLoading,
    isError: issuesQuery.isError,
    createIssue: createIssueMutation,
    updateIssue: updateIssueMutation,
    deleteIssue: deleteIssueMutation,
  };
}

export function useStats() {
  return useQuery({
    queryKey: [api.stats.get.path],
    queryFn: async () => {
      const res = await fetch(api.stats.get.path);
      if (!res.ok) throw new Error("Failed to fetch stats");
      return api.stats.get.responses[200].parse(await res.json());
    },
  });
}
