/**
 * Copyright © 2014-2019 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';
import {
    windowSampleConfig,
    activitySampleConfig,
    exeSampleConfig,
    serviceWindowSampleConfig,
    nodeSampleConfig
} from './assets/sampleConfigs';

import {
    WINDOW_LABEL,
    ACTIVITY_LABEL,
    EXE_LABEL,
    SERVICE_WINDOW_LABEL,
    NODE_LABEL,
    GENERATE_WINDOW_CONFIGURATION,
    GENERATE_ACTIVITY_CONFIGURATION,
    GENERATE_EXE_CONFIGURATION,
    GENERATE_SERVICE_WINDOW_CONFIGURATION,
    GENERATE_NODE_CONFIGURATION,
    DEPLOY_COMMAND,
    SHOW_ERRORS_COMMAND,
    SHOW_VALID_OPTIONS_COMMAND,
    DEPLOY_LABEL,
    STATUS_BAR_ITEM_INVALID_TEXT,
    STATUS_BAR_ITEM_VALID_TEXT,
    EXTENSION_NAME,
    ENABLE_THEMES_VALIDATION_OPTION,
    UNDERLINE_ERRORS_OPTION
} from './constants';
import configGenerator from './configGenerator';
import commandsManager from './commandsManager';
import { basename } from 'path';
import errorPointer from './errorPointer';
import { CompletionProvider } from './completionProvider';
import { Validator } from './validator/types';
import { ValidatorComposer } from './validator/validatorComposer';
import { ApplicationConfigValidator } from './validator/appConfigValidator';
import { ThemesConfigValidator } from './validator/themesConfigValidator';
import ajv = require('ajv');

let currentError: { message: string, underLineMessage?: string };
let statusBarItem: vscode.StatusBarItem;
let extensionSettings: vscode.WorkspaceConfiguration;
let diagnosticCollection: vscode.DiagnosticCollection;
let validator: Validator;

const completionProviderFileFilters = [
    { scheme: 'file', language: 'json' }
];

export function activate(context: vscode.ExtensionContext) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    extensionSettings = vscode.workspace.getConfiguration(EXTENSION_NAME);
    diagnosticCollection = vscode.languages.createDiagnosticCollection('Glue42');

    const validatorFactories: Array<(a: ajv.Ajv) => Validator> = [(...a) => new ApplicationConfigValidator(...a)];
    const themesValidationEnabled = extensionSettings.get<boolean>(ENABLE_THEMES_VALIDATION_OPTION);
    if (themesValidationEnabled) {
        validatorFactories.push((...a) => new ThemesConfigValidator(...a));
    }

    validator = new ValidatorComposer(validatorFactories);

    commandsManager.registerCommand(SHOW_VALID_OPTIONS_COMMAND, () => {
        vscode.window.showInformationMessage(`You can deploy your configuration to "${configGenerator.location}"`,
            DEPLOY_LABEL).then((value) => {
                if (value === DEPLOY_LABEL) {
                    vscode.commands.executeCommand(DEPLOY_COMMAND);
                }
            });
    });

    commandsManager.registerCommand(SHOW_ERRORS_COMMAND, () => {
        vscode.window.showInformationMessage("You can use one of the following templates: ",
            WINDOW_LABEL, ACTIVITY_LABEL, EXE_LABEL, SERVICE_WINDOW_LABEL, NODE_LABEL).then((value) => {
                switch (value) {
                    case WINDOW_LABEL:
                        vscode.commands.executeCommand(GENERATE_WINDOW_CONFIGURATION);
                        break;
                    case ACTIVITY_LABEL:
                        vscode.commands.executeCommand(GENERATE_ACTIVITY_CONFIGURATION);
                        break;
                    case EXE_LABEL:
                        vscode.commands.executeCommand(GENERATE_EXE_CONFIGURATION);
                        break;
                    case SERVICE_WINDOW_LABEL:
                        vscode.commands.executeCommand(GENERATE_SERVICE_WINDOW_CONFIGURATION);
                        break;
                    case NODE_LABEL:
                        vscode.commands.executeCommand(GENERATE_NODE_CONFIGURATION);
                        break;
                }
            });

        vscode.window.showErrorMessage(currentError.message || "Unable to determine the error");
    });

    commandsManager.registerTextEditorCommand(GENERATE_WINDOW_CONFIGURATION, (textEditor, edit) => {
        configGenerator.generate(windowSampleConfig, edit, textEditor);
    });

    commandsManager.registerTextEditorCommand(GENERATE_ACTIVITY_CONFIGURATION, (textEditor, edit) => {
        configGenerator.generate(activitySampleConfig, edit, textEditor);
    });

    commandsManager.registerTextEditorCommand(GENERATE_EXE_CONFIGURATION, (textEditor, edit) => {
        configGenerator.generate(exeSampleConfig, edit, textEditor);
    });

    commandsManager.registerTextEditorCommand(GENERATE_SERVICE_WINDOW_CONFIGURATION, (textEditor, edit) => {
        configGenerator.generate(serviceWindowSampleConfig, edit, textEditor);
    });

    commandsManager.registerTextEditorCommand(GENERATE_NODE_CONFIGURATION, (textEditor, edit) => {
        configGenerator.generate(nodeSampleConfig, edit, textEditor);
    });

    commandsManager.registerTextEditorCommand(DEPLOY_COMMAND, (textEditor, edit) => {
        configGenerator.deploy(textEditor.document);
    });

    vscode.languages.registerCompletionItemProvider(completionProviderFileFilters, new CompletionProvider(validator));

    try {
        validator.init();
        const unsub = vscode.workspace.onDidSaveTextDocument((d) => {
            triggerValidation(d);
        });

        const unsubOnOpen = vscode.workspace.onDidOpenTextDocument((d) => {
            triggerValidation(d);
        });

        const activeTextEditorChange = vscode.window.onDidChangeActiveTextEditor((txtEditor?: vscode.TextEditor) => {
            triggerValidation(txtEditor ? txtEditor.document : undefined);
        });

        context.subscriptions.push(unsub);
        context.subscriptions.push(unsubOnOpen);
        context.subscriptions.push(activeTextEditorChange);

    } catch (error) {
        // The state is absolutely invalid and nothing can work properly
        statusBarItem.tooltip = "Glue configuration validator is experiencing initialization problems.";
        statusBarItem.show();
    }

    commandsManager.dispose(context);
}

function triggerValidation(document?: vscode.TextDocument) {
    const fileExtensions = document ? basename(document.fileName).split('.') : [];
    const containsJsonAndGit = document && fileExtensions.indexOf("git") !== -1 && fileExtensions.indexOf("json") !== -1;
    if (document && (document.languageId === "json" || document.languageId === "jsonc")) {
        const validationResult = validator.validate(document);
        const documentText = document.getText();
        statusBarItem.tooltip = "Click here for available actions";

        if (!validationResult.isValid) {
            currentError = validationResult.error || { message: "Unable to determine the error" };
            statusBarItem.text = STATUS_BAR_ITEM_INVALID_TEXT;
            statusBarItem.command = SHOW_ERRORS_COMMAND;
            if (validationResult.error.dataPath) {
                const range = errorPointer.point(validationResult.error.dataPath, documentText);
                updateDiagnostics(document, range, currentError.underLineMessage || "Unable to determine the error");
            }
        } else {
            statusBarItem.text = STATUS_BAR_ITEM_VALID_TEXT;
            statusBarItem.command = SHOW_VALID_OPTIONS_COMMAND;

            updateDiagnostics(document);
        }

        statusBarItem.show();
    } else if (!containsJsonAndGit) {
        console.log(basename((document as any).fileName));
        statusBarItem.hide();
    }

}

function updateDiagnostics(document: vscode.TextDocument, underlineRange?: vscode.Range, errorMessage?: string): void {
    const underlineErrors = extensionSettings.get<boolean>(UNDERLINE_ERRORS_OPTION);

    if (document && errorMessage && underlineRange && underlineErrors) {
        diagnosticCollection.set(document.uri, [{
            code: '',
            message: errorMessage,
            range: underlineRange,
            severity: vscode.DiagnosticSeverity.Error,
            source: 'Glue42 configuration validator',
            relatedInformation: []
        }]);
    } else if (document && (!errorMessage || !underlineRange || !underlineErrors)) {
        diagnosticCollection.delete(document.uri);
    } else {
        diagnosticCollection.clear();
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
    statusBarItem.dispose();
    diagnosticCollection.dispose();
}