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

class CommandsManager {
    private disposables: vscode.Disposable[] = [];

    public registerCommand(name: string, callback: (...params: any[]) => void) {
        this.disposables.push(vscode.commands.registerCommand(name, callback));
    }

    public registerTextEditorCommand(name: string, callback: (tEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, ...params: any[]) => void) {
        this.disposables.push(vscode.commands.registerTextEditorCommand(name, callback));
    }

    public dispose(context: vscode.ExtensionContext) {
        this.disposables.forEach(d => {
            context.subscriptions.push(d);
        });

        this.disposables = [];
    }
}

export default new CommandsManager();