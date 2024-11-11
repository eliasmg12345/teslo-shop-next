'use server'

import type { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
    try {
        const newAddress = await createOrderReplaceAddress(address, userId)

        return {
            ok: true,
            address: newAddress,
        }
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "no se pudo grabar la dirección"
        }

    }
}

const createOrderReplaceAddress = async (address: Address, userId: string) => {

    try {
        console.log({ userId });

        const storeAddress = await prisma.userAddress.findUnique({
            where: {
                userId: userId
            }
        })

        const addressToSave = {
            userId: userId,
            address: address.address,
            address2: address.address2,
            countryId: address.country,
            firstName: address.firstName,
            lastName: address.lastName,
            phone: address.phone,
            city: address.city,
            postalCode: address.postalCode,
        }


        if (!storeAddress) {
            const newAddress = await prisma.userAddress.create({
                data: addressToSave
            })

            return newAddress
        }

        const updatedAddress = await prisma.userAddress.update({
            where: {
                userId: userId
            },
            data: addressToSave
        })

        return updatedAddress

    } catch (error) {
        console.log(error);
        throw new Error('No se pudo grabar la dirección')

    }

}