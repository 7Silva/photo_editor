type Props = {
    texts: [{
        text: string;
        x: string | number;
        y: string | number;
        className?: string;
        textAnchor?: string;
        fontFamily?: string;
    }];
    width: number;
    height: number;
    style?: string;
}

export class SvgText {
    constructor({
        texts,
        width,
        style,
        height
    }: Props) {
        const svgText = `
        <svg width="${width}" height="${height}">
            ${style ? `<style>${style}</style>` : ''}
            ${texts.map(text => {
            return (`
                    <text
                        x="${text.x ?? 0}"
                        y="${text.y ?? 0}"
                        text-anchor="${text.textAnchor || 'middle'}"
                        ${text.className ? `class="${text.className}"` : ''}
                        font-family="${text.fontFamily || 'Arial, Helvetica, sans-serif'}"
                    >
                        ${text.text}
                    </text>
                `)
        })}
        </svg>
    `

        return Buffer.from(svgText);
    };
};