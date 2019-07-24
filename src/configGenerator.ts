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
import { join, basename, normalize } from 'path';
import { EXTENSION_NAME } from './constants';
import json5 = require('json5');
const assistant = require("fs-assistant").default;

class ConfigurationGenerator {

    public get location(): string {
        const extensionSettings = vscode.workspace.getConfiguration(EXTENSION_NAME);
        const glueDeploymentPath = extensionSettings.get<string>("glueDeploymentPath");
        return normalize(this.expandEnvVarInPath(glueDeploymentPath));
    }

    public generate(sampleConfig: object, edit: vscode.TextEditorEdit, textEditor: vscode.TextEditor): void {

        const extensionSettings = vscode.workspace.getConfiguration(EXTENSION_NAME);
        const shouldDelete = extensionSettings.get<boolean>("overwriteContents");

        if (shouldDelete) {
            this.deleteContents(edit, textEditor.document.lineCount);
        }

        this.insertTemplateInDocument(sampleConfig, edit, textEditor);
    }

    public deploy(doc: vscode.TextDocument): void {
        const sourceFilePath = doc.uri.fsPath;
        const extensionSettings = vscode.workspace.getConfiguration(EXTENSION_NAME);
        const glueDeploymentPath = extensionSettings.get<string>("glueDeploymentPath");
        const destinationFilePath = join(this.expandEnvVarInPath(glueDeploymentPath), basename(doc.fileName));

        return assistant.copyFile(sourceFilePath, destinationFilePath);
    }

    private getLastLineRange(lineCount: number): vscode.Range {
        const startLine = lineCount === 1 ? 1 : lineCount - 1;
        const editorStart = new vscode.Position(startLine, 0);
        const editorEnd = new vscode.Position(lineCount, 0);
        return new vscode.Range(editorStart, editorEnd);
    }

    private expandEnvVarInPath(path?: string) {
        if (path === undefined) {
            path = "%LOCALAPPDATA%/Tick42/GlueDesktop/config/apps";
        }
        return path.replace(/%([^%]+)%/g, (_, n) => global.process.env[n] || './');
    }

    private insertTemplateInDocument(template: object, edit: vscode.TextEditorEdit, textEditor: vscode.TextEditor): void {
        const location = new vscode.Position(0, 0);
        let contentsToInsert = template;
        try {
            const contentsAsObject = json5.parse(textEditor.document.getText());
            if (Array.isArray(contentsAsObject)) {

                if (Array.isArray(template)) {
                    contentsAsObject.push(...template);
                } else {
                    contentsAsObject.push(template);
                }

                contentsToInsert = contentsAsObject;
                this.deleteContents(edit, textEditor.document.lineCount);
                textEditor.revealRange(this.getLastLineRange(textEditor.document.lineCount), vscode.TextEditorRevealType.AtTop);
            }
        } catch (error) { }
        edit.insert(location, JSON.stringify(contentsToInsert, undefined, textEditor.options.tabSize));
    }

    private deleteContents(edit: vscode.TextEditorEdit, lineCount: number): void {
        const editorStart = new vscode.Position(0, 0);
        const editorEnd = new vscode.Position(lineCount, 0);
        const range = new vscode.Range(editorStart, editorEnd);

        edit.delete(range);
    }

}

export default new ConfigurationGenerator();