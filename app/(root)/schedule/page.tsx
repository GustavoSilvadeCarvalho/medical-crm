import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const formatDateHeading = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", { 
      weekday: "long", 
      day: "numeric", 
      month: "long" 
  }).format(date);
}

export default async function SchedulePage() {
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(today.getDate() + 30);

  const appointments = await db.appointment.findMany({
    where: {
      date: {
        gte: today,
      },
      status: {
        notIn: ["CANCELLED"],
      }
    },
    orderBy: { date: "asc" },
    include: {
      patient: {
        select: { id: true, name: true, phone: true },
      },
    },
  });

  const groupedAppointments = appointments.reduce((acc, apt) => {
    const dateKey = apt.date.toISOString().split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(apt);
    return acc;
  }, {} as Record<string, typeof appointments>);

  const dates = Object.keys(groupedAppointments).sort();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
        <Calendar className="h-7 w-7 text-blue-600" /> Agenda de Consultas
      </h1>
      <p className="text-slate-500">
        Próximos {appointments.length} agendamentos nos próximos 30 dias.
      </p>

      {dates.map(dateKey => (
        <Card key={dateKey}>
          <CardHeader className="bg-card border-b">
            <CardTitle className="flex items-center gap-2 text-xl text-card-foreground">
              <Calendar className="h-5 w-5" /> 
              {formatDateHeading(new Date(dateKey))}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Hora</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedAppointments[dateKey].map(apt => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-bold text-lg flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        {new Intl.DateTimeFormat("pt-BR", { hour: '2-digit', minute: '2-digit' }).format(apt.date)}
                    </TableCell>
                    <TableCell>
                        <div className="font-medium">{apt.patient.name}</div>
                        <div className="text-sm text-slate-500">{apt.patient.phone}</div>
                    </TableCell>
                    <TableCell>{apt.reason}</TableCell>
                    <TableCell>
                       <Badge className={`
                          ${apt.status === "PENDING" ? "bg-blue-500 hover:bg-blue-600" : ""}
                          ${apt.status === "COMPLETED" ? "bg-green-600 hover:bg-green-700" : ""}
                          ${apt.status === "MISSED" ? "bg-orange-500 hover:bg-orange-600" : ""}
                       `}>
                          {apt.status === "PENDING" && "Agendado"}
                          {apt.status === "COMPLETED" && "Concluído"}
                          {apt.status === "MISSED" && "Faltou"}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm" asChild>
                           <Link href={`/patients/${apt.patientId}`}>
                               Abrir Ficha <ArrowRight className="h-4 w-4 ml-1" />
                           </Link>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
      
      {appointments.length === 0 && (
          <div className="text-center py-20 text-slate-500">
              <Calendar className="h-10 w-10 mx-auto mb-4" />
              Nenhum agendamento futuro encontrado.
          </div>
      )}
    </div>
  );
}