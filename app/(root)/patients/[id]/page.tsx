import { db } from "@/lib/db";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    CalendarDays, FileText, User, MoreHorizontal,
    CheckCircle2,
    XCircle,
    AlertCircle
} from "lucide-react";

import { RecordModal } from "@/components/forms/RecordModal";
import { EditPatientModal } from "@/components/forms/EditPatientModal";
import { AppointmentModal } from "@/components/forms/AppointmentModal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateAppointmentStatus } from "@/lib/actions/appointment";
import { createInteractionForPatient } from "@/lib/actions/interaction";
import Link from "next/link";
import InteractionsList from "@/components/interactions/InteractionsList";
import { DeletePatientButton } from "@/components/forms/DeletePatientButton";

export default async function PatientDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await auth();
    const isAdmin = (session?.user as { role?: string })?.role === "ADMIN";
    const resolvedParams = await params;

    const patient = await db.patient.findUnique({
        where: { id: resolvedParams.id },
        include: {
            appointments: { orderBy: { date: "desc" } },
            medicalRecords: { orderBy: { createdAt: "desc" } },
            interactions: { orderBy: { occurredAt: "desc" } }
        },
    });

    if (!patient) return notFound();

    const initials = patient.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">{patient.name}</h1>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                            <User className="h-4 w-4" /> {patient.gender}
                            <span>•</span>
                            <span>{patient.phone}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <AppointmentModal patientId={patient.id} />
                    <Button variant="outline" className="gap-2" asChild>
                        <Link href={`/patients/${patient.id}/certificate`} target="_blank">
                            <FileText className="h-4 w-4" />
                            Atestado
                        </Link>
                    </Button>
                    <EditPatientModal
                        patientId={patient.id}
                        name={patient.name}
                        email={patient.email}
                        phone={patient.phone}
                        gender={patient.gender}
                        status={patient.status}
                        source={patient.source}
                    />
                    {isAdmin && (
                        <DeletePatientButton patientId={patient.id} patientName={patient.name} />
                    )}
                </div>
            </div>

            <Tabs defaultValue="appointments" className="w-full">
                <TabsList>
                    <TabsTrigger value="appointments">Histórico de Consultas</TabsTrigger>
                    <TabsTrigger value="records">Prontuário Médico</TabsTrigger>
                    <TabsTrigger value="relationship">Relacionamento</TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Consultas Agendadas e Realizadas</CardTitle>
                            <CardDescription>Histórico completo de atendimentos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {patient.appointments.length === 0 ? (
                                <div className="text-center py-10 text-slate-500">
                                    Nenhuma consulta registrada para este paciente.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {patient.appointments.map((apt) => (
                                        <div key={apt.id} className="flex items-center justify-between p-4 border rounded-md mb-3">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${apt.status === "COMPLETED" ? "bg-green-100" : "bg-blue-50"}`}>
                                                    <CalendarDays className={`h-5 w-5 ${apt.status === "COMPLETED" ? "text-green-600" : "text-blue-600"}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{apt.reason}</p>
                                                    <p className="text-sm text-slate-500">
                                                        {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short" }).format(apt.date)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    className={`
                                                        ${apt.status === "PENDING" ? "bg-slate-500 hover:bg-slate-600" : ""}
                                                        ${apt.status === "COMPLETED" ? "bg-green-600 hover:bg-green-700" : ""}
                                                        ${apt.status === "CANCELLED" ? "bg-red-600 hover:bg-red-700" : ""}
                                                        ${apt.status === "MISSED" ? "bg-orange-500 hover:bg-orange-600" : ""}
                                                    `}
                                                >
                                                    {apt.status === "PENDING" && "Agendado"}
                                                    {apt.status === "COMPLETED" && "Concluído"}
                                                    {apt.status === "CANCELLED" && "Cancelado"}
                                                    {apt.status === "MISSED" && "Faltou"}
                                                </Badge>

                                                {apt.status === "PENDING" ? (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Abrir menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Atualizar Status</DropdownMenuLabel>

                                                            <DropdownMenuItem asChild>
                                                                <form action={updateAppointmentStatus.bind(null, apt.id, "COMPLETED")}>
                                                                    <button className="w-full flex items-center text-green-600 cursor-pointer">
                                                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                        Concluir Atendimento
                                                                    </button>
                                                                </form>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem asChild>
                                                                <form action={updateAppointmentStatus.bind(null, apt.id, "MISSED")}>
                                                                    <button className="w-full flex items-center text-orange-600 cursor-pointer">
                                                                        <AlertCircle className="mr-2 h-4 w-4" />
                                                                        Não Compareceu
                                                                    </button>
                                                                </form>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem asChild>
                                                                <form action={updateAppointmentStatus.bind(null, apt.id, "CANCELLED")}>
                                                                    <button className="w-full flex items-center text-red-600 cursor-pointer">
                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                        Cancelar Consulta
                                                                    </button>
                                                                </form>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                ) : (
                                                    <div className="w-8"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="records" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Prontuário Médico</CardTitle>
                                <CardDescription>Anotações clínicas e evoluções.</CardDescription>
                            </div>

                            <RecordModal patientId={patient.id} />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {patient.medicalRecords.length === 0 ? (
                                    <p className="text-center text-slate-500 py-4">Nenhuma anotação registrada.</p>
                                ) : (
                                    patient.medicalRecords.map((record) => (
                                        <div key={record.id} className="border-l-4 border-green-500 pl-4 py-2">
                                            <p className="text-sm text-slate-400 mb-1">
                                                {new Intl.DateTimeFormat("pt-BR", {
                                                    dateStyle: "short",
                                                    timeStyle: "short"
                                                }).format(record.createdAt)}
                                            </p>
                                            <p className="whitespace-pre-wrap text-slate-700">
                                                {record.description}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="relationship" className="mt-4">
                    <Card>
                        <CardHeader className="flex items-center justify-between">
                            <div>
                                <CardTitle>Relacionamento</CardTitle>
                                <CardDescription>Anotações e interações com o paciente.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form action={createInteractionForPatient.bind(null, patient.id)} className="mb-4">
                                <div className="flex gap-2">
                                    <input name="content" placeholder="Adicionar nota rápida..." className="flex-1 input bg-card border rounded px-3 py-2" required />
                                    <button className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded">Adicionar</button>
                                </div>
                            </form>

                            <div className="space-y-3">
                                <InteractionsList interactions={patient.interactions} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}