"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createMedicalRecord(formData: FormData) {
  const patientId = formData.get("patientId") as string;
  const description = formData.get("description") as string;

  if (!patientId || !description) return;

  await db.medicalRecord.create({
    data: {
      patientId,
      description,
    },
  });

  revalidatePath(`/patients/${patientId}`);
}
