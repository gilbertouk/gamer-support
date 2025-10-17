"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Loader2,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Skull,
  Send,
  User,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/api-config";

type TicketStatus = "open" | "in-progress" | "resolved" | "ignored";
type ApiTicketStatus = "ABERTO" | "RESOLVIDO" | "IGNORADO" | "EM_PROGRESSO";
type ApiTicketUrgency = "SUAVE" | "MODERADO" | "AGORA" | "APAGA_O_SERVIDOR";

interface Comment {
  id: string;
  text: string;
  author: string;
  isAdmin: boolean;
  createdAt: string;
}

interface ApiComment {
  id: string;
  message: string;
  author: string;
  isAdmin: boolean;
  createdAt: string;
}

interface Ticket {
  id: string;
  userId: string;
  title: string;
  game: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

interface ApiTicket {
  id: string;
  userId: string;
  title: string;
  game: string;
  description: string;
  urgency: ApiTicketUrgency;
  status: ApiTicketStatus;
  createdAt: string;
  updatedAt: string;
  comments: ApiComment[];
}

const statusConfig = {
  open: {
    label: "Aberto",
    icon: AlertCircle,
    color: "bg-accent/10 text-accent border-accent/20",
  },
  "in-progress": {
    label: "Em Progresso",
    icon: Clock,
    color: "bg-secondary/10 text-secondary border-secondary/20",
  },
  resolved: {
    label: "Resolvido",
    icon: CheckCircle,
    color: "bg-primary/10 text-primary border-primary/20",
  },
  ignored: {
    label: "Ignorado",
    icon: Skull,
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const priorityConfig = {
  low: { label: "Baixa", color: "bg-muted text-muted-foreground" },
  medium: { label: "Média", color: "bg-secondary/20 text-secondary" },
  high: { label: "Alta", color: "bg-destructive/20 text-orange-500" },
  urgent: { label: "Urgente", color: "bg-red-600/20 text-destructive" },
};

// Mapping functions for API data
const mapApiStatusToLocal = (apiStatus: ApiTicketStatus): TicketStatus => {
  const statusMap = {
    ABERTO: "open" as const,
    EM_PROGRESSO: "in-progress" as const,
    RESOLVIDO: "resolved" as const,
    IGNORADO: "ignored" as const,
  };
  return statusMap[apiStatus] || "open";
};

const mapApiUrgencyToPriority = (
  urgency: ApiTicketUrgency
): "low" | "medium" | "high" | "urgent" => {
  const urgencyMap = {
    SUAVE: "low" as const,
    MODERADO: "medium" as const,
    AGORA: "high" as const,
    APAGA_O_SERVIDOR: "urgent" as const,
  };
  return urgencyMap[urgency] || "low";
};

const transformApiComment = (apiComment: ApiComment): Comment => ({
  id: apiComment.id,
  text: apiComment.message,
  author: apiComment.author,
  isAdmin: apiComment.isAdmin,
  createdAt: apiComment.createdAt,
});

const transformApiTicket = (apiTicket: ApiTicket): Ticket => ({
  id: apiTicket.id,
  userId: apiTicket.userId,
  title: apiTicket.title,
  game: apiTicket.game,
  description: apiTicket.description,
  status: mapApiStatusToLocal(apiTicket.status),
  priority: mapApiUrgencyToPriority(apiTicket.urgency),
  createdAt: apiTicket.createdAt,
  updatedAt: apiTicket.updatedAt,
  comments: apiTicket.comments.map(transformApiComment),
});

export default function TicketDetailsPage() {
  const params = useParams();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoadingTicket, setIsLoadingTicket] = useState(true);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    username?: string;
    role?: string;
  } | null>(null);
  const router = useRouter();

  const fetchTicket = useCallback(async () => {
    try {
      setIsLoadingTicket(true);
      setTicketError(null);

      const response = await fetch(
        API_CONFIG.ENDPOINTS.TICKETS.BY_ID(ticketId)
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Ticket não encontrado");
        }
        throw new Error(`Erro ao carregar ticket: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 200 && data.data) {
        const transformedTicket = transformApiTicket(data.data);
        setTicket(transformedTicket);
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (error) {
      console.error("Erro ao buscar ticket:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar ticket";
      setTicketError(errorMessage);

      toast("Erro ao carregar ticket", {
        description: errorMessage,
      });

      // If ticket not found, redirect to dashboard
      if (errorMessage.includes("não encontrado")) {
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } finally {
      setIsLoadingTicket(false);
    }
  }, [ticketId, router]);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);

    // Load user
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch ticket from API
    fetchTicket();
  }, [ticketId, router, fetchTicket]);

  const handleStatusChange = (status: string) => {
    console.log(status);
    return;
    // if (!ticket) return;

    // const updatedTicket = {
    //   ...ticket,
    //   status: newStatus,
    //   updatedAt: new Date().toISOString(),
    // };

    // // Update in localStorage
    // const storedTickets = localStorage.getItem("tickets");
    // if (storedTickets) {
    //   const tickets: Ticket[] = JSON.parse(storedTickets);
    //   const index = tickets.findIndex((t) => t.id === ticketId);
    //   if (index !== -1) {
    //     tickets[index] = updatedTicket;
    //     localStorage.setItem("tickets", JSON.stringify(tickets));
    //     setTicket(updatedTicket);

    //     toast("Status atualizado!", {
    //       description: `Ticket marcado como: ${statusConfig[newStatus].label}`,
    //     });
    //   }
    // }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !ticket || !user) return;

    setIsSubmitting(true);

    try {
      // Get access token
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Token de acesso não encontrado");
      }

      // Call the add comment API
      const response = await fetch(
        API_CONFIG.ENDPOINTS.TICKETS.ADD_COMMENT(ticketId),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: newComment.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao adicionar comentário");
      }

      // Create the comment object from API response
      const newCommentObj: Comment = {
        id: data.data.id,
        text: data.data.message,
        author: user.username || user.name || "Usuário",
        isAdmin: user.role === "ADMIN",
        createdAt: data.data.createdAt,
      };

      // Update ticket state with new comment
      const updatedTicket = {
        ...ticket,
        comments: [...(ticket.comments || []), newCommentObj],
        updatedAt: new Date().toISOString(),
      };

      setTicket(updatedTicket);
      setNewComment("");

      toast("Comentário adicionado!", {
        description: "Seu comentário foi adicionado ao ticket.",
      });
    } catch (error) {
      toast("Erro!", {
        description:
          error instanceof Error
            ? error.message
            : "Erro ao adicionar comentário. Tente novamente! 😅",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Agora mesmo";
    if (diffInMinutes < 60) return `Há ${diffInMinutes}min`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Há ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Há ${diffInDays}d`;
  };

  if (!isAuthenticated || isLoadingTicket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando ticket...</p>
        </div>
      </div>
    );
  }

  if (ticketError || !ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h3 className="text-xl font-bold mb-2 text-destructive">
            {ticketError || "Ticket não encontrado"}
          </h3>
          <p className="text-muted-foreground mb-6">
            Este ticket não existe ou não pode ser carregado.
          </p>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Voltar para Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[ticket.status].icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Voltar para Dashboard</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Ticket Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-6">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <Badge className={priorityConfig[ticket.priority].color}>
                      {priorityConfig[ticket.priority].label}
                    </Badge>
                    {ticket.game && (
                      <Badge variant="outline" className="text-xs">
                        {ticket.game}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      #{ticket.id}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {ticket.title}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Criado {getTimeAgo(ticket.createdAt)}
                  </p>
                </div>
                <Badge
                  className={`${
                    statusConfig[ticket.status].color
                  } flex items-center gap-1.5 px-3 py-1.5`}
                >
                  <StatusIcon className="w-4 h-4" />
                  {statusConfig[ticket.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  Descrição
                </h3>
                <p className="text-foreground leading-relaxed">
                  {ticket.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Alterar Status
                </h3>
                <Select
                  value={ticket.status}
                  disabled={true}
                  onValueChange={(value: TicketStatus) =>
                    handleStatusChange(value)
                  }
                >
                  <SelectTrigger className="w-full md:w-64 bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-accent" />
                        Aberto
                      </div>
                    </SelectItem>
                    <SelectItem value="in-progress">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-secondary" />
                        Em Progresso
                      </div>
                    </SelectItem>
                    <SelectItem value="resolved">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Resolvido
                      </div>
                    </SelectItem>
                    <SelectItem value="ignored">
                      <div className="flex items-center gap-2">
                        <Skull className="w-4 h-4 text-destructive" />
                        Ignorado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Marcar como &quot;Ignorado&quot; é a especialidade do admin 😅
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">
                  Comentários{" "}
                  <span className="text-muted-foreground">
                    ({ticket.comments?.length || 0})
                  </span>
                </h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Comments List */}
              {ticket.comments && ticket.comments.length > 0 ? (
                <div className="space-y-4">
                  {ticket.comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      className={`p-4 rounded-lg border ${
                        comment.isAdmin
                          ? "bg-primary/5 border-primary/20"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            comment.isAdmin ? "bg-primary/20" : "bg-muted"
                          }`}
                        >
                          {comment.isAdmin ? (
                            <Shield className="w-4 h-4 text-primary" />
                          ) : (
                            <User className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {comment.author}
                            </span>
                            {comment.isAdmin && (
                              <Badge
                                variant="outline"
                                className="text-xs border-primary/30 text-primary"
                              >
                                Admin
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {getTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Nenhum comentário ainda
                  </p>
                  <p className="text-sm text-muted-foreground italic mt-1">
                    Seja o primeiro a comentar!
                  </p>
                </div>
              )}

              {/* Add Comment Form */}
              <form
                onSubmit={handleAddComment}
                className="pt-4 border-t border-border"
              >
                <div className="space-y-3">
                  <Textarea
                    placeholder="Adicione um comentário... ou mais uma reclamação 😅"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="bg-muted/50 resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !newComment.trim()}
                      className="border-glow"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Comentário
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Funny Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-6 italic"
        >
          {ticket.comments && ticket.comments.length > 5
            ? "Nossa, que conversa animada! Pena que o admin não tá vendo 👀"
            : "Dica: Comentar várias vezes não acelera a resposta... mas pode ajudar a desabafar 🤷"}
        </motion.p>
      </div>
    </div>
  );
}
