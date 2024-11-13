

export const sleep = (seconds: number = 1) => {
    return new Promise<boolean>((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, seconds * 1000);
    })

}