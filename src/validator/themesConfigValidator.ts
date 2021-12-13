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
import * as json5 from "json5";
import * as ajv from "ajv";
import errorTextComposer from "../errorTextComposer";
import { ValidationSummary, ValidationError, Validator } from './types';
import assetProvider from '../assetProvider';

export class ThemesConfigValidator implements Validator {
    private readonly ajvVal: ajv.Ajv;
    private readonly HighLevelThemeSchemaKey = "highLevelTheme";
    private readonly ThemesSchemakey = "themesSchema";

    constructor(ajvVal?: ajv.Ajv) {
        const withOutsideInstance = ajvVal !== undefined && ajvVal !== null;
        this.ajvVal = ajvVal || new ajv({ useDefaults: true, meta: true, jsonPointers: true });

        if (!withOutsideInstance) {
            this.ajvVal.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        }
    }

    public get priorityIndex() {
        return 0;
    }

    public init() {
        const themesHighLevelSchema = assetProvider.getHighLevelThemeSchema();
        const themesSchema = assetProvider.getThemeSchema();
        this.ajvVal.addSchema(JSON.parse(themesHighLevelSchema), this.HighLevelThemeSchemaKey);
        this.ajvVal.addSchema(JSON.parse(themesSchema), this.ThemesSchemakey);
    }

    public isThemeConfig(text: string): boolean {
        let parsedText = json5.parse(text);
        if (!Array.isArray(parsedText)) {
            parsedText = [parsedText];
        }

        const isValid: boolean = this.ajvVal.validate(this.HighLevelThemeSchemaKey, parsedText) as boolean;
        return isValid;
    }

    public validate(document: vscode.TextDocument): ValidationSummary {
        const validationResult = this.validateTextInEditor(document.getText());

        return validationResult;
    }

    private validateTextInEditor(text: string): ValidationSummary {
        try {
            let parsedText = json5.parse(text);
            if (!Array.isArray(parsedText)) {
                parsedText = [parsedText];
            }

            if (this.isThemeConfig(text)) {
                return this.validateThemesConfig(parsedText);
            }

            return {
                isValid: false,
                error: { message: "" },
                isApplicationResult: false,
                isThemeResult: true
            };

        } catch (error) {
            return {
                isValid: false,
                error: { message: "Invalid JSON" },
                isApplicationResult: false,
                isThemeResult: true
            };
        }
    }

    private validateThemesConfig(parsedText: any): ValidationSummary {
        const isValid: boolean = this.ajvVal.validate(this.ThemesSchemakey, parsedText) as boolean;
        const errors = this.ajvVal.errors ? this.ajvVal.errors.map((a) => a) : [];

        if (!isValid) {
            const error: ValidationError = errors && errors[0] ? errorTextComposer.compose(errors[0]) : { message: "Unknown error" };
            const summary = {
                isValid,
                error,
                isApplicationResult: false,
                isThemeResult: true
            };
            return summary;
        }

        return {
            isValid: true, error: { message: "" },
            isApplicationResult: false,
            isThemeResult: true
        };
    }
}