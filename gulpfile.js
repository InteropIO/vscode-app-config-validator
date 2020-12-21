/**
 * Copyright © 2014-2020 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const assistant = require("fs-assistant").default;
const path = require("path");

function patchJsonFixer() {
    const pathToFile = path.join(__dirname, "./node_modules/json-fixer/index.js");
    const fixPattern = /(if\s?\(\w+\)\s+\w+\s)(res)/;
    const newValue = "$1 data";

    return assistant.replaceStringInFile(pathToFile, fixPattern, newValue);
}

exports.postInstall = patchJsonFixer