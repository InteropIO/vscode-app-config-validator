/**
 * Copyright © 2014-2020 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';
import { ValidationSummary, Validator } from './types';
import ajv = require('ajv');

export class ValidatorComposer implements Validator {
    private readonly validators: Validator[];
    private readonly ajvVal: ajv.Ajv;

    constructor(validatorConstructors: Array<(ajvInstance: ajv.Ajv) => Validator>) {
        this.ajvVal = new ajv({ useDefaults: "empty", meta: true, jsonPointers: true, allErrors: true });
        this.ajvVal.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        require("ajv-keywords")(this.ajvVal, ["transform"]);
        if (validatorConstructors.length === 0) {
            throw new Error("The validator composer requires at least one validator");
        }

        this.validators = validatorConstructors.map((vc) => vc(this.ajvVal)).sort((a, b) => a.priorityIndex - b.priorityIndex);
    }

    public get priorityIndex() {
        return this.validators[this.validators.length - 1].priorityIndex;
    }

    public init() {
        this.validators.forEach((v) => {
            v.init();
        });
    }

    public isThemeConfig(text: string): boolean {
        return this.validators.some((v) => v.isThemeConfig(text));
    }

    public validate(document: vscode.TextDocument): ValidationSummary {
        const results = this.validators.map((v) => v.validate(document));

        const firstPositiveResult = results.find(r => r.isValid);

        if (!firstPositiveResult && this.isThemeConfig(document.getText())) {
            const themesResult = results.find(r => r.isThemeResult);

            return themesResult || results[results.length - 1];
        }
        return firstPositiveResult || results[results.length - 1];
    }
}