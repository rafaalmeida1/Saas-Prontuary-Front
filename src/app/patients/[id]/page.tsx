"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonWithLoading } from "@/components/ui/button-with-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deletePaciente, getPaciente, getProntuarioByPatientId } from "@/lib/api";
import { Paciente, Prontuario } from "@/types";
import Image from "next/image";
import { ArrowLeft, Edit, FileText } from "lucide-react";
import { LoadingPage, LoadingCard } from "@/components/ui/loading";
import { imageStorage } from "@/lib/image-storage";
import moment from "moment-timezone";
import { DeleteDialog } from "@/components/delete-dialog";

export default function PatientDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const [patient, setPatient] = useState<Paciente | null>(null);
    const [prontuario, setProntuario] = useState<Prontuario | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [imageSrc, setImageSrc] = useState<string>("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    useEffect(() => {
        const fetchPatientAndProntuario = async () => {
            try {
                const patientData = await getPaciente(params.id);
                setPatient(patientData);
                
                // Tentar buscar imagem do localStorage primeiro
                const storedImage = imageStorage.getImage(params.id);
                
                // Se tiver uma URL de imagem no servidor, usamos ela se não tivermos uma local
                if (patientData.imagem_url && storedImage === imageStorage.defaultImage) {
                    setImageSrc(patientData.imagem_url);
                } else {
                    setImageSrc(storedImage);
                }
                
                if (patientData.id) {
                    try {
                        const prontuarioData = await getProntuarioByPatientId(
                            String(patientData.id)
                        );
                        setProntuario(prontuarioData);
                    } catch (error) {
                        console.error("Erro ao buscar prontuário:", error);
                        // Não falha se o prontuário não existe
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados do paciente:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatientAndProntuario();
    }, [params.id]);

    if (loading) {
        return <LoadingPage text="Carregando dados do paciente..." />;
    }

    if (!patient) {
        return (
            <div className="container mx-auto p-6 text-center">
                <h2 className="text-xl font-semibold mb-4">Paciente não encontrado</h2>
                <p className="text-muted-foreground mb-6">O paciente solicitado não existe ou foi removido.</p>
                <ButtonWithLoading
                    onClick={() => router.push("/patients")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Lista de Pacientes
                </ButtonWithLoading>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="w-full flex items-center justify-between">
                <ButtonWithLoading
                    onClick={() => router.push("/patients")}
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Lista
                    de Pacientes
                </ButtonWithLoading>
                <DeleteDialog
                    id={params.id}
                    deleteFunc={() => deletePaciente(params.id)} 
                    typeReload='patient_single'
                    idHref={params.id}
                />
            </div>
            <h1 className="text-3xl font-bold mb-6">{patient.nome}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle>Informações do Paciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center mb-4">
                            <Image
                                src={imageSrc || "/placeholder.svg"}
                                alt={patient.nome}
                                width={200}
                                height={200}
                                className="rounded-full object-cover"
                            />
                        </div>
                        <dl className="space-y-2">
                            <div>
                                <dt className="font-semibold">Gênero:</dt>
                                <dd>{patient.genero === 'male' ? 'Masculino' : patient.genero === 'female' ? 'Feminino' : 'Outro'}</dd>
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
                                    {moment(patient.data_nascimento)
                                        .tz("America/Sao_Paulo")
                                        .format("DD/MM/YYYY")}
                                </dd>
                            </div>
                            <div>
                                <dt className="font-semibold">
                                    Data de Entrada na Clínica:
                                </dt>
                                <dd>
                                    {moment(patient.data_entrada_clinica)
                                        .tz("America/Sao_Paulo")
                                        .format("DD/MM/YYYY")}
                                </dd>
                            </div>
                        </dl>
                        <ButtonWithLoading
                            className="mt-4 w-full"
                            onClick={() =>
                                router.push(`/patients/${patient.id}/edit`)
                            }
                        >
                            <Edit className="mr-2 h-4 w-4" /> Editar Paciente
                        </ButtonWithLoading>
                    </CardContent>
                </Card>
                {loading ? (
                    <LoadingCard text="Carregando prontuário..." />
                ) : prontuario ? (
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle>Prontuário Nutricional</CardTitle>
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
                            <ButtonWithLoading
                                className="mt-4 w-full"
                                onClick={() =>
                                    router.push(`/prontuarios/${prontuario.id}`)
                                }
                            >
                                <FileText className="mr-2 h-4 w-4" /> Ver
                                Prontuário Inteiro
                            </ButtonWithLoading>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle>Prontuário Nutricional</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>
                                Este paciente ainda não possui um prontuário
                                Nutricional criado.
                            </p>
                            <ButtonWithLoading
                                className="mt-4 w-full"
                                onClick={() =>
                                    router.push(
                                        `/prontuarios/create?paciente_id=${patient.id}`
                                    )
                                }
                            >
                                <FileText className="mr-2 h-4 w-4" /> Criar
                                Prontuário
                            </ButtonWithLoading>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
