import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as contents from './contents';
import { OpenDialogOptions, Uri, window } from "vscode";

export function activate(context: vscode.ExtensionContext) {
	let createProjectCommand = vscode.commands.registerCommand('arpirobot.createProject', createProject);
	context.subscriptions.push(createProjectCommand);
}

export function deactivate() {

}


const projectFolderSelectOpts: OpenDialogOptions = {
	canSelectFiles: false,
	canSelectFolders: true,
	canSelectMany: false
};

const projectNameInputboxOpts: vscode.InputBoxOptions = {
	placeHolder: "Project Name"
};

const createProject = async() => {
	window.showOpenDialog(projectFolderSelectOpts).then(res => {
		if(res && res[0]){
			let projPath = res[0].fsPath;
			// Prompt for project name
			window.showInputBox(projectNameInputboxOpts).then(res => {
				if (res){
					let projName = res;
					var filePath = path.join(projPath, projName);
					
					if(fs.existsSync(filePath)){
						vscode.window.showErrorMessage("A folder with that project name already exists!");
						return;
					}

					// Create folders
					fs.mkdirSync(filePath);
					fs.mkdirSync(path.join(filePath, ".vscode"));

					// Write files
					fs.writeFileSync(path.join(filePath, ".vscode", "settings.json"), contents.settings_json);
					fs.writeFileSync(path.join(filePath, "robot.py"), contents.robot_py);

					// Open created project
					vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(filePath))
				}
			});
		}
	});
}
