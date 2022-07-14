// Import external libs
import sharp from 'sharp';

type Props = {
    buffer: any;
    width: number;
    option: string;
    height: number;
    img_type: string;
    out_image: string;
    path_image?: string;
}

export class Image {
    constructor({ option, buffer, out_image, path_image, width, height, img_type }: Props) {
        if (option === 'Exists Image Text') this.existsImageText(buffer, out_image, path_image!, width, height, img_type);
        else if (option === 'createImageText') this.createImageText('');
    };


    private async existsImageText(buffer: Buffer, out_image: string, path_image: string, width: number, height: number, img_type: string): Promise<void> {
        try {
            const image = await sharp(path_image)
                .resize(width, height).composite([{
                    input: buffer,
                    top: 0,
                    left: 0,
                }]).toFile(out_image + '.' + img_type);
        } catch (err) { console.log(err) }
    }
    private async createImageText(imagePath: string): Promise<object> {
        return {};
    }
}