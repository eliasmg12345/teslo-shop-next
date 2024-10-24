'use client'

import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import { useEffect, useState } from "react"

export const OrderSumary = () => {


    const [loaded, setLoaded] = useState(false)
    const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSummaryInformation())
    // const { itemsInCart, subTotal, tax, total } = useMemo(() => {
    //     return useCartStore(state => state.getSumaryInformation())
    // }, [])


    useEffect(() => {
        setLoaded(true)
    }, [])

    if (!loaded) return <p>Loading...</p>

    return (

        <div className="grid grid-cols-2">
            <span>No. Productos</span>
            <span className="text-right">{itemsInCart === 1 ? '1 articulo' : `${itemsInCart} articulos`}</span>

            <span>subTotal</span>
            <span className="text-right">{currencyFormat(subTotal)}</span>

            <span>Impuestos</span>
            <span className="text-right">{currencyFormat(tax)}</span>

            <span className="mt-5 text-2xl">Total</span>
            <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>

        </div>
    )
}