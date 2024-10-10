
// [1,2,3,4,5,...,50]

export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {

    //si el numero ttal de pagians es 7 o menos
    //vamos a mostrar todas las pagians sin puntos suspensivos

    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // si la pagina actual esta entre las primeras 3 paginas
    // mostrar las primeras 3, puntos suspensivos , y las ultimas 2
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages] //[1,2,3,'...',49,50]
    }

    //si la pagina acgual esta entre las ultimas 3 paginas
    //mostrar las primars 2, ... , y las ultimas 3 paginas
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
    }

    //si la pagina actual esta en otro lugar medio
    //mostrar la primara pagina, ..., pagina actual y vecinos
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ]

}