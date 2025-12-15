import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, Activity } from "lucide-react";
import { db } from "@/lib/db";
import { AppointmentChart } from "@/components/dashboard/appointment-chart";
import SourcePie from "@/components/dashboard/source-pie";
import { RecentAppointments } from "@/components/dashboard/recent-appointments";

async function getLast7DaysStats() {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const appointments = await db.appointment.findMany({
        where: {
            date: {
                gte: sevenDaysAgo,
            },
        },
    });

    const chartData = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(today.getDate() - i);

        const dayName = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(d);

        const count = appointments.filter(apt =>
            apt.date.getDate() === d.getDate() &&
            apt.date.getMonth() === d.getMonth()
        ).length;

        chartData.unshift({ name: dayName.charAt(0).toUpperCase() + dayName.slice(1), total: count });
    }

    return chartData;
}

export default async function DashboardPage() {
    const totalPatients = await db.patient.count();

    const appointmentsToday = await db.appointment.count({
        where: {
            date: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        }
    });

    const chartData = await getLast7DaysStats();
    const estimatedRevenue = appointmentsToday * 150;

    const upcomingAppointments = await db.appointment.findMany({
        take: 5,
        where: {
            date: {
                gte: new Date(),
            },
            status: "PENDING",
        },
        orderBy: {
            date: "asc",
        },
        include: {
            patient: {
                select: { name: true, email: true },
            },
        },
    });

    // Build source distribution for patients (for the pie chart)
    const patientSources = await db.patient.findMany({ select: { source: true } });
    const sourceCounts: Record<string, number> = {};
    for (const p of patientSources) {
        const key = p.source ?? 'OTHER';
        sourceCounts[key] = (sourceCounts[key] ?? 0) + 1;
    }
    const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Médico</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPatients}</div>
                        <p className="text-xs text-muted-foreground">Base ativa de pacientes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Consultas Hoje</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{appointmentsToday}</div>
                        <p className="text-xs text-muted-foreground">Agendamentos confirmados</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Faturamento Est.</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {estimatedRevenue},00</div>
                        <p className="text-xs text-muted-foreground">Baseado em R$ 150/consulta</p>
                    </CardContent>
                </Card>
            </div>

            {/* Pie chart will be rendered after the main charts - kept here logically but moved below */}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-1 md:col-span-2 lg:col-span-4 h-[350px]">
                    <CardHeader>
                        <CardTitle>Volume de Atendimentos</CardTitle>
                        <p className="text-sm text-slate-500">Últimos 7 dias</p>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <AppointmentChart data={chartData} height={250} />
                    </CardContent>
                </Card>

                <Card className="col-span-1 md:col-span-2 lg:col-span-3 h-[350px]">
                    <CardHeader>
                        <CardTitle>Próximos Agendamentos</CardTitle>
                        <p className="text-sm text-slate-500">
                            Você tem {upcomingAppointments.length} consultas na fila.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <RecentAppointments appointments={upcomingAppointments} />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
                <Card className="h-[350px]">
                    <CardHeader>
                        <CardTitle>Como nos conheceram</CardTitle>
                        <p className="text-sm text-slate-500">Distribuição das fontes de aquisição</p>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <SourcePie data={sourceData} height={250} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}