/**
 * Copyright © 2014-2019 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
export interface ValidationError {
    message: string;
    dataPath?: string;
    underLineMessage?: string;
}

export interface ValidationSummary {
    isValid: Boolean;
    error: ValidationError;
}