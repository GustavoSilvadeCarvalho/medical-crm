import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PatientModal } from "@/components/forms/PatientModal";
import { Search } from "@/components/ui/search";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "medium",
    }).format(date);
};

export default async function PatientsPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {

    const query = (await searchParams)?.query || "";
    const patients = await db.patient.findMany({
        where: {
        name: {
            contains: query,
        },
        },
        orderBy: { createdAt: "desc" },
        include: { appointments: true }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
                    <p className="text-slate-500">
                        Gerencie seus {patients.length} pacientes cadastrados.
                    </p>
                </div>
                <PatientModal />
            </div>

            <div className="flex items-center justify-between">
                <Search />
            </div>

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Cadastrado em</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{patient.name}</span>
                                        <span className="text-xs text-muted-foreground">{patient.gender}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{patient.email || "-"}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                                <TableCell>{formatDate(patient.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/patients/${patient.id}`}>
                                            Abrir
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {patients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Nenhum paciente encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}