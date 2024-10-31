"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ButtonWithLoading } from "@/components/ui/button-with-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAcompanhamento } from "@/lib/api";
import { Acompanhamento } from "@/types";
import { Save } from "lucide-react";

export function CreateAcompanhamentoForm() {
    const [formData, setFormData] = useState<Partial<Acompanhamento>>({
        prontuario_id: "",
        data: "",
        peso_direito: 0,
        altura_direita: 0,
        imc_direito: 0,
        porcentagem_gordura_direita: 0,
        altura_joelho_direito: 0,
        braco_direito: 0,
        punho_direito: 0,
        panturrilha_direita: 0,
        circunferencia_abdomen_direito: 0,
        circunferencia_pescoco_direito: 0,
        peso_esquerdo: 0,
        altura_esquerda: 0,
        imc_esquerdo: 0,
        porcentagem_gordura_esquerda: 0,
        altura_joelho_esquerdo: 0,
        braco_esquerdo: 0,
        punho_esquerdo: 0,
        panturrilha_esquerda: 0,
        circunferencia_abdomen_esquerda: 0,
        circunferencia_pescoco_esquerdo: 0,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, []);

    useEffect(() => {
        const prontuario_id = searchParams.get("prontuario_id");
        if (prontuario_id) {
            setFormData((prev) => ({ ...prev, prontuario_id }));
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createAcompanhamento(formData as Acompanhamento);
            router.push(`/prontuarios/${formData.prontuario_id}`);
        } catch (error) {
            console.error("Error creating follow-up:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Informações do Acompanhamento</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="hidden"
                        name="prontuario_id"
                        value={formData.prontuario_id}
                    />
                    <div>
                        <Label htmlFor="data">Date</Label>
                        <Input
                            id="data"
                            name="data"
                            type="date"
                            value={formData.data}
                            onChange={handleChange}
                            required
                            className="mt-1"
                        />
                    </div>
                    {Object.entries(formData).map(([key, value]) => {
                        if (key === "prontuario_id" || key === "data")
                            return null;
                        return (
                            <div key={key}>
                                <Label htmlFor={key}>
                                    {key
                                        .replace(/_/g, " ")
                                        .charAt(0)
                                        .toUpperCase() +
                                        key.replace(/_/g, " ").slice(1)}
                                </Label>
                                <Input
                                    id={key}
                                    name={key}
                                    type="number"
                                    step="0.01"
                                    value={value}
                                    onChange={handleChange}
                                    required
                                    className="mt-1"
                                />
                            </div>
                        );
                    })}
                    <ButtonWithLoading
                        type="submit"
                        className="w-full"
                        loading={loading}
                    >
                        <Save className="mr-2 h-4 w-4" /> Salvar Acompanhamento
                    </ButtonWithLoading>
                </form>
            </CardContent>
        </Card>
    );
}
