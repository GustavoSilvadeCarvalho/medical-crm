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
import { Plus } from "lucide-react";
import { createPatient } from "@/lib/actions/patient";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export function PatientModal() {
    const [open, setOpen] = useState(false);

    async function handleAction(formData: FormData) {
        await createPatient(formData);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" /> Novo Paciente
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Novo Paciente</DialogTitle>
                    <DialogDescription>
                        Preencha os dados básicos para iniciar o cadastro.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleAction} className="grid gap-4 py-4">

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" name="name" placeholder="Ex: João Silva" required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="joao@exemplo.com" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input id="phone" name="phone" placeholder="(11) 99999-9999" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gênero</Label>
                            <Select name="gender" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Masculino">Masculino</SelectItem>
                                    <SelectItem value="Feminino">Feminino</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button type="submit">Salvar Cadastro</Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}