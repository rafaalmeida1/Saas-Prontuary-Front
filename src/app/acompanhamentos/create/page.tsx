import { Suspense, useEffect } from "react";
import { ButtonWithLoading } from "@/components/ui/button-with-loading";
import { ArrowLeft } from "lucide-react";
import { CreateAcompanhamentoForm } from "./create-acompanhamento-form";
import { LoadingPage } from "@/components/ui/loading";
import { useRouter } from "next/navigation";

export default function CreateAcompanhamentoPage() {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <ButtonWithLoading className="mb-6">
                <a href="javascript:history.back()">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </a>
            </ButtonWithLoading>
            <h1 className="text-3xl font-bold mb-6">Criar Acompanhamento</h1>
            <Suspense fallback={<LoadingPage />}>
                <CreateAcompanhamentoForm />
            </Suspense>
        </div>
    );
}
