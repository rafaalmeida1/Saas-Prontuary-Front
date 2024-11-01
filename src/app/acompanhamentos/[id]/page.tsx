"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonWithLoading } from "@/components/ui/button-with-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteAcompanhamento, getAcompanhamento } from "@/lib/api";
import { Acompanhamento } from "@/types";
import { ArrowLeft, Edit } from "lucide-react";
import { LoadingPage } from "@/components/ui/loading";
import { DeleteDialog } from "@/components/delete-dialog";

export default function AcompanhamentoPage({
    params,
}: {
    params: { id: string };
}) {
    const [acompanhamento, setAcompanhamento] = useState<Acompanhamento | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, []);

    useEffect(() => {
        const fetchAcompanhamento = async () => {
            try {
                const acompanhamentoData = await getAcompanhamento(params.id);
                setAcompanhamento(acompanhamentoData);
            } catch (error) {
                console.error("Error fetching follow-up data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAcompanhamento();
    }, [params.id]);

    if (loading) {
        return <LoadingPage />;
    }

    if (!acompanhamento) {
        return <div>Acompanhamento não encontrado</div>;
    }

    const renderCard = (title: string, fields: string[]) => (
        <Card className="mb-6 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map((field) => (
                        <div key={field} className="border-b pb-2">
                            <dt className="font-semibold text-sm text-gray-600">
                                {field
                                    .replace(/_/g, " ")
                                    .charAt(0)
                                    .toUpperCase() +
                                    field.replace(/_/g, " ").slice(1)}
                                :
                            </dt>
                            <dd className="mt-1">
                                {acompanhamento[field as keyof Acompanhamento]}
                            </dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="w-full flex items-center justify-between">
                <ButtonWithLoading
                    onClick={() =>
                        router.push(
                            `/prontuarios/${acompanhamento.prontuario_id}`
                        )
                    }
                    className="mb-6"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o
                    Prontuário
                </ButtonWithLoading>

                <DeleteDialog
                    id={acompanhamento.id}
                    deleteFunc={() =>
                        deleteAcompanhamento(String(acompanhamento.id))
                    }
                    typeReload="acompanhamento_single"
                    idHref={acompanhamento.prontuario_id}
                />
            </div>
            <h1 className="text-3xl font-bold mb-6">
                Detalhes do Acompanhamento
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    {renderCard("Informações Gerais", ["data"])}
                    {renderCard("Medidas do lado direito", [
                        "peso",
                        "altura",
                        "imc",
                        "porcentagem_gordura",
                        "altura_joelho",
                        "braco",
                        "punho",
                        "panturrilha",
                        "circunferencia_abdomen",
                        "circunferencia_pescoco",
                    ])}
                </div>
                <div>
                    {renderCard("Medidas do lado esquerdo", [
                        "peso",
                        "altura",
                        "imc",
                        "porcentagem_gordura",
                        "altura_joelho",
                        "braco",
                        "punho",
                        "panturrilha",
                        "circunferencia_abdomen",
                        "circunferencia_pescoco",
                    ])}
                </div>
            </div>
            <ButtonWithLoading
                className="mt-4"
                onClick={() =>
                    router.push(`/acompanhamentos/${acompanhamento.id}/edit`)
                }
            >
                <Edit className="mr-2 h-4 w-4" /> Editar Acompanhamento
            </ButtonWithLoading>
        </div>
    );
}
