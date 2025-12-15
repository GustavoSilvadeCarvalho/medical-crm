"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function resetDatabase() {
  await db.appointment.deleteMany();
  await db.medicalRecord.deleteMany();
  await db.patient.deleteMany();

  revalidatePath("/");
}