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
import { updatePatient } from "@/lib/actions/patient";
import { useToast } from "@/components/ui/toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Props {
    patientId: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    gender?: string | null;
    status?: string | null;
    source?: string | null;
}

export function EditPatientModal({ patientId, name, email, phone, gender, status, source }: Props) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    async function handleAction(formData: FormData) {
        try {
            await updatePatient(patientId, formData);
            toast({ title: "Sucesso", description: "Dados atualizados.", type: "success" });
            setOpen(false);
        } catch {
            toast({ title: "Erro", description: "Não foi possível atualizar.", type: "error" });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Editar Dados</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Editar Paciente</DialogTitle>
                    <DialogDescription>
                        Atualize as informações do paciente.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleAction} className="grid gap-4 py-4">

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" name="name" defaultValue={name ?? ""} placeholder="Ex: João Silva" required />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" defaultValue={email ?? ""} placeholder="joao@exemplo.com" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="source">Como nos conheceu?</Label>
                        <Select name="source" defaultValue={source ?? undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GOOGLE">Google</SelectItem>
                                <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                                <SelectItem value="FACEBOOK">Facebook</SelectItem>
                                <SelectItem value="TIKTOK">TikTok</SelectItem>
                                <SelectItem value="FRIEND_REFERRAL">Indicação de amigo</SelectItem>
                                <SelectItem value="DOCTOR_REFERRAL">Indicação de médico</SelectItem>
                                <SelectItem value="INSURANCE">Convênio</SelectItem>
                                <SelectItem value="PASSING_BY">Passando na rua</SelectItem>
                                <SelectItem value="OTHER">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefone</Label>
                            <Input id="phone" name="phone" defaultValue={phone ?? ""} placeholder="(11) 99999-9999" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gênero</Label>
                            <Select name="gender" defaultValue={gender ?? ""} required>
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

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={status ?? undefined}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LEAD">Lead</SelectItem>
                                <SelectItem value="SCHEDULED">Agendado</SelectItem>
                                <SelectItem value="ACTIVE">Ativo</SelectItem>
                                <SelectItem value="WAITING_RETURN">Aguardando Retorno</SelectItem>
                                <SelectItem value="INACTIVE">Inativo</SelectItem>
                                <SelectItem value="ARCHIVED">Arquivado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button type="submit">Salvar Alterações</Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}
