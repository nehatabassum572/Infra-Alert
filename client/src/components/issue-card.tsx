import { type Issue } from "@shared/schema";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Trash2, Edit2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IssueCardProps {
  issue: Issue;
  onEdit?: (issue: Issue) => void;
  onDelete?: (id: number) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  in_progress: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  resolved: "bg-green-100 text-green-800 hover:bg-green-100",
};

const categoryIcons = {
  Road: "🛣️",
  Water: "💧",
  Electricity: "⚡",
  Garbage: "🗑️",
};

export function IssueCard({ issue, onEdit, onDelete }: IssueCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === issue.userId;
  const isAdmin = user?.role === "admin";
  const canModify = isOwner || isAdmin;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/60 group h-full flex flex-col">
      <div className="aspect-video w-full bg-muted relative overflow-hidden">
        {issue.image ? (
          <img
            src={issue.image}
            alt={issue.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50 text-muted-foreground">
            <AlertCircle className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className={`${statusColors[issue.status as keyof typeof statusColors]} border-0 shadow-sm capitalize`}>
            {issue.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="text-lg">{categoryIcons[issue.category as keyof typeof categoryIcons] || "📋"}</span>
              <span>{issue.category}</span>
            </div>
            <CardTitle className="text-xl leading-tight mb-1">{issue.title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {issue.description}
        </p>
      </CardContent>

      <CardFooter className="pt-3 border-t bg-muted/20 flex flex-col gap-3">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{issue.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{format(new Date(issue.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </div>

        {canModify && (
          <div className="flex items-center gap-2 w-full pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 bg-background hover:bg-secondary/80 border-border/60"
              onClick={() => onEdit?.(issue)}
            >
              <Edit2 className="w-3.5 h-3.5 mr-2" />
              {isAdmin ? "Manage" : "Edit"}
            </Button>
            {isOwner && (
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                onClick={() => onDelete?.(issue.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
