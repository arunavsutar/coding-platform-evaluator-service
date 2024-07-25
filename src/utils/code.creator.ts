export default function codeCreator(startingCode: string, middleCode: string, endingCode: string): string {
    return `
        ${startingCode}

        ${middleCode}
        
        ${endingCode}
    `
}
/**
 * For python EndCode can be a Empty String
 */