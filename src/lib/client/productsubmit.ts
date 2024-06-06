export type State = {
    error?: {
        status?: string[]
    }
    message?: string[]
}
export const createStock = async (prevState: State, formD: FormData) => {
    console.log(formD);

}