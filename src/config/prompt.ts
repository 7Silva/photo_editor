// Import external libs
import { resolve } from 'node:path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'node:fs';

// Import internal libs
import { SvgText } from '../functions/SvgText.js';
import { Image } from './../functions/Image.js';

export async function prompt() {
    if (process.argv[2] === '--configFile') {
        return useConfigFile();
    }

    inquirer.prompt([
        { type: 'list', name: 'option', message: 'How do you want to use it?', choices: ['Exists Image Text', 'Create Image Text'] },
        { type: 'list', name: 'editor', message: 'How do you want to use it?', choices: ['Editor', 'Command Line', 'Config File'] },
    ]).then(answers => {
        switch (answers.editor) {
            case 'Editor':
                useEditor(answers.option); break;
            case 'Command Line':
                useCommandLine(answers.option); break;
            case 'Config File':
                useConfigFile(); break;
        }
    });

    function useEditor(option: string) {
        try {
            inquirer.prompt([
                {
                    type: 'editor', name: 'filesEditor',
                    default: `
                {
                    "texts": [
                        {
                            "y"?: "string | number",
                            "x"?: "string | number",
                            "className"?: "string",
                            "text": "string"
                        }
                    ],
                    "options": {
                        "style"?: "string",
                        "option": "${option}",
                        "outImage": "string",
                        "imageType": "string",
                        "imagePath"?: "string",
                        "width": number,
                        "height": number
                    }
                }
                `
                }
            ]).then(answers => {
                const json = JSON.parse(answers.filesEditor),
                    buffer = new SvgText({
                        texts: json.texts,
                        width: json.options.width,
                        height: json.options.height,
                        style: json.options.style || '',
                    });

                new Image({
                    path_image: json.options.imagePath,
                    out_image: json.options.outImage,
                    img_type: json.options.imageType,
                    height: json.options.height,
                    option: json.options.option,
                    width: json.options.width,
                    buffer,
                });
            })
        } catch (err) { console.log(err) }
    };

    function useCommandLine(option: string) {
        interface Props {
            text: string;
            width: number;
            height: number;
            style?: string;
            outImage: string;
            imageType: string;
            className?: string;
            x?: string | number;
            y?: string | number;
        }

        console.log(`\n[${chalk.yellow('!')}] ${chalk.bold('The command line does not support multiple images and you will not be able to edit the styles.\n')}`)

        inquirer.prompt([
            { type: 'input', name: 'text', message: 'What is the text?', default: 'Hello World!' },
            { type: 'input', name: 'className', message: 'What is the class name?' },
            { type: 'input', name: 'x', message: 'What is the x position?', default: '0' },
            { type: 'input', name: 'y', message: 'What is the y position?', default: '0' },
            { type: 'input', name: 'width', message: 'What is the width image?', default: '100' },
            { type: 'input', name: 'height', message: 'What is the height image?', default: '100' },
            {
                type: 'checkbox', name: 'style', message: 'What is the style? (Optional)',
                choices: [
                    'Center Text', 'Center Text Horizontally', 'Center Text Vertically',
                    'Text white', 'Text black', 'Text red',
                    'Text size 12', 'Text size 16', 'Text size 20'
                ]
            },
            { type: 'input', name: 'outImage', message: 'What is the image output from?', default: 'outImage' },
            { type: 'list', name: 'imageType', message: 'What is the type image?', choices: ['png', 'jpg'] },
        ]).then((answers: Props) => {
            return '.';
        })
    };

    function useConfigFile() {
        const configFile = fs.readFileSync(resolve(process.cwd(), 'configImage.json'), 'utf8');

        return configFile;
    };
}