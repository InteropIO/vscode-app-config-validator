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
import glueAppSchema from './assets/glueAppSchema';
import * as json5 from "json5";
import * as ajv from "ajv";
import errorTextComposer from "./errorTextComposer";

class ConfigurationValidator {
    private readonly ajvVal: ajv.Ajv;

    constructor() {
        this.ajvVal = new ajv({ useDefaults: true });
        this.ajvVal.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        this.ajvVal.addSchema(JSON.parse(JSON.stringify(glueAppSchema)), "appSchema");
    }

    public onChange(document: vscode.TextDocument) {
        const validationResult = this.validateTextInEditor(document.getText());

        return validationResult;
    }

    private validateTextInEditor(text: string): { isValid: boolean, error: { message: string } } {
        try {
            let parsedText = json5.parse(text);
            if (!Array.isArray(parsedText)) {
                parsedText = [parsedText];
            }
            const ajvResult = this.ajvVal.validate("appSchema", parsedText);

            return {
                isValid: ajvResult as boolean,
                error: this.ajvVal.errors ? errorTextComposer.compose(this.ajvVal.errors[0]) : { message: "Unknown error" }
            };
        } catch (error) {
            return {
                isValid: false,
                error: { message: "Invalid JSON" }
            };
        }
    }
}

export default new ConfigurationValidator();