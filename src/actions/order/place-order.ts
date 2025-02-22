'use server'

import { auth } from "@/auth.config"
import type { Address, Size } from "@/interfaces"
import prisma from "@/lib/prisma"

interface ProductToOrder {
    productId: string
    quantity: number
    size: Size
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

    const session = await auth()
    const userId = session?.user.id

    //verificar sesion de usuario
    if (!userId) {
        return {
            ok: false,
            message: 'no hay session de usuario'
        }
    }

    //obtener la informacion de los productos
    //Nota: recuerden que podemos llevar 2+ productos con el ,mismo id
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    })
    //calcular los montos // encabezado
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0)

    //los totales de tax, subtotal, total
    const { subTotal, tax, total } = productIds.reduce((totals, item) => {

        const productQuantity = item.quantity
        const product = products.find(product => product.id === item.productId)

        if (!product) throw new Error(`${item.productId} no existe - 500`)

        const subTotal = product.price * productQuantity

        totals.subTotal += subTotal
        totals.tax += subTotal * 0.15
        totals.total += subTotal * 1.15

        return totals
    }, { subTotal: 0, tax: 0, total: 0 })
    console.log({ subTotal, tax, total });


    //crear la transaccion de base de datos
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            //1. ctualizar el stock de los productos
            const updatedProductsPromises = products.map((product) => {

                //acumular los valores
                const productQuantity = productIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => item.quantity + acc, 0)

                if (productQuantity === 0) {
                    throw new Error(`${product.id}, no tiene cantidad definida`)
                }



                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        // inStock: product.inStock - productQuantity  // no hacer
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            })

            const updatedProducts = await Promise.all(updatedProductsPromises)

            // verificar valores negativos en la existencia = no hay stock
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente`)
                }
            })

            //2. crear la orden -> encabezado-detalles
            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,

                    OrderItems: {
                        createMany: {
                            data: productIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })

            //Validar, si el price es cero, entnces lanzar un error

            //3. crear la direccion de la orden
            //Address
            const { country, ...restAddress } = address

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id,
                }
            })

            return {
                order: order,
                updatedProducts: updatedProducts,
                orderAddress: orderAddress,
            }
        })

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx: prismaTx
        }

    } catch (error) {
        console.log(error);
        
        return {
            ok: false,
            message: 'error en place-order'
        }
    }

}