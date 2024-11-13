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
    console.log({subTotal,tax,total});
    

    //crear la transaccion de base de datos
    const prismaTx = await prisma.$transaction(async(tx)=>{

        //1. ctualizar el stock de los productos

        //2. crear la orden -> encabezado-detalles

        //3. crear la direccion de la orden

        return {
            orden: 123,
            updatedProducts:123,
            orderAddress:123,
        }
    })


    return {
        ok: false,
        message: ''
    }
}