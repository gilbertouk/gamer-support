"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TicketIcon,
  Plus,
  LogOut,
  User,
  AlertCircle,
  CheckCircle,
  // Clock,
  Skull,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type TicketStatus = "open" | "in-progress" | "resolved" | "ignored";
type ApiTicketStatus = "ABERTO" | "RESOLVIDO" | "IGNORADO";
type ApiTicketUrgency = "SUAVE" | "MODERADO" | "AGORA" | "APAGA_O_SERVIDOR";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  userId: string;
  game: string;
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
}

const statusConfig = {
  open: {
    label: "Aberto",
    icon: AlertCircle,
    color: "bg-accent/10 text-accent border-accent/20",
  },
  // "in-progress": {
  //   label: "Em Progresso",
  //   icon: Clock,
  //   color: "bg-secondary/10 text-secondary border-secondary/20",
  // },
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
  high: { label: "Alta", color: "bg-destructive/20 text-destructive" },
};

// Mapping functions for API data
const mapApiStatusToLocal = (apiStatus: ApiTicketStatus): TicketStatus => {
  const statusMap = {
    ABERTO: "open" as const,
    // EM_PROGRESSO: "in-progress" as const,
    RESOLVIDO: "resolved" as const,
    IGNORADO: "ignored" as const,
  };
  return statusMap[apiStatus] || "open";
};

const mapApiUrgencyToPriority = (
  urgency: ApiTicketUrgency
): "low" | "medium" | "high" => {
  const urgencyMap = {
    SUAVE: "low" as const,
    MODERADO: "medium" as const,
    AGORA: "high" as const,
    APAGA_O_SERVIDOR: "high" as const,
  };
  return urgencyMap[urgency] || "low";
};

const transformApiTicket = (apiTicket: ApiTicket): Ticket => ({
  id: apiTicket.id,
  userId: apiTicket.userId,
  title: apiTicket.title,
  description: apiTicket.description,
  status: mapApiStatusToLocal(apiTicket.status),
  priority: mapApiUrgencyToPriority(apiTicket.urgency),
  createdAt: apiTicket.createdAt,
  updatedAt: apiTicket.updatedAt,
  game: apiTicket.game,
});

export default function DashboardPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTickets = useCallback(async () => {
    try {
      setIsLoadingTickets(true);
      setTicketsError(null);

      const accessToken = localStorage.getItem("accessToken");

      const response = await fetch("http://localhost:5000/api/v1/tickets", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao carregar tickets: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 200 && data.data) {
        const transformedTickets = data.data.map(transformApiTicket);
        setTickets(transformedTickets);
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (error) {
      console.error("Erro ao buscar tickets:", error);
      setTicketsError(
        error instanceof Error ? error.message : "Erro ao carregar tickets"
      );
      toast("Erro ao carregar tickets", {
        description: "Não foi possível carregar seus tickets. Tente novamente.",
      });
    } finally {
      setIsLoadingTickets(false);
    }
  }, []);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Load user
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fetch tickets from API
    fetchTickets();
  }, [router, fetchTickets]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    toast("Logout realizado", {
      description: "Até a próxima, gamer! 👋",
    });
    router.push("/");
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Há alguns minutos";
    if (diffInHours < 24) return `Há ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `Há ${diffInDays}d`;
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <TicketIcon className="w-6 h-6 text-primary glow-primary" />
              <span className="text-xl font-bold">
                Suporte da <span className="text-primary">Galera</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Olá, <span className="text-primary glow-primary">{user.name}</span>!
            👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Aqui estão seus tickets de suporte (ou desespero)
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-accent/20">
            <CardHeader className="pb-3">
              <CardDescription>Abertos</CardDescription>
              <CardTitle className="text-3xl text-accent">
                {stats.open}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-secondary/20">
            <CardHeader className="pb-3">
              <CardDescription>Em Progresso</CardDescription>
              <CardTitle className="text-3xl text-secondary">
                {stats.inProgress}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardDescription>Resolvidos</CardDescription>
              <CardTitle className="text-3xl text-primary">
                {stats.resolved}
              </CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-2xl font-bold">Meus Tickets</h2>
          <Button asChild className="border-glow">
            <Link href="/dashboard/new">
              <Plus className="w-4 h-4 mr-2" />
              Novo Ticket
            </Link>
          </Button>
        </motion.div>

        {/* Tickets List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          {isLoadingTickets ? (
            <Card className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Carregando tickets...</h3>
              <p className="text-muted-foreground">
                Buscando suas reclamações... 🔍
              </p>
            </Card>
          ) : ticketsError ? (
            <Card className="p-12 text-center border-destructive/20">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h3 className="text-xl font-bold mb-2 text-destructive">
                Erro ao carregar tickets
              </h3>
              <p className="text-muted-foreground mb-6">{ticketsError}</p>
              <Button onClick={fetchTickets} variant="outline">
                Tentar novamente
              </Button>
            </Card>
          ) : tickets.length === 0 ? (
            <Card className="p-12 text-center">
              <TicketIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">Nenhum ticket ainda</h3>
              <p className="text-muted-foreground mb-6">
                Crie seu primeiro ticket e comece a reclamar!
              </p>
              <Button asChild>
                <Link href="/dashboard/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Ticket
                </Link>
              </Button>
            </Card>
          ) : (
            tickets.map((ticket, index) => {
              const StatusIcon = statusConfig[ticket.status].icon;
              return (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Link href={`/dashboard/ticket/${ticket.id}`}>
                    <Card className="hover:border-primary/50 transition-all cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold truncate">
                                {ticket.title}
                              </h3>
                              <Badge
                                className={
                                  priorityConfig[ticket.priority].color
                                }
                              >
                                {priorityConfig[ticket.priority].label}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>#{ticket.id}</span>
                              <span>•</span>
                              {ticket.game && (
                                <>
                                  <span>{ticket.game}</span>
                                  <span>•</span>
                                </>
                              )}
                              <span>{getTimeAgo(ticket.createdAt)}</span>
                            </div>
                          </div>
                          <Badge
                            className={`${
                              statusConfig[ticket.status].color
                            } flex items-center gap-1.5 px-3 py-1`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig[ticket.status].label}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Funny Footer Message */}
        {tickets.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-muted-foreground mt-8 italic"
          >
            {stats.open > 3
              ? "Caramba, você reclama muito hein? 😅"
              : stats.resolved === tickets.length
              ? "Uau, todos resolvidos! Milagre! ✨"
              : "Continue abrindo tickets, um dia alguém responde... talvez 🤷"}
          </motion.p>
        )}
      </div>
    </div>
  );
}
