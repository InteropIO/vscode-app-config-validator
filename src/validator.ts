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
import * as json5 from "json5";
import * as ajv from "ajv";
import errorTextComposer from "./errorTextComposer";
import { ValidationSummary, ValidationError } from './types';
import assetProvider from './assetProvider';

class ConfigurationValidator {
    private readonly ajvVal: ajv.Ajv;
    private readonly AppSchemaEmptyKey = "application-empty.json";

    constructor() {
        this.ajvVal = new ajv({ useDefaults: true, meta: true, jsonPointers: true });
        this.ajvVal.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
    }

    public init() {
        const glueAppSchema = assetProvider.getAppSchema();
        const glueSystemSchema = assetProvider.getSystemSchema();
        this.ajvVal.addSchema(JSON.parse(glueAppSchema), "appSchema");
        this.ajvVal.addSchema(JSON.parse(glueSystemSchema), "systemSchema");

        const appSchemaClone: any = JSON.parse(glueAppSchema);
        appSchemaClone.definitions.application.properties.details = { type: "object" };
        appSchemaClone.$id = `http://glue42.com/gd/${this.AppSchemaEmptyKey}`;
        this.ajvVal.addSchema(appSchemaClone, this.AppSchemaEmptyKey);

        const types: string[] = appSchemaClone.definitions.application.properties.type.enum;
        types.forEach((appType) => {
            const typedSchema = JSON.parse(glueAppSchema) as { [key: string]: any };
            typedSchema.definitions.application.properties.details = typedSchema.definitions[appType];
            typedSchema.$id = `http://glue42.com/gd/application-${appType}.json`;
            this.ajvVal.addSchema(typedSchema, `application-${appType}.json`);
        });
    }

    public onChange(document: vscode.TextDocument): ValidationSummary {
        const validationResult = this.validateTextInEditor(document.getText());

        return validationResult;
    }

    private validateTextInEditor(text: string): ValidationSummary {
        try {
            let parsedText = json5.parse(text);
            if (!Array.isArray(parsedText)) {
                parsedText = [parsedText];
            }

            const isValid: boolean = this.ajvVal.validate(this.AppSchemaEmptyKey, parsedText) as boolean;
            const errors = this.ajvVal.errors ? this.ajvVal.errors.map((a) => a) : [];

            if (!isValid) {
                const error: ValidationError = errors && errors[0] ? errorTextComposer.compose(errors[0]) : { message: "Unknown error" };
                error.dataPath = undefined;
                return {
                    isValid,
                    error
                };
            }

            const validationSummary: Array<ValidationSummary> = (parsedText as any[]).map((appDef: { type: string }) => {

                const appType = appDef.type;

                const appIsValid = this.ajvVal.validate(`application-${appType}.json`, [appDef]) as boolean;
                const appErrors = this.ajvVal.errors ? this.ajvVal.errors.map((a) => a) : [];

                return {
                    isValid: appIsValid,
                    error: appErrors[0] ? errorTextComposer.compose(appErrors[0]) : { message: "Unknown error" }
                };
            });

            const invalidApplications = validationSummary.filter(a => !a.isValid);

            if (invalidApplications.length === 0) {
                return validationSummary[0] || { isValid: true, error: { message: "" } };
            }

            this.modifyDataPathPosition(invalidApplications[0], validationSummary);
            return invalidApplications[0] || { isValid: true, error: { message: "" } };

        } catch (error) {
            return {
                isValid: false,
                error: { message: "Invalid JSON" }
            };
        }
    }

    private modifyDataPathPosition(error: ValidationSummary, allValidationResults: Array<ValidationSummary>) {
        const realIndex = allValidationResults.indexOf(error);
        if (error.error.dataPath) {
            error.error.dataPath = "/" +realIndex + error.error.dataPath.substring(2);
        }
    }
}

export default new ConfigurationValidator();