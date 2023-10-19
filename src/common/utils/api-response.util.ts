export const success = (
    data: any = {},
    message: string = '',
    httpCode: number = 200,
    type: string = 'success') => {

    return {
        data,
        message,
        type,
        httpCode
    }
}
