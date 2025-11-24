"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();
  const userId = user.id;

  const name = formData.get("name") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const price = parseFloat(formData.get("price") as string);
  const sku = formData.get("sku") as string | null;
  const lowStockAt = formData.get("lowStockAt")
    ? parseInt(formData.get("lowStockAt") as string)
    : null;

  await prisma.product.create({
    data: {
      userId,
      name,
      quantity,
      price,
      sku: sku || null,
      lowStockAt,
    },
  });

  revalidatePath("/inventory");
  revalidatePath("/dashboard");
  redirect("/inventory");
}

export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();
  const userId = user.id;

  const id = formData.get("id") as string;

  // Verify the product belongs to the user before deleting
  const product = await prisma.product.findFirst({
    where: { id, userId },
  });

  if (!product) {
    throw new Error("Product not found or unauthorized");
  }

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/inventory");
  revalidatePath("/dashboard");
}

