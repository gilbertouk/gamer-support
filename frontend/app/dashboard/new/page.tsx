"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, TicketIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/api-config";

export default function NewTicketPage() {
  const [title, setTitle] = useState("");
  const [game, setGame] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<
    "low" | "medium" | "high" | "urgent"
  >("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (!auth) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !description || !game) {
      toast("Por favor, preencha todos os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    try {
      // Get access token
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        throw new Error("Token de acesso não encontrado");
      }

      // Map priority to API urgency format

      const urgencyMap = {
        low: "SUAVE",
        medium: "MODERADO",
        high: "AGORA",
        urgent: "APAGA_O_SERVIDOR",
      } as const;

      // Call the create ticket API
      const response = await fetch(API_CONFIG.ENDPOINTS.TICKETS.CREATE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          game: game,
          description,
          urgency: urgencyMap[priority],
          status: "ABERTO",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar ticket");
      }

      toast("Ticket criado!", {
        description:
          "Seu ticket foi criado. Agora é só esperar... e esperar... 😴",
      });

      router.push("/dashboard");
    } catch (error) {
      toast("Erro!", {
        description:
          error instanceof Error
            ? error.message
            : "Erro ao criar ticket. Tente novamente! 😅",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
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
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Voltar para Dashboard</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center"
              >
                <TicketIcon className="w-12 h-12 text-primary glow-primary" />
              </motion.div>
              <div className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold">
                  <span className="glow-primary text-primary">Novo Ticket</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Descreva seu problema e cruze os dedos para uma resposta 🤞
                </CardDescription>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Ticket</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Ex: Servidor caiu de novo..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Seja direto, o admin não tem paciência 😅
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game">Jogo</Label>
                  <Input
                    id="game"
                    type="text"
                    placeholder="Ex: ARK, Enshrouded, etc."
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                    required
                    className="bg-muted/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Qual jogo está te causando problemas?
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o problema em detalhes... ou só reclame mesmo"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    className="bg-muted/50 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Quanto mais detalhes, melhor (mas não garante resposta mais
                    rápida)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={priority}
                    onValueChange={(
                      value: "low" | "medium" | "high" | "urgent"
                    ) => setPriority(value)}
                  >
                    <SelectTrigger id="priority" className="bg-muted/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                          Baixa - Pode esperar
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-secondary" />
                          Média - Seria bom resolver
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-700" />
                          Alta - URGENTE! (mas vai demorar do mesmo jeito)
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-destructive" />
                          Urgente - APAGA O SERVIDOR!
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground italic">
                    Spoiler: todas as prioridades são tratadas igual...
                    lentamente 🐌
                  </p>
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    type="submit"
                    className="w-full border-glow"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando ticket...
                      </>
                    ) : (
                      <>
                        <TicketIcon className="w-4 h-4 mr-2" />
                        Criar Ticket
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link href="/dashboard">Cancelar</Link>
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-muted-foreground mt-6 italic"
          >
            Dica profissional: Adicionar &quot;URGENTE&quot; no título não
            acelera a resposta 🤡
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
