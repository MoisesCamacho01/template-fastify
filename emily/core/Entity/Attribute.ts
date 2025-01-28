export class Attribute{
    public firstCharacterNumber = (value: any) => {
        let firstCharacter = value.charAt(0) * 1
        if(Number.isInteger(firstCharacter)) return `The first character can't be a number`;
        return true;
    }

    public toCamelCase = (input: string) => {
        return input
            .toLowerCase()
            .split(/[^a-zA-Z0-9]+/)
            .map((word, index) =>
                index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join('');  
    }
}