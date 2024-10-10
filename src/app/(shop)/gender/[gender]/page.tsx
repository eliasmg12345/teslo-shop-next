export const revalidate = 60

import { getPaginateProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";

import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";


interface Props {
  params: {
    gender: string
  },
  searchParams: {
    page?: string;
  }
}

export default async function GenderByPage({ searchParams, params }: Props) {

  const { gender } = params

  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const { products, currentPage, totalPages } = await getPaginateProductsWithImages({
    page,
    gender: gender as Gender,
  })

  if (products.length === 0) {
    redirect(`/gender/${gender}`)
  }

  const labels: Record<string, string> = {
    "men": " Hombres",
    "women": " Mujeres",
    "kid": " Niños",
    "unisex": "para Todos"
  }
  // if (id === 'kids') {
  //   notFound()
  // }

  // if (id === 'men') {
  // }

  return (
    <>
      <Title
        title={`Arcticulos de ${labels[gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid
        products={products}
      />
      <Pagination totalPages={totalPages} />
    </>
  );
}