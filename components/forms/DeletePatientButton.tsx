"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { deletePatient } from "@/lib/actions/patient";

interface Props {
    patientId: string;
    patientName?: string | null;
}

export function DeletePatientButton({ patientId, patientName }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    async function handleDelete() {
        setLoading(true);
        try {
            await deletePatient(patientId);
            toast({ title: "Paciente excluído", description: `${patientName ?? "Paciente"} removido.`, type: "success" });
            setOpen(false);
            router.push("/patients");
        } catch {
            toast({ title: "Erro", description: "Não foi possível excluir o paciente.", type: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive">Excluir</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-105">
                <DialogHeader>
                    <DialogTitle>Confirmar exclusão</DialogTitle>
                    <DialogDescription>
                        Você tem certeza que quer excluir {patientName ? `o usuário ${patientName}` : "este usuário"} do sistema? Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? "Excluindo..." : "Confirmar exclusão"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
