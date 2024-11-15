'use client'

import { useEffect, useState } from "react"
import clsx from "clsx"

import { useAddressStore, useCartStore } from "@/store"
import { placeOrder } from "@/actions"
import { currencyFormat, sleep } from "@/utils"
import { useRouter } from "next/navigation"


export const PlaceOrder = () => {

  const router = useRouter()

  const [loaded, setLoaded] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const address = useAddressStore(state => state.address)

  const { itemsInCart, subTotal, tax, total } = useCartStore(state => state.getSummaryInformation())

  const cart = useCartStore(state => state.cart)
  const clearCart = useCartStore(state => state.clearCart)

  useEffect(() => {
    setLoaded(true)
  }, [])

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true)
    // await sleep(2)

    const productsToOrder = cart.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }))

    console.log({ address, productsToOrder });


    // Server action
    const resp = await placeOrder(productsToOrder, address)
    if (!resp.ok) {
      setIsPlacingOrder(false)
      setErrorMessage(resp.message)
      return
    }

    //-> todo salió bien
    clearCart()
    router.replace('/orders/' + resp.order!.id)

  }

  if (!loaded) {
    return <p>Cargando...</p>
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">

      <h2 className="text-2xl font-bold mb-2">Direccion de Entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city} {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      <div
        className="w-full h-0.5 rounded bg-gray-200 mb-10"
      />

      <h2 className="text-2xl mb-">Resumen de orden</h2>

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

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}
          <span className="text-xs">
            Al hacer click en "Colocar Orden", aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
          </span>
        </p>

        <p className="text-red-500">{errorMessage}</p>
        <button
          onClick={onPlaceOrder}
          className={
            clsx({
              'btn-primary': !isPlacingOrder,
              'btn-disabled': isPlacingOrder,
            })
          }
        // href="/orders/1234"
        >
          Colocar Orden
        </button>
      </div>

    </div>
  )
}