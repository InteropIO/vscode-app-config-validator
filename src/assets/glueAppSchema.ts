/**
 * Copyright © 2014-2019 Tick42 OOD
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const schema ={
    "$id": "http://glue42.com/gd/application.json",
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "ApplicationConfigSet",
    "description": "Schema describing set of configurations for applications running in GD",
    "type": "array",
    "items": {
        "$ref": "#/definitions/application"
    },
    "definitions": {
        "application": {
            "title": "ApplicationConfig",
            "type": "object",
            "description": "Schema describing configuration for application running in GD",
            "required": [
                "type",
                "name",
                "details"
            ],
            "additionalProperties": false,
            "properties": {
                "type": {
                    "description": "Type of the application",
                    "enum": [
                        "window",
                        "activity",
                        "exe",
                        "node",
                        "canvas"
                    ]
                },
                "details": {
                    "description": "Detailed configuration based on application type",
                    "oneOf": [
                        {
                            "$ref": "#/definitions/window"
                        },
                        {
                            "$ref": "#/definitions/activity"
                        },
                        {
                            "$ref": "#/definitions/exe"
                        },
                        {
                            "$ref": "#/definitions/node"
                        },
                        {
                            "$ref": "#/definitions/canvas"
                        }
                    ]
                },
                "name": {
                    "description": "Name of the application - should be unique",
                    "type": "string"
                },
                "version": {
                    "description": "The version of the application",
                    "type": "string"
                },
                "title": {
                    "description": "Title that will be used when visualizing the application",
                    "type": "string"
                },
                "caption": {
                    "description": "User friendly (long) description that can be used by the ACS clients to show more detailed application’s information",
                    "type": "string"
                },
                "configMode": {
                    "description": "Specifies for which ACS configuration mode these applications will be available",
                    "enum": [
                        "All",
                        "File",
                        "CM"
                    ],
                    "default": "All"
                },
                "tooltip": {
                    "description": "Tooltip (extended description) that will be used when visualizing the application",
                    "type": "string"
                },
                "autoStart": {
                    "description": "If true the application will be auto started",
                    "type": "boolean",
                    "default": false
                },
                "requiresSSO": {
                    "description": "This option is valid for system applications, auto-start applications and if it is true, they will be auto-started after a successful SSO login. Note that user applications are always initialized (and this way auto-started) after SSO login, so this option is useless for them.",
                    "type": "boolean",
                    "default": false
                },
                "shell": {
                    "description": "This option is valid for system application and if true, the application will be started after ACS initialization. Usually this is the container based web UI application which acts as an ACS client.",
                    "type": "boolean",
                    "default": false
                },
                "ignoreSaveOnClose": {
                    "description": "If true, application’s default layout will not be auto-saved when application is closed. Otherwise, on the next start application will be displayed on its last location with last shown window(s).",
                    "type": "boolean",
                    "default": false
                },
                "shutdownApplicationName": {
                    "description": "Specify another application to be started in order to shut down XXXXX application’s instances",
                    "type": "string"
                },
                "activityTarget": {
                    "$ref": "#/definitions/activityTarget"
                },
                "icon": {
                    "description": "URL of the application icon",
                    "type": "string"
                },
                "disabled": {
                    "description": "If true the application will be disabled",
                    "type": "boolean",
                    "default": false
                },
                "hidden": {
                    "description": "If true the application will not be visible in AppManager",
                    "type": "boolean",
                    "default": false
                },
                "allowMultiple": {
                    "description": "If true multiple instances of the application can be started",
                    "type": "boolean",
                    "default": true
                },
                "sortOrder": {
                    "description": "Defines the order(ascending) used by ACS when sending user applications list to its clients",
                    "type": "integer",
                    "default": 1000
                },
                "saveMultipleInstances": {
                    "description": "When is false, only the last application’s (or activity) instance will be saved in the default (startup layout). And when is true, all instances will be saved.",
                    "type": "boolean"
                },
                "service": {
                    "description": "If it true, the application will not be closed during restoring layout",
                    "type": "boolean",
                    "default": false
                },
                "customProperties": {
                    "description": "These name/value pairs are send to the ACS clients and JS application manager API exposes them as well, allowing custom UI’s to interpret and use the values",
                    "type": "object"
                }
            }
        },
        "window": {
            "title": "WindowConfig",
            "type": "object",
            "description": "Single window application",
            "additionalProperties": false,
            "properties": {
                "url": {
                    "description": "Initial URL that will be loaded when new HTML container host window is created.",
                    "type": "string"
                },
                "name": {
                    "description": "This is required parameter for the HTML container host CreateWindow call. ACS supports internal macros in window name used for have different window names in different scenarios.",
                    "type": "string"
                },
                "isSticky": {
                    "description": "If true, newly created window will participate in sticky windows operations.",
                    "type": "boolean",
                    "default": true
                },
                "left": {
                    "description": "Coordinate on the horizontal axis, allows context macros expansion",
                    "type": "integer",
                    "default": 0
                },
                "top": {
                    "description": "Coordinate on the vertical axis, allows context macros expansion",
                    "type": "integer",
                    "default": 0
                },
                "width": {
                    "description": "Width of the app's window, allows context macros expansion",
                    "type": "integer",
                    "default": 400
                },
                "height": {
                    "description": "Height of the app's window, allows context macros expansion",
                    "type": "integer",
                    "default": 400
                },
                "allowClose": {
                    "description": "If false window will not contain close button",
                    "type": "boolean",
                    "default": true
                },
                "allowTabClose": {
                    "description": "If false tab header will not contain close button",
                    "type": "boolean",
                    "default": true
                },
                "allowCollapse": {
                    "description": "If false window will not contain collapse button",
                    "type": "boolean",
                    "default": true
                },
                "allowForward": {
                    "description": "If false window will not contain activity related forward button",
                    "type": "boolean",
                    "default": true
                },
                "allowMaximize": {
                    "description": "If false window will not contain maximize button",
                    "type": "boolean",
                    "default": true
                },
                "allowMinimize": {
                    "description": "If false window will not contain minimize button",
                    "type": "boolean",
                    "default": true
                },
                "allowUnstick": {
                    "description": "If false window won’t be able to be unstuck",
                    "type": "boolean",
                    "default": true
                },
                "allowChannels": {
                    "description": "If false window won’t show channel selector",
                    "type": "boolean",
                    "default": false
                },
                "allowLockUnlock": {
                    "description": "If false window will not contain lock/unlock button",
                    "type": "boolean",
                    "default": false
                },
                "autoSnap": {
                    "description": "If true when move operation ends the window will snap to the one of the approaching edges (if any the approaching edges are marked with red)",
                    "type": "boolean",
                    "default": true
                },
                "autoAlign": {
                    "description": "When true a snapped window will adjust its bounds in order to have equal width/height and/or to occupy the space between other windows (if any)",
                    "type": "boolean",
                    "default": true
                },
                "base64ImageSource": {
                    "description": "Image as Base64 string that will be used as taskbar icon for the window",
                    "type": "string"
                },
                "iconURL": {
                    "description": "URL of the icon that will be used as taskbar icon for the window",
                    "type": "string"
                },
                "borderColor": {
                    "description": "Can be a colour name such as Red, or a hex-encoded RGB or ARGB value",
                    "type": "string"
                },
                "backgroundColor": {
                    "description": "Background colour of electron window. Can be a 6 or 3 digit hex value (#7FA or #1A2B30).",
                    "type": "string",
                    "pattern": "^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$"
                },
                "collapseHeight": {
                    "description": "Defines the height of the window when collapsed",
                    "type": "number",
                    "default": -1
                },
                "devToolsEnable": {
                    "description": "If true allows opening dev console (using F12) for the new window",
                    "type": "boolean",
                    "default": true
                },
                "downloadSettings": {
                    "description": "Object that defines file download behavior in the window",
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                        "autoSave": {
                            "description": "If true will auto save the file (without asking the user where to save it). If false a system save dialog will appear.",
                            "type": "boolean",
                            "default": true
                        },
                        "autoOpenPath": {
                            "description": "If true will open the folder that contains the downloaded file after the download is completed",
                            "type": "boolean",
                            "default": false
                        },
                        "autoOpenDownload": {
                            "description": "If true will open the download file after the download is completed",
                            "type": "boolean",
                            "default": false
                        },
                        "enable": {
                            "description": "If true enables windows to download files",
                            "type": "boolean",
                            "default": true
                        },
                        "enableDownloadBar": {
                            "description": "If true a download bar tracking progress will appear on the bottom of the window when downloading. If false the download process will be invisible",
                            "type": "boolean",
                            "default": true
                        }
                    }
                },
                "isCollapsed": {
                    "description": "If true the window will start collapsed",
                    "type": "boolean",
                    "default": false
                },
                "isPopup": {
                    "description": "If true the window will open as popup, sharing lifetime and environment with the opener",
                    "type": "boolean",
                    "default": false
                },
                "focus": {
                    "description": "If false window will not take focus when created",
                    "type": "boolean",
                    "default": true
                },
                "hasMoveAreas": {
                    "description": "If false a window in HTML mode can not be moved",
                    "type": "boolean",
                    "default": true
                },
                "hasSizeAreas": {
                    "description": "If false a window cannot be resized by dragging its borders, maximizing, etc.",
                    "type": "boolean",
                    "default": true
                },
                "hidden": {
                    "description": "If true the window will be started as hidden",
                    "type": "boolean",
                    "default": false
                },
                "historyNavigationEnabled": {
                    "description": "If true will allow users to navigate back (CTRL+Left) and forward (CTRL+Right) through the web page history",
                    "type": "boolean",
                    "default": true
                },
                "maxHeight": {
                    "description": "Specify maximum window’s height",
                    "type": "number"
                },
                "maxWidth": {
                    "description": "Specify maximum window’s width",
                    "type": "number"
                },
                "minHeight": {
                    "description": "Specify minimum window’s height",
                    "type": "number",
                    "default": 30
                },
                "minWidth": {
                    "description": "Specify minimum window’s width",
                    "type": "number",
                    "default": 50
                },
                "mode": {
                    "description": "HTML Container window type. Possible values are flat, html, tab.",
                    "enum": [
                        "flat",
                        "tab",
                        "html"
                    ],
                    "type": "string",
                    "default": "flat"
                },
                "serviceWindow": {
                    "description": "A legacy setting which indicates whether app should be hidden and other relevant settings set. Currently not used.",
                    "type": "boolean",
                    "default": false
                },
                "printToPdfSettings": {
                    "type": "object"
                },
                "moveAreaThickness": {
                    "description": "How much of the outer window area to be considered as sizing area (meaning you can move the window using it). The string value corresponded to the left, top, right, bottom borders.",
                    "type": "string",
                    "default": "0, 12, 0, 0",
                    "pattern": "^(?:[0-9 ]+,)*[0-9 ]+$"
                },
                "moveAreaTopMargin": {
                    "description": "HTML Container window can contains move area thickness top margin. The margin is related to the top border of ‘moveAreaThickness’ only. The string value corresponded to the left, top, right, bottom",
                    "type": "string",
                    "default": "0, 0, 0, 0",
                    "pattern": "^(?:[0-9 ]+,)*[0-9 ]+$"
                },
                "onTop": {
                    "description": "If true window will appear in the topmost z-order",
                    "type": "boolean",
                    "default": false
                },
                "relativeTo": {
                    "description": "The window id of the window that will be used to relatively position the new window. Can be combined with relativeDirection",
                    "type": "string"
                },
                "relativeDirection": {
                    "description": "Direction (bottom, top, left, right) of positioning the window relatively to relativeTo window. Considered only if relativeTo is supplied",
                    "type": "string",
                    "default": "right"
                },
                "showInTaskbar": {
                    "description": "If false window will not appear into the windows taskbar",
                    "type": "boolean",
                    "default": true
                },
                "showTitleBar": {
                    "description": "Whether window will have a window title bar",
                    "type": "boolean",
                    "default": true
                },
                "sizeAreaThickness": {
                    "description": "How much of the outer window area to be considered as sizing area (meaning you can resize using that area) . The string value corresponded to the left, top, right, bottom borders",
                    "type": "string",
                    "default": "5, 5, 5, 5",
                    "pattern": "^(?:[0-9 ]+,)*[0-9 ]+$"
                },
                "snappingEdges": {
                    "description": "Specifies active Sticky Window snapping edges. Possible combinations are: top, left, right, bottom, all and any combination of them (e.g. left, right)",
                    "type": "string",
                    "default": "all"
                },
                "startLocation": {
                    "description": "Window startup location",
                    "oneOf": [
                        {
                            "type": "string",
                            "enum": [
                                "center",
                                "topCenter",
                                "bottomCenter",
                                "leftCenter",
                                "rightCenter",
                                "full",
                                "topFull",
                                "bottomFull",
                                "leftFull",
                                "rightFull"
                            ]
                        },
                        {
                            "type": "object",
                            "properties": {
                                "location": {
                                    "type": "string",
                                    "enum": [
                                        "center",
                                        "topCenter",
                                        "bottomCenter",
                                        "leftCenter",
                                        "rightCenter",
                                        "full",
                                        "topFull",
                                        "bottomFull",
                                        "leftFull",
                                        "rightFull"
                                    ]
                                },
                                "display": {
                                    "description": "The identify number of the monitor like 1,2,3 or 'main'",
                                    "type": "string"
                                }
                            },
                            "additionalProperties": false
                        }
                    ]
                },
                "frameColor": {
                    "description": "Specifies sticky frame color. Accepts hex color as string (e.g. #666666) or named Html colors (e.g. 'red')",
                    "type": "string"
                },
                "stickyFrameColor": {
                    "description": "Specifies the color which indicates on which side the windows will stick",
                    "type": "string",
                    "default": "#5b8dc9"
                },
                "stickyGroup": {
                    "description": "If set the sticky window can only stick to windows that have the same group.",
                    "type": "string",
                    "default": "Any"
                },
                "tabGroupId": {
                    "description": "Specifies tab’s group id. If two or more tab windows are defined with same id they will be hosted into the same tab window",
                    "type": "string"
                },
                "tabIndex": {
                    "description": "Specifies tab’s position index. Tab windows in the same tab group are ordered by their position index. Use negative index to make the tab active.",
                    "type": "number"
                },
                "tabSelected": {
                    "description": "Tab selected",
                    "type": "boolean",
                    "default": true
                },
                "tabTitle": {
                    "description": "Tab title",
                    "type": "string",
                    "default": ""
                },
                "tabWidth": {
                    "description": "Specifies tab’s width",
                    "type": "number",
                    "default": 0
                },
                "hideTabHeader": {
                    "description": "Hides the tab header",
                    "type": "boolean",
                    "default": false
                },
                "tabToolTip": {
                    "description": "Tab tooltip",
                    "type": "string",
                    "default": ""
                },
                "title": {
                    "description": "Sets the window title. To work properly there should be a title HTML tag in the page",
                    "type": "string"
                },
                "loader": {
                    "description": "Object that defines loader behavior",
                    "type": "object",
                    "additionalProperties": false,
                    "default": {
                        "enabled": true,
                        "type": "DoubleBounce",
                        "background": "#1C2D3B",
                        "speed": 1,
                        "size": 1,
                        "sizeFactor": 0.3,
                        "hideOnLoad": true,
                        "text": "Loading",
                        "textSize": 12,
                        "textColor": "#F1F1F1"
                    },
                    "properties": {
                        "enabled": {
                            "description": "If true enables page loaders",
                            "type": "boolean",
                            "default": true
                        },
                        "type": {
                            "description": "The loader animation type; Check Loader animation for possible options",
                            "type": "string",
                            "default": "DoubleBounce"
                        },
                        "background": {
                            "description": "Changes the background of the loader page. Accepts hex color as string (e.g. `#666666`) or named Html colors (e.g. `red`)",
                            "type": "string",
                            "default": "#1C2D3B"
                        },
                        "speed": {
                            "description": "Changes the animation speed, where bigger number means faster animation.",
                            "type": "number",
                            "default": 1
                        },
                        "size": {
                            "description": "Use this to set an absolute size to the loader animation in pixels. Not that not all loader types support that settings check here",
                            "type": "number",
                            "default": 1
                        },
                        "sizeFactor": {
                            "description": "Use this to set a size to the loader animation as a factor of the window size",
                            "type": "number",
                            "default": 0.3
                        },
                        "hideOnLoad": {
                            "description": "Use this in order to hide the loader once the page is loaded",
                            "type": "boolean",
                            "default": true
                        },
                        "text": {
                            "description": "Use this in order to display text into the loading page.",
                            "type": "string",
                            "default": "Loading"
                        },
                        "textSize": {
                            "description": "Use this to set loader text font size",
                            "type": "number",
                            "default": 12
                        },
                        "textColor": {
                            "description": "Use this to set loader text fore color. Accepts hex color as string (e.g. #666666\") or named Html colors (e.g. 'red’)",
                            "type": "string",
                            "default": "#F1F1F1"
                        }
                    }
                },
                "useRandomFrameColor": {
                    "description": "If true will set a random (from a predefined list of colors) frame color to the new window",
                    "type": "boolean",
                    "default": false
                },
                "windowState": {
                    "description": "If set window will start in the specified state (maximized, minimized, normal)",
                    "type": "string",
                    "default": "normal"
                },
                "injectGlue": {
                    "description": "This is true/false or object that will be used to init glue",
                    "type": "object",
                    "required": [
                        "version"
                    ],
                    "additionalProperties": false,
                    "properties": {
                        "version": {
                            "type": "string",
                            "description": "Can be some version string"
                        },
                        "autoInit": {
                            "default": false,
                            "oneOf": [
                                {
                                    "type": "boolean"
                                },
                                {
                                    "type": "object",
                                    "additionalProperties": true
                                }
                            ]
                        }
                    }
                },
                "context": {
                    "description": "Custom object associated with the window",
                    "type": "object"
                },
                "autoOpenDevTools": {
                    "description": "If set dev tools will start automatically",
                    "type": "boolean",
                    "default": false
                },
                "processAffinity": {
                    "description": "Controls process reuse",
                    "default": true,
                    "oneOf": [
                        {
                            "description": "Whether process reuse is enabled for that window",
                            "type": "boolean"
                        },
                        {
                            "description": "Process affinity tag (windows with the same tag will be merged together)",
                            "type": "string"
                        }
                    ]
                },
                "sfMode": {
                    "description": " Set to true to run the window in Salesforce mode (resolving the issues that prevent SF to run in desktop container)",
                    "type": "boolean",
                    "default": false
                },
                "registerHtmlContainer": {
                    "description": "Whatever to inject the htmlContainer object. It will be used for legacy application.",
                    "type": "boolean",
                    "default": false
                },
                "channelId": {
                    "description": "Id of the channel",
                    "type": "string"
                },
                "canvasPlacement": {
                    "$ref": "#/definitions/canvasPlacement"
                },
                "contextMenuEnabled": {
                    "description": "When set to true will enable the native browser context menu.",
                    "type": "boolean"
                },
                "contextMenuMode": {
                    "description": "Supported values: native and custom. If native then it will be shown native menu otherwise it will be invoked AGM method with context menu and spell check info.",
                    "type": "string",
                    "default": "native"
                }
            },
            "required": [
                "url"
            ]
        },
        "activity": {
            "title": "activityConfig",
            "type": "object",
            "description": "Defines an activity as set of an activity window types; also defines the other activity related parameters (like layout and initial context)",
            "additionalProperties": false,
            "properties": {
                "activityType": {
                    "type": "string"
                },
                "owner": {
                    "$ref": "#/definitions/activityWindow"
                },
                "windows": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/activityWindow"
                    }
                },
                "layout": {
                    "$ref": "#/definitions/activityLayout"
                },
                "initialContext": {
                    "description": "Initial activity context in JSON format (not parsed for now and used as is).",
                    "type": "object"
                },
                "hideGroupHeader": {
                    "description": "If true, there will be no header for all window groups that have a XXXXX activity window",
                    "type": "boolean"
                },
                "autoSaveContext": {
                    "description": "Activity context can be saved as a part of saved layout. And activity owner’s window (JS code) can register a callback to describe the members of the context that should be saved. But if no handler is registered, then by default no activity context will be saved. And using this option and setting its value to true, the user has an option to save activity context for legacy applications, i.e. these that don’t have a the above described callback registered.",
                    "type": "boolean"
                },
                "saveOwnerOnly": {
                    "description": "When activity application is saved, by default only the activity owner window information will be stored. This will work “out of the box” for legacy activities which don’t support save/restore layouts and context.And when this is false, all activity windows (or ones configured using the options below) will be saved. Default is from acs.properties.",
                    "type": "boolean",
                    "default": true
                },
                "includeTypesToLayout": {
                    "description": "Comma separated list of window types (specified above) which should be included in the activity application auto-saved layout.",
                    "type": "string"
                },
                "ignoreTypesFromLayout": {
                    "description": "Comma separated list of window types (specified above) which should be excluded in the activity application auto-saved layout. Note that ignoreTypesFromLayout has priority, i.e. if window type is defined in both lists, it will be excluded. Also if includeTypesToLayout is specified but not ignoreTypesFromLayout, then the types in includeTypesToLayout list will be included in th layout and the rest excluded.And vise versa – if ignoreTypesFromLayout is specified but not includeTypesToLayout,then the types defined in ignoreTypesFromLayout will be excluded and the rest included.",
                    "type": "string"
                }
            },
            "required": [
                "owner"
            ]
        },
        "exe": {
            "title": "EXEConfig",
            "type": "object",
            "description": "Executable application - could be anything that OS can execute via the appropriate system calls",
            "additionalProperties": false,
            "properties": {
                "showConsole": {
                    "description": "If true, the console will be visible",
                    "type": "boolean",
                    "default": false
                },
                "useShellExecute": {
                    "description": "If true, path is not used (and must be empty) and command specified could contains well known resource type (like URL) which will be executed via the “shell execute” option, i.e. using the associated application. Note that useShellExecute=true is not compatible with trackingType=Environment",
                    "type": "boolean",
                    "default": false
                },
                "path": {
                    "description": "This is the working directory of the target application/script and could either relative to the ACS startup directory or an absolute path. The path must exist, and will be combined to the command parameter, if it doesn’t contain root drive. Required if shellExecute is false, otherwise must be empty",
                    "type": "string"
                },
                "command": {
                    "description": "This is the target application/script that will be executed (when useShellExecute=false) or a resource that will be opened via an associated application if useShellExecute=true. When useShellExecute=false, command target file must exist. It could contain relative (to the ACS startup folder) file path or an absolute.",
                    "type": "string"
                },
                "parameters": {
                    "description": "Optional parameters that will be used when starting the target application/script or opening the resource. The content is used as is,no checks performed.",
                    "type": "string"
                },
                "windowStyle": {
                    "description": "Specifies the target’s main window style (if supported).",
                    "enum": [
                        "Normal",
                        "Hidden",
                        "Minimized",
                        "Maximized"
                    ],
                    "default": "Normal"
                },
                "trackingType": {
                    "description": "Specifies how to track the target application’s process lifetime, i.e. to determine when it is started and stopped.",
                    "enum": [
                        "None",
                        "Process",
                        "Environment",
                        "Monitor",
                        "AGM"
                    ],
                    "default": "Process"
                },
                "targetProcess": {
                    "description": "Specifies target process name which should be found and checked for passed special environment values - this way finding the stated process ID. Used when trackingType=Environment.",
                    "type": "string"
                },
                "passGlueToken": {
                    "description": "This option is valid for external user applications and if it is true, when they are started a valid GW3 token will be sent.",
                    "type": "boolean",
                    "default": false
                },
                "glueTokenArgument": {
                    "description": "The name of the token argument",
                    "type": "string",
                    "default": "--token"
                },
                "left": {
                    "description": "Coordinate on the horizontal axis, allows context macros expansion",
                    "type": "integer",
                    "default": 0
                },
                "top": {
                    "description": "Coordinate on the vertical axis, allows context macros expansion",
                    "type": "integer",
                    "default": 0
                },
                "width": {
                    "description": "Width of the app's window, allows context macros expansion",
                    "type": "integer",
                    "default": 400
                },
                "height": {
                    "description": "Height of the app's window, allows context macros expansion",
                    "type": "integer",
                    "default": 400
                },
                "tabGroupId": {
                    "description": "Specifies tab’s group id. If two or more tab windows are defined with same id they will be hosted into the same tab window",
                    "type": "string"
                },
                "mode": {
                    "description": "HTML Container window type. Possible values are flat, html, tab.",
                    "enum": [
                        "flat",
                        "tab",
                        "html"
                    ],
                    "type": "string",
                    "default": "flat"
                },
                "tabIndex": {
                    "description": "Specifies tab’s position index. Tab windows in the same tab group are ordered by their position index. Use negative index to make the tab active.",
                    "type": "number"
                },
                "relativeTo": {
                    "description": "The window id of the window that will be used to relatively position the new window. Can be combined with relativeDirection",
                    "type": "string"
                },
                "relativeDirection": {
                    "description": "Direction (bottom, top, left, right) of positioning the window relatively to relativeTo window. Considered only if relativeTo is supplied",
                    "type": "string",
                    "default": "right"
                },
                "allowChannels": {
                    "description": "If false window won’t show channel selector",
                    "type": "boolean",
                    "default": false
                },
                "channelId": {
                    "description": "Id of the channel",
                    "type": "string"
                },
                "canvasPlacement": {
                    "$ref": "#/definitions/canvasPlacement"
                },
                "logging": {
                    "description": "If true, the stdout and stderr will be saved in the log folder under 'application' folder with the name of the application",
                    "type": "boolean",
                    "default": false
                },
                "startFailedMessage": {
                    "description": "Error message that should be displayed to users if the exe fails to start",
                    "type": "string"
                }
            }
        },
        "node": {
            "title": "NodeConfig",
            "type": "object",
            "description": "Node application ",
            "additionalProperties": false,
            "properties": {
                "showConsole": {
                    "description": "If true, the console of the Node.js script the will be visible",
                    "type": "boolean",
                    "default": false
                },
                "path": {
                    "description": "This is path to the JavaScript file to be executed in Node.js",
                    "type": "string"
                },
                "passGlueToken": {
                    "description": "If it is true, when they are started a valid GW3 token will be set as environment variable - gwToken.",
                    "type": "boolean",
                    "default": false
                },
                "debug": {
                    "description": "Enable debugging. Same as inspect",
                    "default": false,
                    "oneOf": [
                        {
                            "description": "Enable debugging on the default port 9229",
                            "type": "boolean"
                        },
                        {
                            "description": "Enable debugging on port",
                            "type": "string",
                            "additionalProperties": false
                        }
                    ],
                    "additionalProperties": false
                },
                "inspect": {
                    "description": "Enable inspector agent. If boolean listen on default address and port (127.0.0.1:9229). If number listens on the port number",
                    "default": false,
                    "oneOf": [
                        {
                            "description": "Enable debugging on the default port 9229",
                            "type": "boolean"
                        },
                        {
                            "description": "Enable debugging on port",
                            "type": "number",
                            "additionalProperties": false
                        }
                    ],
                    "additionalProperties": false
                },
                "inspectBrk": {
                    "description": "Enable inspector agent and break before user code starts. If boolean listen on default address and port (127.0.0.1:9229). If number listens on the port number",
                    "default": false,
                    "oneOf": [
                        {
                            "description": "Enable debugging on the default port 9229",
                            "type": "boolean"
                        },
                        {
                            "description": "Enable debugging on port",
                            "type": "number",
                            "additionalProperties": false
                        }
                    ],
                    "additionalProperties": false
                },
                "parameters": {
                    "description": "Optional parameters that will be used when starting the application/script.",
                    "type": "string"
                }
            }
        },
        "activityWindow": {
            "title": "activityWindow",
            "type": "object",
            "description": "A window which takes part in an activity and may or may not be the owner",
            "additionalProperties": false,
            "properties": {
                "type": {
                    "description": "The application identifier",
                    "type": "string"
                },
                "name": {
                    "description": "The name of the application",
                    "type": "string"
                },
                "left": {
                    "description": "Coordinate on the horizontal axis",
                    "type": "integer"
                },
                "top": {
                    "description": "Coordinate on the vertical axis",
                    "type": "integer"
                },
                "width": {
                    "description": "Width of the app's window",
                    "type": "integer",
                    "default": 400
                },
                "height": {
                    "description": "Height of the app's window",
                    "type": "integer",
                    "default": 400
                }
            },
            "required": [
                "type",
                "name",
                "left",
                "top",
                "width",
                "height"
            ]
        },
        "activityLayout": {
            "title": "activityLayout",
            "type": "object",
            "description": "Specifies the mode and cellSize of the layout.",
            "additionalProperties": false,
            "properties": {
                "mode": {
                    "enum": [
                        "pixels",
                        "percents"
                    ],
                    "default": "pixels"
                },
                "cellSize": {
                    "type": "integer",
                    "default": 1
                },
                "cellWidth": {
                    "type": "integer"
                },
                "cellHeight": {
                    "type": "integer"
                },
                "screen": {
                    "default": "main",
                    "type": [
                        "string",
                        "integer"
                    ],
                    "description": "Can specify the target screen by its index or as 'main' to indicate the primary display device."
                }
            }
        },
        "activityTarget": {
            "title": "activityTarget",
            "type": "object",
            "description": "Specifies how this application will be registered as an activity window",
            "additionalProperties": false,
            "properties": {
                "enabled": {
                    "description": "Whether to register the application as an activity window",
                    "type": "boolean",
                    "default": false
                },
                "windowType": {
                    "description": "Specifies the activity window type that will be associated with this application, i.e. when there is a request from the activity manager to create this type, an application instance is started. Defaults to the application's name.",
                    "type": "string"
                },
                "isIndependent": {
                    "description": "Whether this activity window type can act as an independent window,i.e. to belong to any activity.",
                    "type": "boolean",
                    "default": false
                }
            },
            "required": [
                "enabled"
            ]
        },
        "canvas": {
            "title": "canvasConfig",
            "type": "object",
            "description": "Defines a canvas layout",
            "additionalProperties": false,
            "properties": {
                "lanes": {
                    "type": "number"
                },
                "horizontal": {
                    "type": "boolean"
                },
                "launcherApp": {
                    "type": "string"
                },
                "detailWindow": {
                    "type": "string"
                },
                "caption": {
                    "type": "string"
                },
                "workspace": {
                    "type": "string"
                },
                "workspaceTitle": {
                    "type": "string"
                },
                "workspaceContext": {
                    "type": "object"
                },
                "autoStartLauncherApp": {
                    "type": "boolean",
                    "default": true
                },
                "icon": {
                    "type": "string"
                },
                "apps": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/canvasApplication"
                    }
                },
                "ignoreSavedLayout": {
                    "type": "boolean",
                    "default": false
                },
                "bounds": {
                    "type": "object",
                    "additionalProperties": false,
                    "properties": {
                        "left": {
                            "description": "Coordinate on the horizontal axis",
                            "type": "integer"
                        },
                        "top": {
                            "description": "Coordinate on the vertical axis",
                            "type": "integer"
                        },
                        "width": {
                            "description": "Width of the app's window",
                            "type": "integer"
                        },
                        "height": {
                            "description": "Height of the app's window",
                            "type": "integer"
                        }
                    }
                },
                "windowState": {
                    "description": "If set window will start in the specified state (maximized, minimized, normal)",
                    "type": "string"
                }
            },
            "required": [
                "lanes"
            ]
        },
        "canvasApplication": {
            "title": "canvasApplicationConfig",
            "type": "object",
            "description": "Defines a canvas application",
            "additionalProperties": false,
            "properties": {
                "name": {
                    "type": "string"
                },
                "lane": {
                    "type": "number"
                },
                "positionInLane": {
                    "type": "number"
                },
                "showCaption": {
                    "type": "boolean"
                },
                "showFrame": {
                    "type": "boolean"
                },
                "tabGroup": {
                    "type": "string"
                },
                "tabTitle": {
                    "type": "string"
                },
                "height": {
                    "type": "number"
                },
                "maxHeight": {
                    "type": "number"
                },
                "minHeight": {
                    "type": "number"
                },
                "width": {
                    "type": "number"
                },
                "maxWidth": {
                    "type": "number"
                },
                "minWidth": {
                    "type": "number"
                },
                "selected": {
                    "type": "boolean"
                },
                "tabIndex": {
                    "type": "number"
                },
                "maximized": {
                    "type": "boolean"
                },
                "inMaximizedTab": {
                    "type": "boolean"
                },
                "tabAllowDrop": {
                    "type": "boolean"
                },
                "tabAllowExtract": {
                    "type": "boolean"
                },
                "disableTileMode": {
                    "type": "boolean"
                }
            },
            "required": [
                "name",
                "lane"
            ]
        },
        "canvasPlacement": {
            "title": "CanvasPlacementConfig",
            "type": "object",
            "properties": {
                "frameId": {
                    "type": "string"
                },
                "canvasId": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "lane": {
                    "type": "number"
                },
                "positionInLane": {
                    "type": "number"
                },
                "showCaption": {
                    "type": "boolean"
                },
                "showFrame": {
                    "type": "boolean"
                },
                "tabGroup": {
                    "type": "string"
                },
                "tabTitle": {
                    "type": "string"
                },
                "height": {
                    "type": "number"
                },
                "fixedHeight": {
                    "type": "number"
                },
                "maxHeight": {
                    "type": "number"
                },
                "minHeight": {
                    "type": "number"
                },
                "width": {
                    "type": "number"
                },
                "fixedWidth": {
                    "type": "number"
                },
                "maxWidth": {
                    "type": "number"
                },
                "minWidth": {
                    "type": "number"
                },
                "selected": {
                    "type": "boolean"
                },
                "tabIndex": {
                    "type": "number"
                },
                "maximized": {
                    "type": "boolean"
                },
                "inMaximizedTab": {
                    "type": "boolean"
                },
                "tabAllowDrop": {
                    "type": "boolean"
                },
                "tabAllowExtract": {
                    "type": "boolean"
                },
                "disableTileMode": {
                    "type": "boolean"
                }
            }
        }
    }
};





export default schema;