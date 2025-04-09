"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paciente, Prontuario } from '@/types';
import { getProntuarios, getPacientes } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { FilePlus, Search, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { toastService } from '@/lib/toast-service';
import { formatDate } from '@/lib/utils';

export default function ProntuariosPage() {
    const router = useRouter();
    const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
    const [filteredProntuarios, setFilteredProntuarios] = useState<Prontuario[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [pacientesMap, setPacientesMap] = useState<Record<string, Paciente>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Carregar pacientes e prontuários
                const pacientesData = await getPacientes();
                const prontuariosData = await getProntuarios();
                
                // Criar mapa de pacientes para busca rápida por ID
                const pacientesMapObj: Record<string, Paciente> = {};
                pacientesData.forEach(paciente => {
                    pacientesMapObj[paciente.id as string] = paciente;
                });
                
                setPacientesMap(pacientesMapObj);
                setProntuarios(prontuariosData);
                setFilteredProntuarios(prontuariosData);
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                toastService.handleError(error, 'Falha ao carregar prontuários');
                setProntuarios([]);
                setFilteredProntuarios([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProntuarios(prontuarios);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = prontuarios.filter(prontuario => {
                const paciente = pacientesMap[prontuario.paciente_id];
                if (!paciente) return false;
                
                return paciente.nome.toLowerCase().includes(query) || 
                       prontuario.id.toString().includes(query);
            });
            setFilteredProntuarios(filtered);
        }
    }, [searchQuery, prontuarios, pacientesMap]);

    // Get patient name from ID
    const getPatientName = (patientId: string): string => {
        const paciente = pacientesMap[patientId];
        return paciente ? paciente.nome : 'Paciente não encontrado';
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-4 sm:mb-0">Prontuários</h1>
                <Link href="/prontuarios/create">
                    <Button>
                        <FilePlus className="h-4 w-4 mr-2" />
                        Novo Prontuário
                    </Button>
                </Link>
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle>Buscar Prontuários</CardTitle>
                    <CardDescription>
                        Pesquise pelo nome do paciente ou identificador do prontuário
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
                    {filteredProntuarios.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">Nenhum prontuário encontrado</h3>
                                <p className="text-muted-foreground text-center max-w-md mt-2">
                                    {searchQuery 
                                        ? `Não encontramos nenhum prontuário para "${searchQuery}".` 
                                        : 'Não existem prontuários cadastrados no sistema.'}
                                </p>
                                <Link href="/prontuarios/create" className="mt-4">
                                    <Button>
                                        <FilePlus className="h-4 w-4 mr-2" />
                                        Criar Prontuário
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredProntuarios.map((prontuario) => (
                            <Card 
                                key={prontuario.id} 
                                className="overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => router.push(`/prontuarios/${prontuario.id}`)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex items-center p-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <h3 className="text-lg font-medium">{getPatientName(prontuario.paciente_id)}</h3>
                                                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                                    <Badge variant="outline">ID: {prontuario.id}</Badge>
                                                    <Badge variant="secondary">{prontuario.nivel_assistencia_nutricao || 'Não definido'}</Badge>
                                                </div>
                                            </div>
                                            <div className="mt-1 text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-4">
                                                <span>Condição física: {prontuario.condicao_fisica || 'Não informada'}</span>
                                                <span>Última atualização: {formatDate(prontuario.updated_at || new Date().toISOString())}</span>
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