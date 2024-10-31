"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPaciente, getProntuarioByPatientId } from "@/lib/api";
import { Paciente, Prontuario } from "@/types";
import Image from "next/image";
import { ArrowLeft, Edit, FileText } from "lucide-react";

export default function PatientDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const [patient, setPatient] = useState<Paciente | null>(null);
    const [prontuario, setProntuario] = useState<Prontuario | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchPatientAndProntuario = async () => {
            try {
                const patientData = await getPaciente(params.id);
                setPatient(patientData);
                if (patientData.id) {
                    const prontuarioData = await getProntuarioByPatientId(
                        patientData.id
                    );
                    setProntuario(prontuarioData);
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };
        fetchPatientAndProntuario();
    }, [params.id]);

    if (!patient) {
        return (
            <div className="flex justify-center items-center h-screen">
                Carregando...
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button onClick={() => router.push("/patients")} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Lista de Pacientes
            </Button>
            <h1 className="text-3xl font-bold mb-6">{patient.nome}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle>Informações do Paciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center mb-4">
                            <Image
                                src={patient.imagem_url || "/placeholder.svg"}
                                alt={patient.nome}
                                width={200}
                                height={200}
                                className="rounded-full"
                            />
                        </div>
                        <dl className="space-y-2">
                            <div>
                                <dt className="font-semibold">Gênero:</dt>
                                <dd>{patient.genero}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Raça:</dt>
                                <dd>{patient.raca}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">
                                    Data de Nascimento:
                                </dt>
                                <dd>
                                    {new Date(
                                        patient.data_nascimento
                                    ).toLocaleDateString()}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">
                                    Data de Entrada na Clínica:
                                </dt>
                                <dd>
                                    {new Date(
                                        patient.data_entrada_clinica
                                    ).toLocaleDateString()}
                                </dd>
                            </div>
                        </dl>
                        <Button
                            className="mt-4 w-full"
                            onClick={() =>
                                router.push(`/patients/${patient.id}/edit`)
                            }
                        >
                            <Edit className="mr-2 h-4 w-4" /> Editar Paciente
                        </Button>
                    </CardContent>
                </Card>
                {prontuario ? (
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle>Prontuário Médico</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="font-semibold">
                                        Histórico de Saúde:
                                    </dt>
                                    <dd className="line-clamp-3">
                                        {prontuario.historico_saude}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="font-semibold">
                                        Histórico Nutricional:
                                    </dt>
                                    <dd className="line-clamp-3">
                                        {prontuario.historico_nutricional}
                                    </dd>
                                </div>
                            </dl>
                            <Button
                                className="mt-4 w-full"
                                onClick={() =>
                                    router.push(`/prontuarios/${prontuario.id}`)
                                }
                            >
                                <FileText className="mr-2 h-4 w-4" /> Ver Prontuário Inteiro
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle>Prontuário Médico</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Este paciente ainda não possui um prontuário médico
                                criado.
                            </p>
                            <Button
                                className="mt-4 w-full"
                                onClick={() =>
                                    router.push(
                                        `/prontuarios/create?paciente_id=${patient.id}`
                                    )
                                }
                            >
                                <FileText className="mr-2 h-4 w-4" /> Criar Prontuário
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
