"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Paciente } from '@/types';
import { getPacientes } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { handleError } from '@/lib/toast-service';

export default function PatientsPage() {
    const router = useRouter();
    const [patients, setPatients] = useState<Paciente[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Paciente[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPacientes();
                setPatients(data);
                setFilteredPatients(data);
            } catch (error) {
                console.error('Error fetching patients:', error);
                handleError(error, 'Falha ao carregar pacientes');
                // Initialize with empty arrays on error
                setPatients([]);
                setFilteredPatients([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, []);

    // Handle search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = patients.filter(patient => 
                patient.nome.toLowerCase().includes(query)
            );
            setFilteredPatients(filtered);
        }
    }, [searchQuery, patients]);

    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        if (!name) return 'P';
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    };

    // Calculate age based on birth date
    const calculateAge = (birthDate: string) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} anos`;
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-4 sm:mb-0">Pacientes</h1>
                <Link href="/patients/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Paciente
                    </Button>
                </Link>
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle>Buscar Pacientes</CardTitle>
                    <CardDescription>
                        Pesquise pelo nome do paciente
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar paciente por nome..."
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
                    {filteredPatients.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-8">
                                <UserRound className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium">Nenhum paciente encontrado</h3>
                                <p className="text-muted-foreground text-center max-w-md mt-2">
                                    {searchQuery 
                                        ? `Não encontramos nenhum paciente com o nome "${searchQuery}".` 
                                        : 'Não existem pacientes cadastrados no sistema.'}
                                </p>
                                <Link href="/patients/create" className="mt-4">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Cadastrar Paciente
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredPatients.map((patient) => (
                            <Card 
                                key={patient.id} 
                                className="overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => router.push(`/patients/${patient.id}`)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex items-center p-4">
                                        <Avatar className="h-14 w-14">
                                            <AvatarImage src={patient.imagem_url || ''} alt={patient.nome} />
                                            <AvatarFallback>{getInitials(patient.nome)}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                <h3 className="text-lg font-medium">{patient.nome}</h3>
                                                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                                                    <Badge variant="outline">{calculateAge(patient.data_nascimento)}</Badge>
                                                    <Badge variant="secondary">{patient.genero}</Badge>
                                                </div>
                                            </div>
                                            <div className="mt-1 text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-4">
                                                <span>Raça: {patient.raca || 'Não informada'}</span>
                                                <span>Entrada: {formatDate(patient.data_entrada_clinica)}</span>
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
