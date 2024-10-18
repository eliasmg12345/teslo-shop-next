import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface State {
    cart: CartProduct[];

    getTotalItems: () => number;

    addProductToCart: (product: CartProduct) => void
    //updateProductQuantity
    //removeProduct
}

export const useCartStore = create<State>()(

    persist(
        (set, get) => ({

            cart: [],

            //METHODS
            getTotalItems: () => {
                const { cart } = get()
                return cart.reduce((total, item) => total + item.quantity, 0)
            },
            addProductToCart: (product: CartProduct) => {
                const { cart } = get()

                //1. revisar si el producto existe en el carrito con la talla seleccionada
                const productInCart = cart.some(
                    (item) => (item.id === product.id && item.size === product.size)
                )
                if (!productInCart) {
                    set({ cart: [...cart, product] })
                    return
                }

                //2. se que el producto existe por talla, ahora tengo que incrementarlo
                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: item.quantity + product.quantity }
                    }
                    return item
                })

                set({ cart: updatedCartProducts })
            }

        })
        , {
            name: "shopping-cart"
        }
    )
)