import { Title } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";



export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">


      <div className="flex flex-col w-[1000px] bg-red-500">
        <Title title="Verificar Orden" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elementos</span>
            <Link href="/cart" className="underline mb-5">
              Editar  Carrito
            </Link>

            {/* Items del carrito */}
            <ProductsInCart />
          </div>



          {/* Checkout - resumen de orden*/}
          <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl font-bold mb-2">Direccion de Entrega</h2>
            <div className="mb-10">
              <p className="text-xl">Elias Mollericona</p>
              <p>H. Potosi</p>
              <p>Universidad Pública de El Alto</p>
              <p>2861590</p>
            </div>

            <div
              className="w-full h-0.5 rounded bg-gray-200 mb-10"
            />

            <h2 className="text-2xl mb-">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">3 artidulos</span>

              <span>subtotal</span>
              <span className="text-right">$ 100</span>

              <span>Impuestos</span>
              <span className="text-right">$ 1056</span>

              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-2xl text-right">$1212</span>

            </div>

            <div className="mt-5 mb-2 w-full">
              <p className="mb-5">
                {/* Disclaimer */}
                <span className="text-xs">
                  Al hacer click en "Colocar Orden", aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
                </span>
              </p>
              <Link
                className="flex btn-primary justify-center"
                href="/orders/1234"
              >Colocar Orden
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}