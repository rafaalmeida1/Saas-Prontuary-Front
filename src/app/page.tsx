"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { 
  BarChart3, 
  Users, 
  UserPlus, 
  ClipboardList, 
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ChevronRight,
  UserCheck,
  ScrollText,
  Activity
} from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useEffect, useState } from "react";
import { 
  getPacientes, 
  getProntuarios,
  getAcompanhamentoStats
} from "@/lib/api";
import { Paciente, Prontuario } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toastService } from "@/lib/toast-service";
import { formatDate } from "@/lib/utils";

// Interface para as estatísticas
interface DashboardStats {
  pacientes: number;
  prontuarios: number;
  acompanhamentos: number;
  novosPacientes: number;
  pacientesAtivos: number;
  ultimaConsulta: string | null;
}

// Interface para os pacientes recentes
interface PacienteRecente {
  id: string | number;
  nome: string;
  data_entrada_clinica: string;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pacientesRecentes, setPacientesRecentes] = useState<PacienteRecente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Tentar buscar dados da API real
        let pacientes: Paciente[] = [];
        let prontuarios: Prontuario[] = [];
        let acompanhamentosStats: { 
          total: number; 
          ultimaConsulta: string | null; 
          porMes: Record<string, number> 
        } | null = null;
        
        try {
          pacientes = await getPacientes();
        } catch (error) {
          console.error("Erro ao buscar pacientes:", error);
          pacientes = [];
        }
        
        try {
          prontuarios = await getProntuarios();
        } catch (error) {
          console.error("Erro ao buscar prontuários:", error);
          prontuarios = [];
        }
        
        try {
          acompanhamentosStats = await getAcompanhamentoStats();
        } catch (error) {
          console.error("Erro ao buscar estatísticas de acompanhamento:", error);
          acompanhamentosStats = {
            total: 0,
            ultimaConsulta: null,
            porMes: {}
          };
        }
        
        // Calcular pacientes com prontuários (pacientes ativos)
        const pacientesAtivos = prontuarios ? prontuarios.length : 0;
        
        // Calcular novos pacientes (últimos 30 dias)
        const hoje = new Date();
        const trintaDiasAtras = new Date(hoje);
        trintaDiasAtras.setDate(hoje.getDate() - 30);
        
        const novosPacientes = pacientes.filter(paciente => {
          const dataEntrada = new Date(paciente.data_entrada_clinica);
          return dataEntrada >= trintaDiasAtras;
        }).length;
        
        // Encontrar a data da última consulta
        const ultimaConsulta = acompanhamentosStats && acompanhamentosStats.ultimaConsulta 
          ? acompanhamentosStats.ultimaConsulta
          : null;
        
        // Definir estatísticas para o dashboard
        setStats({
          pacientes: pacientes.length,
          prontuarios: prontuarios ? prontuarios.length : 0,
          acompanhamentos: acompanhamentosStats ? acompanhamentosStats.total : 0,
          novosPacientes,
          pacientesAtivos,
          ultimaConsulta
        });
        
        // Ordenar pacientes por data de entrada (mais recentes primeiro)
        const pacientesOrdenados = [...pacientes].sort((a, b) => {
          return new Date(b.data_entrada_clinica).getTime() - new Date(a.data_entrada_clinica).getTime();
        });
        
        // Mapear para o tipo correto e pegar apenas os 5 mais recentes
        const pacientesRecentes: PacienteRecente[] = pacientesOrdenados
          .filter(p => p.id !== undefined) // Garantir que todos têm IDs
          .map(p => ({
            id: p.id as string | number,
            nome: p.nome,
            data_entrada_clinica: p.data_entrada_clinica
          }))
          .slice(0, 5);
        
        setPacientesRecentes(pacientesRecentes);
        
      } catch (error) {
        toastService.handleError(error, "Não foi possível carregar os dados do dashboard");
        // Definir dados fictícios para não quebrar a interface
        setStats({
          pacientes: 0,
          prontuarios: 0,
          acompanhamentos: 0,
          novosPacientes: 0,
          pacientesAtivos: 0,
          ultimaConsulta: null
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <section>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Bem-vindo ao Sistema de Gerenciamento Nutricional Esperança e Vida.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Pacientes"
              value={isLoading ? null : stats?.pacientes ?? 0}
              description="Total de pacientes cadastrados"
              icon={<Users className="h-5 w-5" />}
              trend={isLoading ? null : `+${stats?.novosPacientes} nos últimos 30 dias`}
              trendUp={true}
            />
            
            <StatCard 
              title="Prontuários"
              value={isLoading ? null : stats?.prontuarios ?? 0}
              description="Prontuários ativos"
              icon={<ClipboardList className="h-5 w-5" />}
              trend={isLoading && stats ? `${Math.round((stats.prontuarios / stats.pacientes) * 100)}% dos pacientes` : null}
            />
            
            <StatCard 
              title="Pacientes Ativos"
              value={isLoading ? null : stats?.pacientesAtivos ?? 0}
              description="Pacientes em atendimento"
              icon={<UserCheck className="h-5 w-5" />}
              trend={stats?.pacientesAtivos && stats?.pacientes ? `${Math.round((stats.pacientesAtivos / stats.pacientes) * 100)}% do total` : null}
            />
            
            <StatCard 
              title="Acompanhamentos"
              value={isLoading ? null : stats?.acompanhamentos ?? 0}
              description="Registros de acompanhamento"
              icon={<Activity className="h-5 w-5" />}
              trend={stats?.ultimaConsulta ? `Última: ${formatDate(stats.ultimaConsulta)}` : null}
            />
          </div>
        </section>
        
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Ações Rápidas</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              title="Cadastrar Paciente"
              description="Registre um novo paciente no sistema"
              icon={<UserPlus className="h-6 w-6" />}
              href="/patients/create"
              iconColor="text-primary"
            />
            
            <ActionCard
              title="Ver Pacientes"
              description="Gerencie a lista de pacientes cadastrados"
              icon={<Users className="h-6 w-6" />}
              href="/patients"
              iconColor="text-blue-500"
            />
            
            <ActionCard
              title="Novo Prontuário"
              description="Crie um novo prontuário para um paciente"
              icon={<ScrollText className="h-6 w-6" />}
              href="/prontuarios/create"
              iconColor="text-purple-500"
            />
          </div>
        </section>
        
        <section className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Pacientes Recentes</h2>
            <Link href="/patients">
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todos <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Últimos Cadastros</CardTitle>
              <CardDescription>Pacientes recentemente registrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Nome
                          </th>
                          <th className="h-12 px-4 text-left align-middle font-medium">
                            Data de Entrada
                          </th>
                          <th className="h-12 px-4 text-right align-middle font-medium">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pacientesRecentes.length > 0 ? (
                          pacientesRecentes.map((paciente) => (
                            <tr key={paciente.id} className="border-b">
                              <td className="p-4 align-middle">{paciente.nome}</td>
                              <td className="p-4 align-middle">{formatDate(paciente.data_entrada_clinica)}</td>
                              <td className="p-4 align-middle text-right">
                                <Link href={`/patients/${paciente.id}`}>
                                  <Button variant="ghost" size="sm">Ver</Button>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="p-4 align-middle text-center" colSpan={3}>
                              Nenhum paciente cadastrado
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Link href="/patients">
                <Button variant="outline" size="sm">
                  Gerenciar Pacientes
                </Button>
              </Link>
              <Link href="/patients/create">
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar Paciente
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
      </div>
    </ErrorBoundary>
  );
}

interface StatCardProps {
  title: string;
  value: number | null;
  description: string;
  icon: React.ReactNode;
  trend?: string | null;
  trendUp?: boolean;
}

function StatCard({ title, value, description, icon, trend, trendUp }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${trendUp ? 'text-green-500' : 'text-muted-foreground'}`}>
            {trendUp ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : null}
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  iconColor?: string;
}

function ActionCard({ title, description, icon, href, iconColor = "text-primary" }: ActionCardProps) {
  return (
    <Link href={href}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <CardDescription className="mt-1.5">{description}</CardDescription>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 ${iconColor}`}>
              {icon}
            </div>
          </div>
        </CardHeader>
        <CardFooter className="pt-2 pb-4">
          <div className="flex items-center text-sm text-primary font-medium">
            Acessar
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}