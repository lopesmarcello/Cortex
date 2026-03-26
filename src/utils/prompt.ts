import inquirer from 'inquirer';

export interface PromptOptions {
  message: string;
  choices?: string[];
  default?: string | boolean;
  validate?: (value: string) => boolean | string;
  checkbox?: boolean;
}

export async function prompt(options: PromptOptions): Promise<string | string[] | boolean> {
  if (options.checkbox) {
    const answer = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selected',
        message: options.message,
        choices: options.choices || [],
      },
    ]);
    return answer.selected;
  }

  if (options.choices) {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: options.message,
        choices: options.choices,
        default: options.default,
      },
    ]);
    return answer.selected;
  }

  if (typeof options.default === 'boolean') {
    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: options.message,
        default: options.default,
      },
    ]);
    return answer.confirmed;
  }

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message: options.message,
      default: options.default as string,
      validate: options.validate,
    },
  ]);
  return answer.value;
}
