"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Gamepad2,
  Ticket,
  AlertCircle,
  CheckCircle,
  Skull,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="relative">
                <Gamepad2 className="w-20 h-20 text-primary glow-primary" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  className="absolute -inset-4 border-2 border-primary/20 rounded-full"
                />
              </div>
            </motion.div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-balance">
                <span className="glow-primary text-primary">
                  Central de Suporte
                </span>
                <br />
                <span className="text-foreground">da Galera</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Para quando o servidor cair e o admin estiver sumido 😴
              </p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="text-lg px-8 border-glow">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent"
              >
                <Link href="/signup">Criar Conta</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg px-8"
              >
                <Link href="/dashboard">
                  <Ticket className="w-5 h-5 mr-2" />
                  Abrir Ticket
                </Link>
              </Button>
            </motion.div>

            {/* Funny subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground italic"
            >
              Abra um ticket antes que o admin te mute no Discord 🤖
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="glow-secondary text-secondary">
                Como funciona
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Sistema profissional de suporte... ou quase 😅
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Ticket,
                title: "Abra um Ticket",
                description:
                  "Descreva o problema do servidor (ou reclame do lag)",
                color: "text-primary",
                delay: 0.1,
              },
              {
                icon: AlertCircle,
                title: "Aguarde... Muito",
                description:
                  "O admin vai ver isso... eventualmente ou talvez 💤",
                color: "text-secondary",
                delay: 0.2,
              },
              {
                icon: CheckCircle,
                title: "Problema Resolvido?",
                description:
                  "Se der sorte, o servidor volta antes do próximo raid",
                color: "text-accent",
                delay: 0.3,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.6 }}
              >
                <Card className="p-6 h-full hover:border-primary/50 transition-colors">
                  <feature.icon className={`w-12 h-12 mb-4 ${feature.color}`} />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="glow-accent text-accent">
                Status dos Tickets
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Acompanhe o progresso (ou falta dele) 😂
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              {
                status: "Aberto",
                icon: AlertCircle,
                color: "text-accent",
                bgColor: "bg-accent/10",
                count: "12",
              },
              {
                status: "Resolvido",
                icon: CheckCircle,
                color: "text-secondary",
                bgColor: "bg-secondary/10",
                count: "3",
              },
              {
                status: "Ignorado",
                icon: Skull,
                color: "text-destructive",
                bgColor: "bg-destructive/10",
                count: "47",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className={`p-6 text-center ${item.bgColor} border-2`}>
                  <item.icon
                    className={`w-10 h-10 mx-auto mb-3 ${item.color}`}
                  />
                  <h3 className="text-2xl font-bold mb-1">{item.count}</h3>
                  <p className="text-sm text-muted-foreground">{item.status}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">
            Suporte da Galera © 2025 - Feito com 💜 e muito lag
          </p>
          <p className="text-xs mt-2 italic">
            Nenhum admin foi acordado durante a criação deste site
          </p>
        </div>
      </footer>
    </div>
  );
}
