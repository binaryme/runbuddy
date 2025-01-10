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

    const disposable = vscode.commands.registerCommand('runbuddy.runCommand', async () => {
        const config = vscode.workspace.getConfiguration('runbuddy');
        const commands = config.get('commands') as Array<{ name: string; command: string }>;

        if (!commands || commands.length === 0) {
            const result = await vscode.window.showInformationMessage(
                'No commands configured. Would you like to configure RunBuddy now?',
                'Open Settings',
                'Cancel'
            );
            
            if (result === 'Open Settings') {
                await vscode.commands.executeCommand('workbench.action.openSettings', 'runbuddy');
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
    context.subscriptions.push(disposable);
}

export function deactivate() {}