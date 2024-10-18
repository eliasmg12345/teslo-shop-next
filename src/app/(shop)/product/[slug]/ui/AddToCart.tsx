'use client'

import { useState } from "react"
import { QuantitySelector, SizeSelector } from "@/components"
import type { CartProduct, Product, Size } from "@/interfaces"
import { useCartStore } from "@/store"

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {

    const addProductToCart = useCartStore(state => state.addProductToCart)

    const [size, setSize] = useState<Size | undefined>()
    const [quantity, setQuantity] = useState<number>(1)
    const [posted, setPosted] = useState(false)

    const AddToCart = () => {
        setPosted(true)
        if (!size) return

        const cartProduct: CartProduct = {
            id: product.id,
            slug: product.slug,
            title: product.title,
            price: product.price,
            quantity: quantity,
            size: size,
            image: product.images[0],
        }

        addProductToCart(cartProduct)
        setPosted(false)
        setQuantity(1)
        setSize(undefined)

    }

    return (
        <>
            {
                posted && !size && (
                    <span className="mt-2 text-red-700">
                        Debe seleccionar una tall
                    </span>
                )
            }
            <SizeSelector
                selectedSize={size}
                availableSizes={product.sizes}
                onSizeChanged={setSize}
            />

            <QuantitySelector
                quantity={quantity}
                onQuantityChanged={setQuantity}
            />

            <button
                onClick={AddToCart}
                className="btn-primary my-5"
            >
                Agregar al Carrito
            </button>
        </>
    )
}