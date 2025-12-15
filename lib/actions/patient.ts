"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPatient(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const gender = formData.get("gender") as string;
  const source = formData.get("source") as string | null;
  const status = (formData.get("status") as string) ?? undefined;

  await db.patient.create({
    data: {
      name,
      email,
      phone,
      gender,
      birthDate: new Date(),
      source: source ?? undefined,
      status: status ?? undefined,
    },
  });

  revalidatePath("/patients");
}

export async function updatePatient(patientId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const gender = formData.get("gender") as string;
  const source = formData.get("source") as string | null;
  const status = formData.get("status") as string | null;

  await db.patient.update({
    where: { id: patientId },
    data: {
      name,
      email,
      phone,
      gender,
      ...(source ? { source } : {}),
      ...(status ? { status } : {}),
    },
  });

  revalidatePath(`/patients/${patientId}`);
  revalidatePath("/patients");
}

export async function deletePatient(patientId: string) {
  await db.patient.delete({ where: { id: patientId } });

  revalidatePath("/patients");
  revalidatePath(`/patients/${patientId}`);
}
