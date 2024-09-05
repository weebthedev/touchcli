#!/usr/bin/env node

import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';
import gradient from 'gradient-string';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const git = simpleGit();

function displayBanner() {
  console.log('\n');
  console.log(
    gradient.pastel.multiline(
      figlet.textSync('touchcli', {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );
  console.log('\n');
}

async function createTouchCLIApp() {
  displayBanner();

  let folderName = process.argv[2];
  
  if (!folderName) {
    folderName = "bot";
    console.log(chalk.yellow('No folder name provided. Using default name "bot".'));
  }

  const repoUrl = 'https://github.com/weebwashere/daisyui-sveltekit-jaqdxv.git';
  const targetPath = path.join(process.cwd(), folderName);

  try {
    console.log(chalk.cyan(`Creating TouchCLI app in ${chalk.bold(folderName)}...\n`));
    
    if (fs.existsSync(targetPath)) {
      console.error(chalk.red(`Error: Directory "${folderName}" already exists. Please choose a different name or delete the existing directory.`));
      process.exit(1);
    }

    const cloneSpinner = ora('Cloning repository...').start();
    await git.clone(repoUrl, targetPath);
    cloneSpinner.succeed('Repository cloned successfully');

    const cleanupSpinner = ora('Cleaning up...').start();
    await fs.remove(path.join(targetPath, '.git'));
    cleanupSpinner.succeed('Cleaned up successfully');

    const initSpinner = ora('Initializing new git repository...').start();
    execSync('git init', { cwd: targetPath });
    initSpinner.succeed('New git repository initialized');

    const installSpinner = ora('Installing dependencies...').start();
    execSync('npm install', { cwd: targetPath, stdio: 'ignore' });
    installSpinner.succeed('Dependencies installed successfully');

    console.log('\n' + chalk.green.bold('TouchCLI app created successfully! 🎉'));
    console.log('\n' + chalk.yellow.bold('To get started:'));
    console.log(chalk.cyan(`  cd ${folderName}`));
    console.log(chalk.cyan('  npm start'));

    console.log('\n' + chalk.magenta('Happy coding! 💻✨'));
  } catch (error) {
    console.error('\n' + chalk.red.bold('An error occurred:'));
    console.error(chalk.red(error.message));
  }
}

createTouchCLIApp();