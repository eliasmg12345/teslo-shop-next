import { getCategories, getProductBySlug } from "@/actions"
import { Title } from "@/components"
import { redirect } from "next/navigation"
import { ProductForm } from "./ui/ProcuctForm"

interface Props {
    params: {
        slug: string
    }
}

export default async function ProductPage({ params }: Props) {
    const { slug } = params

    const [product, categories] = await Promise.all([
        getProductBySlug(slug),
        getCategories(),
    ])

    //todo: new
    if (!product && slug !== 'new') {
        redirect('/admin/products')
    }

    const title = (slug === 'new') ? 'Nuevo Producto' : 'Editar Producto'



    return (
        <>
            <Title title={title} />
                {/* que sea partial no significa que acepte null por eso ponemos ?? {} y cambiamos  en getProductBySLug a productImage a true */}
            <ProductForm product={product ?? {}} categories={categories} />
        </>
    )
}