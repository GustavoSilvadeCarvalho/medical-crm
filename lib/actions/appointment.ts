"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createAppointment(formData: FormData) {
  const patientId = formData.get("patientId") as string;
  const reason = formData.get("reason") as string;
  const dateString = formData.get("date") as string;

  const date = new Date(dateString);

  await db.appointment.create({
    data: {
      patientId,
      reason,
      date,
      status: "PENDING",
    },
  });

  revalidatePath(`/patients/${patientId}`);
}

export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: string
) {
  await db.appointment.update({
    where: { id: appointmentId },
    data: { status: newStatus },
  });

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    select: { patientId: true },
  });

  if (appointment) {
    revalidatePath(`/patients/${appointment.patientId}`);
  }
}
