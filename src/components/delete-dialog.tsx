"use client";

import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

import { Button } from "./ui/button";
import { useState } from "react";
import { ButtonWithLoading } from "./ui/button-with-loading";

type DeleteDialogProps = {
    deleteFunc: (id: number | string) => Promise<void>;
    id: number | string;
    typeReload:
        | "acompanhamento_single"
        | "patients"
        | "patient_single"
        | "prontuario_single";
    idHref?: string | number;
};

export function DeleteDialog({
    deleteFunc,
    id,
    typeReload,
    idHref,
}: DeleteDialogProps) {
    const [open, setOpen] = useState(false);
    const onOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const handleDelete = async () => {
        await deleteFunc(id);

        setTimeout(() => {
            onOpenChange(false);
            if (typeReload === "acompanhamento_single") {
                window.location.href = "/prontuarios/" + idHref;
            } else if (typeReload === "patients") {
                window.location.reload();
            } else if (typeReload === "patient_single") {
                window.location.href = "/patients";
            } else if (typeReload === "prontuario_single") {
                window.location.href = "/patients/" + idHref;
            }
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="destructive">Deletar</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Você tem certeza ?</DialogTitle>
                    <DialogDescription>
                        Essa ação é irreversível.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Não
                    </Button>
                    <ButtonWithLoading variant="destructive" onClick={handleDelete}>
                        Sim
                    </ButtonWithLoading>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
