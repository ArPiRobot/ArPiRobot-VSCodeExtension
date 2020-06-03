import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip = require('adm-zip')
import * as contents from './contents';
import { OpenDialogOptions, Uri, window } from "vscode";
import * as cp from 'child_process';
import * as tmp from 'tmp';

let sbitem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
	let createProjectCommand = vscode.commands.registerCommand('arpirobot.createProject', createProject);
	context.subscriptions.push(createProjectCommand);

	let updateDevEnvironmentCommand = vscode.commands.registerCommand('arpirobot.updateDevEnv', updateDevEnv);
	context.subscriptions.push(updateDevEnvironmentCommand);

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
}

export function deactivate() {

}


const projectFolderSelectOpts: OpenDialogOptions = {
	canSelectFiles: false,
	canSelectFolders: true,
	canSelectMany: false
};

const projectNameInputboxOpts: vscode.InputBoxOptions = {
	placeHolder: "Project Name",
	prompt: "Choose the Project Name. This will also be the name of the Project Folder."
};

let selectParentFolderItem: vscode.QuickPickItem = {
	label: "Choose Parent Folder",
	description: "Click here to select which directory the Project Folder should be created in."
};
let cancelItem: vscode.QuickPickItem = {
	label: "Cancel"
};


const createProject = async() => {

	// Show input box asking for project name
	let projName = await window.showInputBox(projectNameInputboxOpts);

	if(!projName){
		window.showInformationMessage("Canceled project creation.");
		return;
	}

	// Show quick pick dialog with a single "Choose Parent Folder" button and a description
	
	let choice = await window.showQuickPick([selectParentFolderItem, cancelItem]);
	
	if(choice === cancelItem){
		window.showInformationMessage("Canceled project creation.");
		return;
	}
	

	let projFolderChoice = await window.showOpenDialog(projectFolderSelectOpts);

	if(!projFolderChoice || !projFolderChoice[0]){
		window.showInformationMessage("No parent folder selected. Canceled project creation.");
		return;
	}

	let projPath = projFolderChoice[0].fsPath;
	window.showInformationMessage(`Will create in ${projPath}`);

	var filePath = path.join(projPath, projName);

	if(fs.existsSync(filePath)){
		vscode.window.showErrorMessage("A folder with that project name already exists in the selected directory!");
		return;
	}

	// Create folders
	fs.mkdirSync(filePath);
	fs.mkdirSync(path.join(filePath, ".vscode"));

	// Write files
	fs.writeFileSync(path.join(filePath, "robot.py"), contents.robot_py);
	fs.writeFileSync(path.join(filePath, "robot_objects.py"), contents.robot_objects_py);
	fs.writeFileSync(path.join(filePath, "robot_actions.py"), contents.robot_actions_py);
	fs.writeFileSync(path.join(filePath, "main.sh"), contents.main_sh);
	fs.writeFileSync(path.join(filePath, "main.py"), contents.main_py);
	fs.writeFileSync(path.join(filePath, ".vscode", "settings.json"), contents.vscode_settings_json);

	// Open created project
	vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(filePath));
};

const updateSelectOptions: OpenDialogOptions = {
	canSelectFiles: true,
	canSelectFolders: false,
	canSelectMany: false,
	filters: {
		'Zip Files': ['zip']
	}
};

const updateDevEnv = async() => {

	// Make sure a python interpreter is selected
	if(!vscode.workspace.getConfiguration().has("python.pythonPath")){
		window.showErrorMessage("Open a .py file and select a python interpreter first.");
		return;
	}

	let pythonPath: string | undefined = vscode.workspace.getConfiguration().get("python.pythonPath");
	let versionName = "UNKNOWN VERSION";

	// If the version can't be determined this is an invalid interpreter
	cp.exec(pythonPath + ' --version', (err, stdout, stderr) => {
		if (err) {
			// Could not execute command. Invalid python interpreter!
			window.showErrorMessage("Open a .py file and select a python interpreter first.");
		}
		// Python prints to stderr until 3.4
		if(stdout.length === 0){
			versionName = stderr;
		}else{
			versionName = stdout;
		}

		// Verify that this is the right python install
		window.showWarningMessage("Will install ArPiRobot update for \"" + versionName + "\" (" + pythonPath + "). Continue?", "Yes", "No").then(res => {
			if(res === "Yes"){
				startUpdate(pythonPath!);
			}else{
				window.showInformationMessage("ArPiRobot update canceled.");
			}
		});

	});
};

const startUpdate = async(pythonPath: string) => {
	window.showOpenDialog(updateSelectOptions).then(res => {
		if(res && res[0]){
			let updatePath = res[0].fsPath;

			window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Installing ArPiRobot Update",
				cancellable: false
			}, (progress, token) => {
				var p = new Promise((resolve, reject) => {

					// Create a directory to extract the update zip to
					progress.report({message: "Preparing working directory"});		
					let mainExtractDir = "";
					try{
						let tempObj = tmp.dirSync({prefix: "ArPiRobotUpdate_"});
						mainExtractDir = tempObj.name;
					}catch(e){
						console.log("Error: " + e);
						reject("Failed to create working directory.");
					}

					// Extract zip
					progress.report({message: "Extracting update zip"});
					
					try{
						let zip = new AdmZip(updatePath);
						zip.extractAllTo(mainExtractDir, true);
					}catch(e){
						console.log("Error: " + e);
						reject("Failed to extract update zip.");
					}

					// Extract the pythonlib zip
					progress.report({message: "Extracting pythonlib zip"});
					let pyLibExtractDir = path.join(mainExtractDir, "pythonlib");
					try{
						let pylibZipPath = path.join(mainExtractDir, "pythonlib.zip");
						if(!fs.existsSync(pylibZipPath)){
							reject("Python library zip was not found in the update zip!");
						}

						// Prepare extract directory
						if(fs.existsSync(pyLibExtractDir)){
							fs.rmdirSync(pyLibExtractDir);
						}
						fs.mkdirSync(pyLibExtractDir);
						
						// Extract zip
						let pythonLibZip = new AdmZip(pylibZipPath);
						pythonLibZip.extractAllTo(pyLibExtractDir, true);
						
					}catch(e){
						console.log("Error: " + e);
						reject("Unable to extract pythonlib zip!");
					}

					// Run install commands

					// Run pip to install dependencies
					progress.report({message: "Installing pythonlib dependencies"});
					cp.exec(pythonPath + ' -m pip install -r "' + path.join(pyLibExtractDir, "requirements.txt") + '"', (err, stdout, stderr) => {
						if(err){
							console.log("Error: " + err);
							reject("Unable to execute pip install deps command. Make sure the selected python version is supported and make sure you have internet access.");
						}
						progress.report({message: "Installing pythonlib"});
						cp.exec(pythonPath + ' -m pip install "' + pyLibExtractDir + '"', (err, stdout, stderr) => {
							if(err){
								console.log("Error: " + err);
								reject("Unable to install python library. Make sure the selected python version is supported.");
							}
							progress.report({message: "Done"});
							// Finished install
							resolve();
						});
					});
				});
				p.then(value => {
					window.showInformationMessage("ArPiRobot update installed successfully.");

					window.showWarningMessage("Need to reload window for changes to take effect. Reload now?", "Yes", "No").then(res => {
						if(res === "Yes"){
							vscode.commands.executeCommand("workbench.action.reloadWindow");
						}
					});
				});
				p.catch(value => {
					window.showErrorMessage("Failed to install ArPiRobot update: " + value);
				});
				return p;
			});
		}
	});
};
