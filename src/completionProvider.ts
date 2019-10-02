/**
 * Copyright © 2014-2019 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
    CompletionItemProvider,
    TextDocument,
    Position,
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionList,
    CompletionItemKind,
} from "vscode";
import { join } from "path";
import * as parse from "json-to-ast";
import { dereference, bundle } from "json-schema-ref-parser";
import assetProvider from "./assetProvider";
import * as jsonFix from "json-fixer";
import { JSONSchema6 } from "json-schema";
import { get } from "lodash";

export class CompletionProvider implements CompletionItemProvider {

    public provideCompletionItems = async (document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): Promise<CompletionItem[] | CompletionList> => {
        position = new Position((position.line + 1), position.character);

        const strictJsonString = jsonFix(document.getText()).data;
        const jsonTree = parse(strictJsonString, { loc: true });
        const configType: string = this.getConfigType(strictJsonString, position, jsonTree);

        const parsedSchema = await dereference(await bundle(join(__dirname, assetProvider.appSchemaLocation)));
        const schemas = parsedSchema.definitions as any;
        const currSchema = schemas[configType] as any;

        const propertyPath = this.getPropertyPath(position, jsonTree).trim().split("\\").slice(1);

        const schemaFriendlyPropertyPath = propertyPath.reduce((acc, pathSegment, i) => {
            if (i % 2 === 1 && i < propertyPath.length - 1) {
                acc.push("properties");
            }

            if (!pathSegment) {
                return acc;
            }

            return [...acc, pathSegment];
        }, [] as string[]);

        let completionItems = [] as CompletionItem[];

        let currProp = get(currSchema.properties, schemaFriendlyPropertyPath.join("."), currSchema);

        while (!currProp.properties && schemaFriendlyPropertyPath.length > 0) {
            schemaFriendlyPropertyPath.pop();
            currProp = get(currSchema.properties, schemaFriendlyPropertyPath.join("."), currSchema);
        }

        if (currProp && currProp.properties) {
            completionItems = Object.keys(currProp.properties).map(prop => {
                const completionItem = new CompletionItem('"' + prop + '"', CompletionItemKind.Property);
                const { description } = currProp.properties[prop];

                completionItem.documentation = description;
                completionItem.detail = this.resolveCompletionItemDetail(currProp.properties[prop]);

                return completionItem;
            });
        }

        return completionItems;
    }

    private getConfigType(text: string, position: Position, jsonTree: parse.ASTNode) {
        const configAsJson = JSON.parse(text);
        if (!Array.isArray(configAsJson)) {
            return configAsJson.type;
        } else {
            const childIndex = (jsonTree as parse.ArrayNode).children.findIndex(n => this.isPositionInNode(n, position));

            return configAsJson[childIndex].type;
        }
    }

    private getPropertyPath(position: Position, jsonTree: parse.ASTNode): string {
        if (jsonTree.type === "Array") {
            const child = (jsonTree as parse.ArrayNode).children.find(n => this.isPositionInNode(n, position));

            return child ? this.getPropertyPath(position, child) : "";
        } else if (jsonTree.type === "Object") {
            const child = (jsonTree as parse.ObjectNode).children.find(n => this.isPositionInNode(n, position));

            return child ? this.getPropertyPath(position, child) : "";
        } else if (jsonTree.type === "Property") {
            const propertyNode = jsonTree as parse.PropertyNode;

            if (propertyNode.value.type === "Literal") {
                return propertyNode.key.value;
            }

            return propertyNode.key.value + "\\" + this.getPropertyPath(position, propertyNode.value);
        }

        throw new Error("Unexpected node type " + jsonTree.type);
    }

    private isPositionInNode(node: parse.ASTNode, position: Position) {
        if (!node.loc) {
            return false;
        }

        const multiLineResult = node.loc.start.line < position.line && node.loc.end.line > position.line;
        const singleLineStartResult = node.loc.start.line === position.line && node.loc.start.column < position.character;
        const singleLineEndResult = node.loc.end.line === position.line && node.loc.end.column > position.character;

        return multiLineResult || (singleLineStartResult || singleLineEndResult);
    }

    private resolveCompletionItemDetail(schemaProperty: JSONSchema6): string {
        if (schemaProperty.enum) {
            return JSON.stringify(schemaProperty.enum);
        } else if (typeof schemaProperty.type === "string") {
            return schemaProperty.type;
        } else {
            return "no information available";
        }
    }
}
