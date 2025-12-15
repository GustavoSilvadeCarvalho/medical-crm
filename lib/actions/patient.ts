"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createPatient(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const gender = formData.get("gender") as string;

  await db.patient.create({
    data: {
      name,
      email,
      phone,
      gender,
      birthDate: new Date(),
    },
  });

  revalidatePath("/patients");
}
