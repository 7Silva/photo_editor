import { resolve } from 'node:path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'node:fs';


export function prompt() {
    if (process.argv[2] === '--configFile') {
        return useConfigFile();
    }

    inquirer.prompt([
        { type: 'list', name: 'option', message: 'How do you want to use it?', choices: ['Editor', 'Command Line', 'Config File'] },
    ]).then(answers => {
        switch (answers.option) {
            case 'Editor':
                useEditor(); break;
            case 'Command Line':
                useCommandLine(); break;
            case 'Config File':
                useConfigFile(); break;
        }
    });

    function useEditor() {
        inquirer.prompt([
            {
                type: 'editor', name: 'filesEditor',
                default: `
            {
                "texts": [
                    {
                        "text": "string",
                        "className"?: "string",
                        "x"?: "string | number",
                        "y"?: "string | number",
                    }
                ],
                "options": {
                    "style"?: "string",
                    "outImage": "string",
                    "imagePath"?: "string",
                    "width": "string | number",
                    "height": "string | number",
                }
            }
            `
            }
        ]).then(answers => {
            console.log(answers.filesEditor);
        })
    };

    function useCommandLine() {
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
            console.log(answers)
        })
    };

    function useConfigFile() {
        const configFile = fs.readFileSync(resolve(process.cwd(), 'configImage.json'), 'utf8');

        console.log(configFile)
    };
}

prompt();