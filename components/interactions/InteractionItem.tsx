"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash, Edit3 as Pencil } from "lucide-react";
import { updateInteraction, deleteInteraction } from "@/lib/actions/interaction";
import { useToast } from "@/components/ui/toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";


interface InteractionItemProps {
    interaction: any;
}

export default function InteractionItem({ interaction }: InteractionItemProps) {
    const [editing, setEditing] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const { toast } = useToast();

    return (
        <div className="border rounded-md p-3">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                <span>{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(interaction.occurredAt))}</span>
                <span> - </span>
                <span>[{interaction.type === 'WHATSAPP' ? 'WhatsApp' : interaction.type === 'PHONE_CALL' ? 'Telefone' : interaction.type}]</span>
            </div>

            {!editing ? (
                <>
                    <div className="whitespace-pre-wrap mb-2">{interaction.content}</div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-2">
                            <Pencil className="h-4 w-4" />
                            Editar
                        </Button>

                        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-8 w-8 p-0 text-red-600">
                                    <Trash className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-105">
                                <DialogHeader>
                                    <DialogTitle>Confirmar exclusão</DialogTitle>
                                    <DialogDescription>Tem certeza que deseja excluir esta nota? Esta ação não pode ser desfeita.</DialogDescription>
                                </DialogHeader>

                                <div className="flex justify-end gap-2 mt-4">
                                    <Button variant="outline" onClick={() => setOpenDelete(false)} disabled={loadingDelete}>Cancelar</Button>
                                    <Button
                                        variant="destructive"
                                        onClick={async () => {
                                            setLoadingDelete(true);
                                            try {
                                                await deleteInteraction(interaction.id);
                                                toast({ title: "Interação excluída", description: "Nota removida.", type: "success" });
                                                setOpenDelete(false);
                                            } catch {
                                                toast({ title: "Erro", description: "Não foi possível excluir.", type: "error" });
                                            } finally {
                                                setLoadingDelete(false);
                                            }
                                        }}
                                        disabled={loadingDelete}
                                    >
                                        {loadingDelete ? "Excluindo..." : "Confirmar exclusão"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </>
            ) : (
                <div>
                    <form
                        action={updateInteraction.bind(null, interaction.id)}
                        className="space-y-2"
                        onSubmit={() => {
                            setEditing(false);
                            toast({ title: "Atualizado", description: "Interação atualizada.", type: "success" });
                        }}
                    >
                        <textarea name="content" defaultValue={interaction.content} className="w-full border rounded p-2 text-sm" rows={3} />
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-green-600 text-white">Salvar</Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
