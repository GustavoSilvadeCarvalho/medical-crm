import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RecentAppointmentsProps {
    appointments: {
        id: string;
        reason: string;
        date: Date;
        patient: {
            name: string;
            email: string | null;
        };
    }[];
}

export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
    if (appointments.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Nenhum agendamento próximo.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {appointments.map((apt) => {
                const initials = apt.patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                return (
                    <div key={apt.id} className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{apt.patient.name}</p>
                            <p className="text-sm text-slate-500">
                                {apt.reason}
                            </p>
                        </div>
                        <div className="ml-auto font-medium text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                            {new Intl.DateTimeFormat("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                            }).format(apt.date)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}