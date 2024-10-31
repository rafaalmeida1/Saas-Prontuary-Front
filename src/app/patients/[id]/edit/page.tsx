"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ButtonWithLoading } from "@/components/ui/button-with-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getPaciente, updatePaciente } from "@/lib/api";
import { Paciente } from "@/types";
import Image from "next/image";
import { LoadingPage } from "@/components/ui/loading";

export default function EditPatientPage({
    params,
}: {
    params: { id: string };
}) {
    const [formData, setFormData] = useState<Paciente | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, []);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const patientData = await getPaciente(params.id);
                setFormData(patientData);
                setImagePreview(patientData.imagem_url);
            } catch (error) {
                console.error("Error fetching patient:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            if (!prev) return prev;
            return { ...prev, [name]: value };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        setSubmitting(true);
        try {
            let imageUrl = formData.imagem_url;
            if (imageFile) {
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                imageUrl = await new Promise((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                });
            }
            const updatedPatient: Paciente = {
                ...formData,
                imagem_url: imageUrl,
            };
            await updatePaciente(params.id, updatedPatient);
            router.push(`/patients/${params.id}`);
        } catch (error) {
            console.error("Error updating patient:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingPage />;
    }

    if (!formData) {
        return <div>Patient not found</div>;
    }

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Editar Paciente</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Paciente: {formData.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="nome">Name</Label>
                            <Input
                                id="nome"
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label>Gender</Label>
                            <RadioGroup
                                name="genero"
                                value={formData.genero}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev!,
                                        genero: value,
                                    }))
                                }
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">Masculino</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="female"
                                        id="female"
                                    />
                                    <Label htmlFor="female">Feminino</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="other" id="other" />
                                    <Label htmlFor="other">Outro</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div>
                            <Label htmlFor="raca">Raça</Label>
                            <Input
                                id="raca"
                                name="raca"
                                value={formData.raca}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="data_entrada_clinica">
                                Data de Entrada na Clínica
                            </Label>
                            <Input
                                id="data_entrada_clinica"
                                name="data_entrada_clinica"
                                type="date"
                                value={formData.data_entrada_clinica}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="data_nascimento">
                                Data de Nascimento
                            </Label>
                            <Input
                                id="data_nascimento"
                                name="data_nascimento"
                                type="date"
                                value={formData.data_nascimento}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="imagem">Imagem</Label>
                            <Input
                                id="imagem"
                                name="imagem"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </div>
                        {imagePreview && (
                            <div>
                                <Label>Imagem Atual</Label>
                                <Image
                                    src={imagePreview}
                                    alt="Patient"
                                    width={200}
                                    height={200}
                                    className="mt-2 rounded-md"
                                />
                            </div>
                        )}
                        <ButtonWithLoading type="submit" loading={submitting}>
                            Atualizar Paciente
                        </ButtonWithLoading>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
