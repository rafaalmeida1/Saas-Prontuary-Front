"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonWithLoading } from "@/components/ui/button-with-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    getProntuario,
    getAcompanhamentosByProntuario,
    deleteProntuario,
} from "@/lib/api";
import { Prontuario, Acompanhamento } from "@/types";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import { LoadingPage, LoadingCard } from "@/components/ui/loading";
import moment from "moment-timezone";
import { DeleteDialog } from "@/components/delete-dialog";

export default function ProntuarioDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const [prontuario, setProntuario] = useState<Prontuario | null>(null);
    const [acompanhamentos, setAcompanhamentos] = useState<Acompanhamento[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProntuarioAndAcompanhamentos = async () => {
            try {
                const prontuarioData = await getProntuario(params.id);
                setProntuario(prontuarioData);
                const acompanhamentosData =
                    await getAcompanhamentosByProntuario(params.id);
                setAcompanhamentos(acompanhamentosData);
            } catch (error) {
                console.error("Error fetching medical record data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProntuarioAndAcompanhamentos();
    }, [params.id]);

    if (loading) {
        return <LoadingPage />;
    }

    if (!prontuario) {
        return <div>Prontuário não encontrado</div>;
    }

    const renderCard = (title: string, fields: string[]) => (
        <Card className="mb-4 max-w-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-1 gap-2">
                    {fields.map((field) => (
                        <div key={field} className="border-b pb-1">
                            <dt className="font-semibold text-sm text-gray-600">
                                {field
                                    .replace(/_/g, " ")
                                    .charAt(0)
                                    .toUpperCase() +
                                    field.replace(/_/g, " ").slice(1)}
                                :
                            </dt>
                            <dd className="mt-1 text-sm">
                                {typeof prontuario[
                                    field as keyof Prontuario
                                ] === "boolean"
                                    ? prontuario[field as keyof Prontuario]
                                        ? "Yes"
                                        : "No"
                                    : prontuario[field as keyof Prontuario]}
                            </dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    );

    return (
        <div className="max-w-full mx-auto px-2 py-6">
            <div className="flex items-center justify-between w-full">
                <ButtonWithLoading
                    onClick={() =>
                        router.push(`/patients/${prontuario.paciente_id}`)
                    }
                    className="mb-4 text-sm"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Voltar para o
                    Paciente
                </ButtonWithLoading>

                <DeleteDialog
                    id={prontuario.id}
                    deleteFunc={() => deleteProntuario(prontuario.id)}
                    open={false}
                    onOpenChange={() => {}}
                />
            </div>
            <h1 className="text-2xl font-bold mb-4">Detalhes do Prontuário</h1>
            <div className="grid grid-cols-1 gap-4">
                {renderCard("Informação Geral", [
                    "historico_saude",
                    "historico_nutricional",
                    "observacoes",
                ])}
                {renderCard("Avaliação Nutricional", [
                    "nivel_assistencia_nutricao",
                    "classificacao_apetite",
                    "ingestao_alimentar",
                    "tipo_dieta_atual",
                ])}
                {renderCard("Condição física", [
                    "condicao_fisica",
                    "presenca_edema",
                    "localizacao_edema",
                    "avaliacao_subjetiva",
                    "apresenta_lipodistrofia",
                    "localizacao_lipodistrofia",
                ])}
                {renderCard("Hábitos", [
                    "frequencia_defecacao",
                    "caracteristicas_fezes",
                    "frequencia_miccao",
                    "caracteristicas_urina",
                    "qualidade_sono",
                    "hora_dormir",
                    "hora_acordar",
                ])}
                {renderCard("Estado de saúde", [
                    "sinais_e_sintomas",
                    "historico_atual_patologias",
                    "medicacoes_atuais",
                    "dificuldade_engolir",
                ])}
                {renderCard("Informações sobre dieta", [
                    "alimentos_preferidos",
                    "alimentos_menos_preferidos",
                    "alergias",
                    "alergia_detalhes",
                ])}
                {renderCard("Avaliação", [
                    "queixas_reclamacoes",
                    "periodo_avaliacao",
                    "mes",
                    "evolucao_dietoterapica",
                    "alteracoes_patologicas_farmacologicas",
                    "tipo_prescricao",
                    "prescricao_detalhada",
                ])}
            </div>
            <Card className="mt-4 max-w-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-lg">Acompanhamentos</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <LoadingCard />
                    ) : acompanhamentos.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table className="table-auto min-w-full text-sm">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Pesos (R/L)
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Alturas (R/L)
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            BMI (R/L)
                                        </TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Ações
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {acompanhamentos.map((acompanhamento) => (
                                        <TableRow key={acompanhamento.id}>
                                            <TableCell>
                                                {moment(acompanhamento.data)
                                                    .tz("America/Sao_Paulo")
                                                    .format("DD/MM/YYYY")}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {acompanhamento.peso_direito} /{" "}
                                                {acompanhamento.peso_esquerdo}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {acompanhamento.altura_direita}{" "}
                                                /{" "}
                                                {acompanhamento.altura_esquerda}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {acompanhamento.imc_direito} /{" "}
                                                {acompanhamento.imc_esquerdo}
                                            </TableCell>
                                            <TableCell>
                                                <ButtonWithLoading
                                                    variant="link"
                                                    onClick={() =>
                                                        router.push(
                                                            `/acompanhamentos/${acompanhamento.id}`
                                                        )
                                                    }
                                                >
                                                    View Details
                                                </ButtonWithLoading>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <p className="text-sm">
                            Essa ficha não possui acompanhamentos.
                        </p>
                    )}
                    <ButtonWithLoading
                        className="mt-2 text-sm"
                        onClick={() =>
                            router.push(
                                `/acompanhamentos/create?prontuario_id=${prontuario.id}`
                            )
                        }
                    >
                        <Plus className="mr-1 h-4 w-4" /> Adicionar
                        Acompanhamento
                    </ButtonWithLoading>
                </CardContent>
            </Card>
            <ButtonWithLoading
                className="mt-4 text-sm"
                onClick={() =>
                    router.push(`/prontuarios/${prontuario.id}/edit`)
                }
            >
                <Edit className="mr-1 h-4 w-4" /> Editar Prontuário
            </ButtonWithLoading>
        </div>
    );
}
