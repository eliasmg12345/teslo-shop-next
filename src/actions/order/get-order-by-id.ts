'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {
    const session = await auth()

    if (!session?.user) {
        return {
            ok: false,
            message: 'Debe estar autenticado Sir'
        }
    }

    try {

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                OrderAddress: true,
                OrderItems: {
                    select: {
                        price: true,
                        quantity: true,
                        size: true,

                        product: {
                            select: {
                                title: true,
                                slug: true,

                                ProductImage: {
                                    select: {
                                        url: true
                                    },
                                    take: 1
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!order) throw `${id} no existe`

        //por si no es de un usuario real
        if (session.user.role === 'user') {
            if (session.user.id !== order.userId) {
                throw `${id} no es de ese usuario`
            }
        }

        return {
            ok: true,
            order: order,
        }

    } catch (error: any) {
        console.log(error.message);
        return {
            ook: false,
            message: 'Orden no existe'
        }
    }
}