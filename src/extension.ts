import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    
    statusBarItem.command = 'runbuddy.runCommand';
    statusBarItem.text = '$(play)';
    statusBarItem.tooltip = 'Run Command';
    statusBarItem.show();

    const configureCommand = vscode.commands.registerCommand('runbuddy.configureCommands', async () => {
        const config = vscode.workspace.getConfiguration('runbuddy');
        const commands = config.get('commands') as Array<{ name: string; command: string }> || [];

        const action = await vscode.window.showQuickPick(
            ['Add New Command', 'Edit Existing Command', 'Remove Command'],
            { placeHolder: 'What would you like to do?' }
        );

        if (!action) return;

        if (action === 'Add New Command') {
            const name = await vscode.window.showInputBox({
                placeHolder: 'Enter command name (e.g., Start Dev Server)',
                prompt: 'Enter a descriptive name for your command'
            });
            if (!name) return;

            const command = await vscode.window.showInputBox({
                placeHolder: 'Enter command (e.g., npm run dev)',
                prompt: 'Enter the command to execute'
            });
            if (!command) return;

            commands.push({ name, command });
            await config.update('commands', commands, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Command "${name}" added successfully!`);
        } 
        else if (action === 'Edit Existing Command') {
            if (commands.length === 0) {
                vscode.window.showInformationMessage('No commands to edit.');
                return;
            }

            const commandToEdit = await vscode.window.showQuickPick(
                commands.map(cmd => ({
                    label: cmd.name,
                    description: cmd.command,
                    command: cmd
                })),
                { placeHolder: 'Select command to edit' }
            );
            if (!commandToEdit) return;

            const newName = await vscode.window.showInputBox({
                placeHolder: 'Enter new name',
                prompt: 'Enter new name for the command',
                value: commandToEdit.label
            });
            if (!newName) return;

            const newCommand = await vscode.window.showInputBox({
                placeHolder: 'Enter new command',
                prompt: 'Enter new command to execute',
                value: commandToEdit.description
            });
            if (!newCommand) return;

            const index = commands.findIndex(cmd => cmd.name === commandToEdit.label);
            commands[index] = { name: newName, command: newCommand };
            await config.update('commands', commands, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Command "${newName}" updated successfully!`);
        }
        else if (action === 'Remove Command') {
            if (commands.length === 0) {
                vscode.window.showInformationMessage('No commands to remove.');
                return;
            }

            const commandToRemove = await vscode.window.showQuickPick(
                commands.map(cmd => ({
                    label: cmd.name,
                    description: cmd.command,
                    command: cmd
                })),
                { placeHolder: 'Select command to remove' }
            );
            if (!commandToRemove) return;

            const newCommands = commands.filter(cmd => cmd.name !== commandToRemove.label);
            await config.update('commands', newCommands, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`Command "${commandToRemove.label}" removed successfully!`);
        }
    });

    const runCommand = vscode.commands.registerCommand('runbuddy.runCommand', async () => {
        const config = vscode.workspace.getConfiguration('runbuddy');
        const commands = config.get('commands') as Array<{ name: string; command: string }>;

        if (!commands || commands.length === 0) {
            const result = await vscode.window.showInformationMessage(
                'No commands configured. Would you like to configure RunBuddy now?',
                'Configure Commands',
                'Cancel'
            );
            
            if (result === 'Configure Commands') {
                await vscode.commands.executeCommand('runbuddy.configureCommands');
            }
            return;
        }

        const selectedCommand = await vscode.window.showQuickPick(
            commands.map(cmd => ({
                label: cmd.name,
                description: cmd.command,
                command: cmd
            })),
            {
                placeHolder: 'Select a command to run'
            }
        );

        if (selectedCommand) {
            const terminal = vscode.window.createTerminal(`RunBuddy: ${selectedCommand.label}`);
            terminal.show();
            terminal.sendText(selectedCommand.command.command);
        }
    });

    context.subscriptions.push(statusBarItem);
    context.subscriptions.push(configureCommand);
    context.subscriptions.push(runCommand);
}

export function deactivate() {}