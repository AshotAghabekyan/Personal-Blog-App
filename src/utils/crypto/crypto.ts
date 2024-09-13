import * as bcrypt from "bcrypt";


export class HashGenerator {
    public async genHash(value: string): Promise<string> {
        try {
            const salt: string = await bcrypt.genSalt(8);
            const hashedData: string = await bcrypt.hash(value, salt);
            return hashedData;
        }
        catch(error) {
            console.log('error on genHash()', error);
            return null;
        }
    }

    public async compareHashedData(source: string, hashed: string): Promise<boolean> {
        try {
            const isSame: boolean = await bcrypt.compare(source, hashed);
            return isSame;
        }
        catch(error) {
            console.log("error on compareHashedData()", error);
        }
    }
}