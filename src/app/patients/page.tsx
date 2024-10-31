"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPacientes } from "@/lib/api";
import { Paciente } from "@/types";
import { Search, UserPlus, ArrowLeft } from "lucide-react";

export default function PatientsPage() {
    const [patients, setPatients] = useState<Paciente[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Paciente[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const patientsData = await getPacientes();
                setPatients(patientsData);
                setFilteredPatients(patientsData);
            } catch (error) {
                console.error("Error fetching patients:", error);
            }
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        const filtered = patients.filter((patient) =>
            patient.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPatients(filtered);
    }, [searchTerm, patients]);

    return (
        <div className="container mx-auto px-4 py-8">
            <Button onClick={() => router.push("/")} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Início
            </Button>
            <h1 className="text-3xl font-bold mb-6">Pacientes</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
                <div className="relative w-full sm:w-64">
                    <Input
                        placeholder="Procurar pacientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                    />
                </div>
                <Button onClick={() => router.push("/patients/create")}>
                    <UserPlus className="mr-2 h-5 w-5" />
                    Adicionar Paciente
                </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPatients.map((patient) => (
                    <Card
                        key={patient.id}
                        className="hover:shadow-lg transition-shadow duration-300"
                    >
                        <CardHeader>
                            <CardTitle>{patient.nome}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                <strong>Gênero:</strong> {patient.genero}
                            </p>
                            <p>
                                <strong>Data de Nascimento:</strong>{" "}
                                {new Date(
                                    patient.data_nascimento
                                ).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Data de Entrada na Clínica:</strong>{" "}
                                {new Date(
                                    patient.data_entrada_clinica
                                ).toLocaleDateString()}
                            </p>
                            <Button
                                variant="link"
                                onClick={() =>
                                    router.push(`/patients/${patient.id}`)
                                }
                                className="mt-4 p-0"
                            >
                                Ver detalhes
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
