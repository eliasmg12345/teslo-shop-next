'use client'

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderData, CreateOrderActions } from "@paypal/paypal-js"
import { setTransactionId } from "@/actions"

interface Props {
    orderId: string
    amount: number
}


export const PayPalButton = ({ orderId, amount }: Props) => {

    const [{ isPending }] = usePayPalScriptReducer()

    const roundedAmount = (Math.round(amount * 100)) / 100

    if (isPending) {
        return (
            <div className="animate-pulse mb-16">
                <div className="h-11 bg-gray-300 rounded" />
                <div className="h-11 bg-gray-300 rounded mt-2" />
            </div>
        )
    }

    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {

        const transacionId = await actions.order.create({
            intent:'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: `${roundedAmount}`,
                    },
                }
            ]
        })


        console.log({ transacionId });
        //guardar el id en la orden en la base de datos
        const { ok } = await setTransactionId(orderId, transacionId)
        if (!ok) {
            throw new Error('No se pudo actualizar la orden')
        }
        return transacionId
    }

    return (
        <div className="relative z-0">
            <PayPalButtons
                createOrder={createOrder}
            />
        </div>
    )

}