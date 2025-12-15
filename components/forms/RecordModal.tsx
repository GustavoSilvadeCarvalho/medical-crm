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
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { createMedicalRecord } from "@/lib/actions/record";

export function RecordModal({ patientId }: { patientId: string }) {
    const [open, setOpen] = useState(false);

    async function handleAction(formData: FormData) {
        await createMedicalRecord(formData);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <FileText className="h-4 w-4 mr-2" /> Nova Anotação
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Evolução</DialogTitle>
                    <DialogDescription>
                        Escreva os detalhes da consulta ou observações clínicas.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleAction} className="grid gap-4 py-4">
                    <input type="hidden" name="patientId" value={patientId} />

                    <Textarea
                        name="description"
                        placeholder="Descreva o quadro clínico, queixas e conduta..."
                        className="h-32"
                        required
                    />

                    <div className="flex justify-end">
                        <Button type="submit" className="bg-green-600 hover:bg-green-700">
                            Salvar no Prontuário
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}