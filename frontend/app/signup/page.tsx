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

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast("Erro!", {
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast("Erro!", {
        description: "As senhas não coincidem. Tenta de novo, campeão! 🎯",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call the signup API
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/sign-up",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar conta");
      }

      // Store user data and token in localStorage
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("accessToken", data.meta.accessToken);
      localStorage.setItem("isAuthenticated", "true");

      toast("Conta criada!", {
        description: "Bem-vindo à galera! Agora pode reclamar à vontade 🎮",
      });

      router.push("/dashboard");
    } catch (error) {
      toast("Erro!", {
        description:
          error instanceof Error
            ? error.message
            : "Erro ao criar conta. Tenta de novo! 😅",
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
        <Card className="border-2 border-secondary/20">
          <CardHeader className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <Gamepad2 className="w-12 h-12 text-secondary glow-secondary" />
            </motion.div>
            <div className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold">
                <span className="glow-secondary text-secondary">
                  Criar Conta
                </span>
              </CardTitle>
              <CardDescription className="text-base">
                Junte-se à galera e comece a reclamar!
              </CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu username"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-muted/50"
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-muted/50"
                />
              </div>

              <p className="text-xs text-muted-foreground italic">
                Ao criar uma conta, você concorda em esperar horas por uma
                resposta 😴
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
                    Criando conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Já tem conta?{" "}
                <Link
                  href="/login"
                  className="text-secondary hover:underline font-semibold"
                >
                  Fazer login
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
          Prometo que não vamos vender seus dados... porque nem temos onde
          guardar 🤷
        </motion.p>
      </motion.div>
    </div>
  );
}
