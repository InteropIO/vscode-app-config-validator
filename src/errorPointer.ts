/**
 * Copyright © 2014-2019 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as parse from "json-to-ast";
import * as vscode from "vscode";
import * as jsonFixer from "json-fixer";

class ErrorPointer {
    private readonly settings: parse.Options = { loc: true };

    public point(errorPath: string, json: string): vscode.Range {
        json = jsonFixer(json).data;
        if (!Array.isArray(JSON.parse(json))) {
            json = "[" + json + "]";
        }
        const jsonTree = parse(json, this.settings);
        const pathComponents = errorPath.split("/").filter(pc => pc);

        return this.nodeLocationToVsCodeRange(this.findPathLocation(pathComponents, jsonTree));
    }

    private findPathLocation(errorPath: string[], jsonTree: parse.ASTNode): parse.Location {

        let currentTree = jsonTree;

        errorPath.forEach((pathElement) => {
            const jsonNode: parse.ASTNode = this.traverseByPathElement(pathElement, currentTree);

            currentTree = jsonNode;
        });

        return currentTree.loc as parse.Location;
    }

    private traverseByPathElement(pathElement: string, currentTree: parse.ASTNode): parse.ASTNode {
        if (currentTree.type === "Object") {
            const currentTreeChild = (currentTree as parse.ObjectNode).children.find(c => c.key.value === pathElement);

            if (!currentTreeChild) {
                throw new Error("Could not traverse " + pathElement + " " + JSON.stringify(currentTree));
            }

            if (currentTreeChild.type === "Property") {
                return currentTreeChild.value;
            }

            return currentTreeChild;
        }

        if (currentTree.type === "Array") {
            const currentTreeChild = (currentTree as parse.ObjectNode).children[parseInt(pathElement)];

            if (!currentTreeChild) {
                throw new Error("Could not traverse " + pathElement + " " + JSON.stringify(currentTree));
            }

            return currentTreeChild;
        }

        if (currentTree.type === "Property") {
            return (currentTree as parse.PropertyNode).value;
        }

        return currentTree;
    }

    private nodeLocationToVsCodeRange(nodeLocation: parse.Location): vscode.Range {
        return new vscode.Range(nodeLocation.start.line - 1,
            nodeLocation.start.column - 1,
            nodeLocation.end.line - 1,
            nodeLocation.end.column - 1);
    }
}

export default new ErrorPointer();