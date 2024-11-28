'use server'

import prisma from "@/lib/prisma";
import { Gender, Product, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(2))),
    inStock: z.coerce
        .number()
        .min(0)
        .transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.string(),
    gender: z.nativeEnum(Gender),
})

export const createUpdateProduct = async (formData: FormData) => {
    const data = Object.fromEntries(formData)
    const productParsed = productSchema.safeParse(data)

    if (!productParsed.success) {
        console.log(productParsed.error);
        return { ok: false }
    }

    const product = productParsed.data
    product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim();

    const { id, ...rest } = product
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            let product: Product
            const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLowerCase());

            if (id) {
                //si existe id -> actualiza
                product = await prisma.product.update({
                    where: { id },
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[],
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                });


            } else {
                //si no existe id -> crear
                product = await prisma.product.create({
                    data: {
                        ...rest,
                        sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    }
                })
                console.log({ updatedProduct: product });
            }

            //proceso de carga y guardado de imagenes
            //recorrer las imagenes y guardarlass
            if (formData.getAll('images')) {
                console.log(formData.getAll('images'));
                
            }


            return {
                product
            }
        })

        //todo: revalidatePaths
        //vamos a revalidar todos los paths en los cuales este producto afecte para que se reconstruya la pagina
        revalidatePath(`/admin/products`)
        revalidatePath(`/admin/products/${product.slug}`)
        revalidatePath(`/products/${product.slug}`)

        return {
            ok: true,
            product: prismaTx.product
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'Revisar los logs'
        }


    }
}