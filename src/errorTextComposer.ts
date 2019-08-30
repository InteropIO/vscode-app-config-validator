/**
 * Copyright © 2014-2019 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ajv = require("ajv");
import { ValidationError } from "./types";

class ErrorTextComposer {
    public compose(errorObject: ajv.ErrorObject): ValidationError {
        const defaultErrorObject = {
            message: errorObject.message ? errorObject.message : "Unable to determine error",
            dataPath: errorObject.dataPath,
            underLineMessage: "No information"
        };

        switch (errorObject.keyword) {
            case "enum":
                return this.handleEnum(errorObject);
            case "required":
                return this.handleRequired(errorObject);
            case "type":
                return this.handleType(errorObject);
            case "additionalProperties":
                return this.handleAdditionalProperties(errorObject);
            default:
                return defaultErrorObject;
        }
    }

    private handleAdditionalProperties(errorObject: ajv.ErrorObject): ValidationError {
        const result = {
            message: "",
            dataPath: errorObject.dataPath,
            underLineMessage: "No information"
        };
        const additionalProperty: string = (errorObject.params as any).additionalProperty;
        result.message = `Should not have the additional property "${additionalProperty}"`;
        result.underLineMessage = result.message;

        return result;
    }

    private handleEnum(errorObject: ajv.ErrorObject): ValidationError {
        const result = {
            message: "",
            dataPath: errorObject.dataPath,
            underLineMessage: "No information"
        };
        const allowedValues: any[] = (errorObject.params as any).allowedValues;
        result.message = `${errorObject.dataPath} should be one of: ${allowedValues.join(", ")}`;
        result.underLineMessage = `Should be one of: ${allowedValues.join(", ")}`;

        return result;
    }

    private handleRequired(errorObject: ajv.ErrorObject): ValidationError {

        const result = {
            message: "",
            dataPath: errorObject.dataPath,
            underLineMessage: "No information"
        };

        const missingProperty: string = (errorObject.params as any).missingProperty;
        result.message = `${missingProperty} is missing`;
        result.underLineMessage = result.message;

        return result;
    }

    private handleType(errorObject: ajv.ErrorObject): ValidationError {
        const result = {
            message: "",
            dataPath: errorObject.dataPath,
            underLineMessage: "No information"
        };

        const correctType: string = (errorObject.params as any).type;
        result.message = `${errorObject.dataPath} should be ${correctType}`;
        result.underLineMessage = `Should be ${correctType}`;

        return result;
    }
}

export default new ErrorTextComposer();