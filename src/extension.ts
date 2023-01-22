/*
 * Copyright 2020 Marcus Behel
 * 
 * This file is part of ArPiRobot-VSCodeExtension.
 * 
 * ArPiRobot-VSCodeExtension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * ArPiRobot-VSCodeExtension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with ArPiRobot-VSCodeExtension.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as util from "util";
const fse = require('fs-extra');
import { OpenDialogOptions, Uri, window } from "vscode";

let sbitem: vscode.StatusBarItem;
let logOutput = vscode.window.createOutputChannel("ArPiRobot");
let templatePath = "";

export function activate(context: vscode.ExtensionContext) {
	let createProjectCommand = vscode.commands.registerCommand('arpirobot.createProject', createProject);
	context.subscriptions.push(createProjectCommand);

	let openArPiRobotCommands = vscode.commands.registerCommand('arpirobot.openArPiRobotCommands', () => {
		vscode.commands.executeCommand('workbench.action.quickOpen', '>ArPiRobot');
	});
	context.subscriptions.push(openArPiRobotCommands);

	// 101 is enough priority that it is to the left of the python status bar item
	sbitem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 101);
	context.subscriptions.push(sbitem);

	sbitem.command = 'arpirobot.openArPiRobotCommands';
	sbitem.text = "ArPiRobot";
	sbitem.show();

	templatePath = __dirname + "/templates";
	if(!fs.existsSync(templatePath)){
		templatePath = __dirname + "/../templates"; // Work when debugging via vscode
	}

	// Register handler for changes to workspace folders
	vscode.workspace.onDidChangeWorkspaceFolders(handleWorkspaceFolderChange)

	// Some folders may already be open. Need to generate env file for these too
	if(vscode.workspace.workspaceFolders){
		for(let folder of vscode.workspace.workspaceFolders){
			folderOpened(folder)
		}
	}
}

export function deactivate() {

}

export async function createProject(){
	let homedir;
	if(process.platform == "win32"){
		homedir = process.env.UserProfile;
	}else{
		homedir = process.env.HOME;
	}
	if(homedir == undefined){
		homedir = "";
	}
	if(!fs.existsSync(templatePath)){
		return;
	}

	let dirs = fs.readdirSync(templatePath).filter(f => fs.statSync(path.join(templatePath, f)).isDirectory());
	let opts = [];
	for(let d of dirs){
		opts.push({
			label: path.basename(d)
		});
	}
	let choice = await window.showQuickPick(opts, {placeHolder: "Select Template", canPickMany: false});
	if(choice != undefined){
		let templateFolder = path.join(templatePath, choice.label);
		if(!fs.existsSync(templatePath)){
			window.showErrorMessage("The selected template does not exits.");
			return;
		}
		let projName = await window.showInputBox({
			prompt: "Project Name"
		});
	
		if(!projName){
			window.showErrorMessage("Cannot create a project with no name.");
			return;
		}
	
		let parentFolderChoice = await window.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: "Select Parent Folder"
		});
	
		if(!parentFolderChoice || !parentFolderChoice[0]){
			window.showErrorMessage("No parent folder selected. Canceled project creation.");
			return;
		}
	
		let projPath = path.join(parentFolderChoice[0].fsPath, projName);
	
		if(fs.existsSync(projPath)){
			window.showErrorMessage("A project with that name already exists in the selected folder.");
			return;
		}
	
		// Create project folder
		fs.mkdirSync(projPath);
	
		// Copy files from template to proj folder
		fse.copySync(templateFolder, projPath);

		// Open folder
		vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(projPath));
	}
}

export function handleWorkspaceFolderChange(event: vscode.WorkspaceFoldersChangeEvent){
	for(let folder of event.added){
		folderOpened(folder);
	}
}

export function folderOpened(folder: vscode.WorkspaceFolder){
	// If new folder has arpirobot-proj.json, it is an arpirobot project
	// If src/main.py exists, generate an env file with the required pythonpath
	// addition for the current dev system
	if(!fs.existsSync(folder.uri.fsPath + "/arpirobot-proj.json")){
		console.log("A");
		return; // Not ArPiRobot project
	}
	if(!fs.existsSync(folder.uri.fsPath + "/src/main.py")){
		console.log("B");
		return; // Not python project
	}
	console.log("C");

	// This is a python arpirobot project. Generate an env file
	var contents = "";
	if(process.platform === "win32"){
		contents = "PYTHONPATH=${USERPROFILE}/.arpirobot/corelib/python_bindings;${PYTHONPATH}";
	}else{
		contents = "PYTHONPATH=${HOME}/.arpirobot/corelib/python_bindings:${PYTHONPATH}";
	}
	fs.writeFileSync(folder.uri.fsPath + "/.env", contents);
}
