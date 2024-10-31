import { ButtonWithLoading } from "@/components/ui/button-with-loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Users, UserPlus } from "lucide-react";

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Gerenciamento de Pacientes
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center">
                            <Users className="mr-2 h-6 w-6" />
                            Pacientes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-4">
                        <Link href="/patients" passHref>
                            <ButtonWithLoading size="lg" className="w-full">
                                Ver Pacientes
                            </ButtonWithLoading>
                        </Link>
                        <Link href="/patients/create" passHref>
                            <ButtonWithLoading
                                size="lg"
                                className="w-full"
                                variant="outline"
                            >
                                <UserPlus className="mr-2 h-5 w-5" />
                                Adicionar Paciente
                            </ButtonWithLoading>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}