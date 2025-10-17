"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gamepad2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { API_CONFIG } from "@/lib/api-config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the sign-in API
      const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.SIGN_IN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      // Store user data and token in localStorage
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("accessToken", data.meta.accessToken);
      localStorage.setItem("isAuthenticated", "true");

      toast("Login realizado!", {
        description: "Bem-vindo de volta, gamer! 🎮",
      });

      router.push("/dashboard");
    } catch (error) {
      toast("Erro!", {
        description: error instanceof Error ? error.message : "Erro ao fazer login. Tente novamente! 😅",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 border-primary/20">
          <CardHeader className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <Gamepad2 className="w-12 h-12 text-primary glow-primary" />
            </motion.div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold">
                <span className="glow-primary text-primary">Login</span>
              </CardTitle>
              <CardDescription className="text-base">
                Entre para abrir tickets e reclamar do lag
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-muted/50"
                />
              </div>

              <p className="text-xs text-muted-foreground italic">
                Esqueceu a senha? Boa sorte, o admin não responde emails 😅
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full border-glow"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Não tem conta?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:underline font-semibold"
                >
                  Criar conta
                </Link>
              </div>

              <Link
                href="/"
                className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Voltar para home
              </Link>
            </CardFooter>
          </form>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-4 italic"
        >
          Dica: qualquer email e senha funcionam... é só pra zoar mesmo 🤡
        </motion.p>
      </motion.div>
    </div>
  );
}
