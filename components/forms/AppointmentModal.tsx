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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarPlus } from "lucide-react";
import { createAppointment } from "@/lib/actions/appointment";

export function AppointmentModal({ patientId }: { patientId: string }) {
    const [open, setOpen] = useState(false);

    async function handleAction(formData: FormData) {
        await createAppointment(formData);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                    <CalendarPlus className="h-4 w-4 mr-2" /> Agendar Retorno
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agendar Consulta</DialogTitle>
                    <DialogDescription>
                        Defina a data e o motivo do agendamento.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleAction} className="grid gap-4 py-4">
                    <input type="hidden" name="patientId" value={patientId} />

                    <div className="grid gap-2">
                        <Label htmlFor="reason">Motivo da Consulta</Label>
                        <Input id="reason" name="reason" placeholder="Ex: Retorno, Exames, Primeira vez..." required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="date">Data e Hora</Label>
                        <Input
                            id="date"
                            name="date"
                            type="datetime-local"
                            required
                            className="block"
                        />
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                            Confirmar Agendamento
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}