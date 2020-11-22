#! /usr/bin/env node

const { spawn } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const shell = require('shelljs');
const path = require('path');
const configFiles = ['nodejs', 'nodejs-babel', 'nodejs-typescript'];
const packageManager = ['npm', 'yarn'];

const nodeExpressRepoURL =
    'https://github.com/Jayvirrathi/node-express-api-starter.git';
const nodeExpressBabelRepoURL =
    'https://github.com/Jayvirrathi/node-express-es6-api-starter.git';
const nodeExpressTypeScriptRepoURL =
    'https://github.com/Jayvirrathi/node-express-typescript-api-starter.git';

let repoURL;

(async () => {
    clear();

    shell.echo(
        `${chalk.hex('#00acee')(
            figlet.textSync('NODE CLI', { horizontalLayout: 'fitted' })
        )}`
    );

    shell.echo(
        `${chalk.hex('#00acee')(
            'Welcome to NODE CLI! A CLI for Starter Projects'
        )}`
    );

    const { framework } = await inquirer.prompt([
        {
            type: 'list',
            message: `${chalk.hex('#00acee')(
                "Pick the framework you're using:"
            )}`,
            name: 'framework',
            choices: configFiles,
        },
    ]);

    shell.echo(`${chalk.hex('#00acee')('framework:', framework)}`);

    if (framework === 'nodejs') {
        repoURL = nodeExpressRepoURL;
    } else if (framework === 'nodejs-babel') {
        repoURL = nodeExpressBabelRepoURL;
    } else if (framework === 'nodejs-typescript') {
        repoURL = nodeExpressTypeScriptRepoURL;
    } else {
        repoURL = nodeExpressRepoURL;
    }

    const { name } = await inquirer.prompt([
        {
            type: 'input',
            message: `${chalk.hex('#00acee')('Pick the name:')}`,
            name: 'name',
            validate: function (name) {
                let valid = !(name == '');
                return (
                    valid ||
                    `${chalk.hex('#00acee')('Please enter a valid name')}`
                );
            },
        },
    ]);

    const { tool } = await inquirer.prompt([
        {
            type: 'list',
            choices: packageManager,
            message: `${chalk.hex('#00acee')('Pick the package manager:')}`,
            name: 'tool',
        },
    ]);

    runCommand('git', ['clone', repoURL, name])
        .then(() => {
            return runCommand('rm', ['-rf', `${name}/.git`]);
        })
        .then(() => {
            shell.echo(
                `${chalk.hex('#00acee')('Installing dependencies... ')}`
            );
            return runCommand(
                tool == 'yarn' ? 'yarn.cmd' : 'npm.cmd',
                ['install'],
                {
                    cwd: process.cwd() + '/' + name,
                }
            );
        })
        .then(() => {
            shell.echo(`${chalk.hex('#00acee')('Done! 🏁')}`);
            shell.echo(`${chalk.green('')}`);
            shell.echo(`${chalk.hex('#00acee')('To get started:')}`);
            shell.echo(`${chalk.hex('#00acee')('cd', name)}`);
            shell.echo(
                `${chalk.hex('#00acee')(
                    tool == 'yarn' ? 'yarn dev' : 'npm run dev'
                )}`
            );
        });

    function runCommand(command, args, options = undefined) {
        const spawned = spawn(command, args, options);

        return new Promise((resolve) => {
            spawned.stdout.on('data', (data) => {
                shell.echo(`${chalk.hex('#00acee')(data.toString())}`);
            });

            spawned.stderr.on('data', (data) => {
                shell.echo(`${chalk.hex('#00acee')(data.toString())}`);
            });

            spawned.on('close', () => {
                resolve();
            });
        });
    }
})();
