"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Prontuario, Paciente, Acompanhamento } from '@/types';
import { getProntuarios, getPacientes, getAcompanhamentosByProntuario } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Search, Stethoscope, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { toastService } from '@/lib/toast-service';
import { formatDate } from '@/lib/utils';

interface AcompanhamentoWithPatient extends Acompanhamento {
  pacienteNome?: string;
  dataConsulta?: string;
}

export default function AcompanhamentosPage() {
    const router = useRouter();
    const [acompanhamentos, setAcompanhamentos] = useState<AcompanhamentoWithPatient[]>([]);
    const [filteredAcompanhamentos, setFilteredAcompanhamentos] = useState<AcompanhamentoWithPatient[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [pacientesMap, setPacientesMap] = useState<Record<string, Paciente>>({});
    const [prontuariosMap, setProntuariosMap] = useState<Record<string, Prontuario>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Carregar pacientes e prontuários
                const pacientesData = await getPacientes();
                const prontuariosData = await getProntuarios();
                
                // Criar mapas para busca rápida por ID
                const pacientesMapObj: Record<string, Paciente> = {};
                pacientesData.forEach(paciente => {
                    pacientesMapObj[paciente.id as string] = paciente;
                });
                
                const prontuariosMapObj: Record<string, Prontuario> = {};
                const allAcompanhamentos: AcompanhamentoWithPatient[] = [];
                
                // Para cada prontuário, buscar seus acompanhamentos
                for (const prontuario of prontuariosData) {
                    prontuariosMapObj[prontuario.id] = prontuario;
                    
                    try {
                        const acompanhamentosData = await getAcompanhamentosByProntuario(prontuario.id);
                        
                        // Adicionar informações do paciente a cada acompanhamento
                        const acompanhamentosWithPatient = acompanhamentosData.map(acomp => {
                            const paciente = pacientesMapObj[prontuario.paciente_id];
                            return {
                                ...acomp,
                                pacienteNome: paciente?.nome || 'Paciente não encontrado',
                                dataConsulta: acomp.data_consulta || new Date().toISOString()
                            };
                        });
                        
                        allAcompanhamentos.push(...acompanhamentosWithPatient);
                    } catch (error) {
                        console.error(`Erro ao buscar acompanhamentos para prontuário ${prontuario.id}:`, error);
                    }
                }
                
                // Ordenar acompanhamentos por data (mais recentes primeiro)
                const sortedAcompanhamentos = allAcompanhamentos.sort((a, b) => {
                    return new Date(b.dataConsulta!).getTime() - new Date(a.dataConsulta!).getTime();
                });
                
                setPacientesMap(pacientesMapObj);
                setProntuariosMap(prontuariosMapObj);
                setAcompanhamentos(sortedAcompanhamentos);
                setFilteredAcompanhamentos(sortedAcompanhamentos);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                toastService.handleError(error, 'Falha ao carregar acompanhamentos');
                setAcompanhamentos([]);
                setFilteredAcompanhamentos([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredAcompanhamentos(acompanhamentos);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = acompanhamentos.filter(acomp => {
                return (
                    (acomp.pacienteNome && acomp.pacienteNome.toLowerCase().includes(query)) ||
                    acomp.id.toString().includes(query) ||
                    (acomp.dataConsulta && new Date(acomp.dataConsulta).toLocaleDateString('pt-BR').includes(query))
                );
            });
            setFilteredAcompanhamentos(filtered);
        }
    }, [searchQuery, acompanhamentos]);

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-4 sm:mb-0">Acompanhamentos</h1>
                <Link href="/acompanhamentos/create">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Novo Acompanhamento
                    </Button>
                </Link>
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle>Buscar Acompanhamentos</CardTitle>
                    <CardDescription>
                        Pesquise pelo nome do paciente, data ou identificador
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Digite sua busca..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="flex items-center p-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="ml-4 space-y-2 flex-1">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAcompanhamentos.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                                <Stethoscope className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">Nenhum acompanhamento encontrado</h3>
                                <p className="text-muted-foreground text-center max-w-md mt-2">
                                    {searchQuery 
                                        ? `Não encontramos nenhum acompanhamento para "${searchQuery}".` 
                                        : 'Não existem acompanhamentos cadastrados no sistema.'}
                                </p>
                                <Link href="/acompanhamentos/create" className="mt-4">
                                    <Button>
                                        <PlusCircle className="h-4 w-4 mr-2" />
                                        Criar Acompanhamento
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredAcompanhamentos.map((acomp) => (
                            <Card 
                                key={acomp.id} 
                                className="overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => router.push(`/acompanhamentos/${acomp.id}`)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex items-center p-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                            <Calendar className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <h3 className="text-lg font-medium">{acomp.pacienteNome}</h3>
                                                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                                    <Badge variant="outline">ID: {acomp.id}</Badge>
                                                    <Badge variant="secondary">{formatDate(acomp.dataConsulta || '')}</Badge>
                                                </div>
                                            </div>
                                            <div className="mt-1 text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-4">
                                                <span>Peso: {acomp.peso ? `${acomp.peso} kg` : 'Não informado'}</span>
                                                <span>IMC: {acomp.imc ? acomp.imc.toFixed(2) : 'Não calculado'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    );
} 