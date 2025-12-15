"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createInteraction(
  patientId: string,
  content: string,
  type = "NOTE"
) {
  await db.interaction.create({
    data: {
      content,
      type,
      patientId,
    },
  });

  revalidatePath(`/patients/${patientId}`);
  revalidatePath(`/patients`);
}

export async function createInteractionForPatient(
  patientId: string,
  formData: FormData
) {
  const content = ((formData.get("content") as string) || "").trim();
  if (!content) return; // don't create empty/whitespace-only notes
  await createInteraction(patientId, content, "NOTE");
}

export async function updateInteraction(
  interactionId: string,
  formData: FormData
) {
  const content = (formData.get("content") as string) || "";

  const interaction = await db.interaction.update({
    where: { id: interactionId },
    data: { content },
  });

  if (interaction) {
    revalidatePath(`/patients/${interaction.patientId}`);
    revalidatePath(`/patients`);
  }
}

export async function deleteInteraction(interactionId: string) {
  const interaction = await db.interaction.findUnique({
    where: { id: interactionId },
    select: { patientId: true },
  });

  if (!interaction) return;

  await db.interaction.delete({ where: { id: interactionId } });

  revalidatePath(`/patients/${interaction.patientId}`);
  revalidatePath(`/patients`);
}
