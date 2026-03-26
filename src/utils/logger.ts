import chalk from 'chalk';
import ora from 'ora';

type SpinnerInstance = ReturnType<typeof ora>;

let currentSpinner: SpinnerInstance | null = null;

export const logger = {
  success: (message: string) => {
    if (currentSpinner) currentSpinner.stop();
    console.log(chalk.green('✔'), message);
    currentSpinner = null;
  },

  error: (message: string) => {
    if (currentSpinner) currentSpinner.stop();
    console.log(chalk.red('✖'), message);
    currentSpinner = null;
  },

  warn: (message: string) => {
    if (currentSpinner) currentSpinner.stop();
    console.log(chalk.yellow('⚠'), message);
    currentSpinner = null;
  },

  info: (message: string) => {
    if (currentSpinner) currentSpinner.stop();
    console.log(chalk.blue('ℹ'), message);
    currentSpinner = null;
  },

  dim: (message: string) => {
    console.log(chalk.dim(message));
  },

  bold: (message: string) => {
    console.log(chalk.bold(message));
  },

  section: (title: string) => {
    console.log();
    console.log(chalk.bold.cyan(title));
  },

  spinner: (message: string) => {
    if (currentSpinner) currentSpinner.stop();
    currentSpinner = ora(message).start();
    return {
      succeed: () => {
        if (currentSpinner) {
          currentSpinner.succeed(message);
          currentSpinner = null;
        }
      },
      fail: () => {
        if (currentSpinner) {
          currentSpinner.fail(message);
          currentSpinner = null;
        }
      },
      stop: () => {
        if (currentSpinner) {
          currentSpinner.stop();
          currentSpinner = null;
        }
      },
    };
  },

  newline: () => {
    console.log();
  },
};
