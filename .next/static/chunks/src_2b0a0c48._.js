(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "cn": ()=>cn
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/card.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Card": ()=>Card,
    "CardAction": ()=>CardAction,
    "CardContent": ()=>CardContent,
    "CardDescription": ()=>CardDescription,
    "CardFooter": ()=>CardFooter,
    "CardHeader": ()=>CardHeader,
    "CardTitle": ()=>CardTitle
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/button.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Button": ()=>Button,
    "buttonVariants": ()=>buttonVariants
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
            destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button(param) {
    let { className, variant, size, asChild = false, ...props } = param;
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/button.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ui/progress.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "Progress": ()=>Progress
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-progress/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
function Progress(param) {
    let { className, value, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "progress",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-primary/20 relative h-2 w-full overflow-hidden rounded-full", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$progress$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            "data-slot": "progress-indicator",
            className: "bg-primary h-full w-full flex-1 transition-all",
            style: {
                transform: "translateX(-".concat(100 - (value || 0), "%)")
            }
        }, void 0, false, {
            fileName: "[project]/src/components/ui/progress.tsx",
            lineNumber: 22,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/progress.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Progress;
;
var _c;
__turbopack_context__.k.register(_c, "Progress");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/aura/PatientCheckin.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "PatientCheckin": ()=>PatientCheckin
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$webcam$2f$dist$2f$react$2d$webcam$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-webcam/dist/react-webcam.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/progress.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function PatientCheckin(param) {
    let {} = param;
    var _checkinState_humeWebSocket, _checkinState_eviWebSocket;
    _s();
    // Component state management for idle/recording/finished phases
    const [checkinState, setCheckinState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        phase: 'idle',
        timeRemaining: 60,
        webcamReady: false,
        webcamError: null,
        emotionData: [],
        humeWebSocket: null,
        eviWebSocket: null,
        humeToken: null,
        isConnecting: false,
        conversationTranscript: [],
        connectionStatus: {
            facial: 'disconnected',
            vocal: 'disconnected'
        }
    });
    const webcamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Request webcam permissions when component loads
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PatientCheckin.useEffect": ()=>{
            const requestWebcamAccess = {
                "PatientCheckin.useEffect.requestWebcamAccess": async ()=>{
                    try {
                        // Request camera permissions
                        const stream = await navigator.mediaDevices.getUserMedia({
                            video: true,
                            audio: true
                        });
                        // If successful, set webcam as ready
                        setCheckinState({
                            "PatientCheckin.useEffect.requestWebcamAccess": (prev)=>({
                                    ...prev,
                                    webcamReady: true,
                                    webcamError: null
                                })
                        }["PatientCheckin.useEffect.requestWebcamAccess"]);
                        // Stop the stream since react-webcam will handle it
                        stream.getTracks().forEach({
                            "PatientCheckin.useEffect.requestWebcamAccess": (track)=>track.stop()
                        }["PatientCheckin.useEffect.requestWebcamAccess"]);
                    } catch (error) {
                        console.error('Webcam access error:', error);
                        let errorMessage = 'Unable to access camera';
                        let instructions = 'Please check your camera permissions and try again.';
                        if (error instanceof Error) {
                            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                                errorMessage = 'Camera access denied';
                                instructions = 'Please allow camera access in your browser settings and refresh the page.';
                            } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                                errorMessage = 'No camera found';
                                instructions = 'Please connect a camera device and refresh the page.';
                            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                                errorMessage = 'Camera is already in use';
                                instructions = 'Please close other applications using the camera and try again.';
                            }
                        }
                        setCheckinState({
                            "PatientCheckin.useEffect.requestWebcamAccess": (prev)=>({
                                    ...prev,
                                    webcamReady: false,
                                    webcamError: errorMessage
                                })
                        }["PatientCheckin.useEffect.requestWebcamAccess"]);
                        // Show toast notification with error and instructions
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage, {
                            description: instructions,
                            duration: 8000
                        });
                    }
                }
            }["PatientCheckin.useEffect.requestWebcamAccess"];
            requestWebcamAccess();
        }
    }["PatientCheckin.useEffect"], []);
    // Fetch Hume AI access token
    const fetchHumeToken = async ()=>{
        try {
            const response = await fetch('/api/hume/token');
            if (!response.ok) {
                const errorData = await response.json().catch(()=>({}));
                if (response.status === 500 && errorData.error === 'Server configuration error') {
                    console.warn('Hume AI credentials not configured - running in demo mode');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Demo Mode', {
                        description: 'Emotion analysis is not configured. Recording will work without AI analysis.',
                        duration: 5000
                    });
                    return 'demo-mode';
                }
                throw new Error("Token fetch failed: ".concat(response.status, " - ").concat(errorData.error || 'Unknown error'));
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            if (!data.accessToken) {
                throw new Error('No access token received');
            }
            return data.accessToken;
        } catch (error) {
            console.error('Error fetching Hume token:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Authentication failed', {
                description: 'Unable to connect to emotion analysis service. Recording will work without AI analysis.',
                duration: 5000
            });
            return null;
        }
    };
    // Initialize Hume AI WebSocket connections
    const initializeHumeConnections = async ()=>{
        if (checkinState.isConnecting || checkinState.humeToken) {
            return;
        }
        setCheckinState((prev)=>({
                ...prev,
                isConnecting: true,
                connectionStatus: {
                    facial: 'connecting',
                    vocal: 'connecting'
                }
            }));
        try {
            // Fetch secure access token
            const token = await fetchHumeToken();
            if (!token) {
                setCheckinState((prev)=>({
                        ...prev,
                        isConnecting: false
                    }));
                return;
            }
            setCheckinState((prev)=>({
                    ...prev,
                    humeToken: token
                }));
            // If in demo mode, skip WebSocket connections
            if (token === 'demo-mode') {
                console.log('Running in demo mode - skipping Hume AI WebSocket connections');
                setCheckinState((prev)=>({
                        ...prev,
                        isConnecting: false,
                        humeWebSocket: null,
                        eviWebSocket: null,
                        connectionStatus: {
                            facial: 'disconnected',
                            vocal: 'disconnected'
                        }
                    }));
                return;
            }
            // Initialize Expression Measurement API WebSocket for facial analysis
            const expressionWs = new WebSocket("wss://api.hume.ai/v0/stream/models");
            expressionWs.onopen = ()=>{
                console.log('Expression Measurement WebSocket connected');
                setCheckinState((prev)=>({
                        ...prev,
                        connectionStatus: {
                            ...prev.connectionStatus,
                            facial: 'connected'
                        }
                    }));
                // Send authentication and configuration
                const authMessage = {
                    models: {
                        face: {}
                    },
                    stream_window_ms: 1000,
                    reset_stream: true
                };
                expressionWs.send(JSON.stringify(authMessage));
            };
            expressionWs.onmessage = (event)=>{
                try {
                    const data = JSON.parse(event.data);
                    // Handle facial expression predictions
                    if (data.face && data.face.predictions && data.face.predictions.length > 0) {
                        const prediction = data.face.predictions[0];
                        if (prediction.emotions && prediction.emotions.length > 0) {
                            // Convert Hume emotion array to our emotion object format
                            const emotions = {
                                joy: 0,
                                sadness: 0,
                                anger: 0,
                                fear: 0,
                                surprise: 0,
                                disgust: 0,
                                contempt: 0
                            };
                            // Map Hume emotions to our format
                            prediction.emotions.forEach((emotion)=>{
                                const emotionName = emotion.name.toLowerCase();
                                if (emotionName in emotions) {
                                    emotions[emotionName] = emotion.score;
                                }
                            });
                            const emotionPoint = {
                                timestamp: Date.now(),
                                emotions,
                                confidence: prediction.prob || 0.5,
                                source: 'facial'
                            };
                            setCheckinState((prev)=>({
                                    ...prev,
                                    emotionData: [
                                        ...prev.emotionData,
                                        emotionPoint
                                    ]
                                }));
                        }
                    }
                } catch (error) {
                    console.error('Error processing facial emotion data:', error);
                }
            };
            expressionWs.onerror = (error)=>{
                console.error('Expression Measurement WebSocket error:', error);
                setCheckinState((prev)=>({
                        ...prev,
                        connectionStatus: {
                            ...prev.connectionStatus,
                            facial: 'error'
                        }
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Facial analysis connection failed', {
                    description: 'Unable to connect to facial emotion analysis.',
                    duration: 5000
                });
            };
            expressionWs.onclose = ()=>{
                console.log('Expression Measurement WebSocket closed');
                setCheckinState((prev)=>({
                        ...prev,
                        connectionStatus: {
                            ...prev.connectionStatus,
                            facial: 'disconnected'
                        }
                    }));
            };
            // Initialize EVI API WebSocket for vocal analysis and intelligent conversation
            const eviWs = new WebSocket("wss://api.hume.ai/v0/evi/chat", [], {
                headers: {
                    'Authorization': "Bearer ".concat(token),
                    'X-Hume-Api-Key': token
                }
            });
            eviWs.onopen = ()=>{
                console.log('EVI WebSocket connected');
                setCheckinState((prev)=>({
                        ...prev,
                        connectionStatus: {
                            ...prev.connectionStatus,
                            vocal: 'connected'
                        }
                    }));
                // Configure EVI session for healthcare conversation
                const sessionConfig = {
                    type: 'session_settings',
                    session_settings: {
                        type: 'session_settings',
                        system_prompt: "You are a compassionate healthcare assistant helping patients prepare for their appointment. Your role is to listen empathetically as they describe how they've been feeling and gently encourage them to share their health concerns. Keep responses brief and supportive. Ask follow-up questions to help them articulate their feelings and symptoms clearly. This is a rehearsal conversation to help them prepare for their actual doctor visit.",
                        voice: {
                            provider: "HUME_AI",
                            name: "ITO"
                        },
                        language: "en",
                        max_duration: 60000,
                        inactivity_timeout: 10000 // 10 seconds of silence
                    }
                };
                eviWs.send(JSON.stringify(sessionConfig));
            };
            eviWs.onmessage = (event)=>{
                try {
                    const data = JSON.parse(event.data);
                    // Handle different EVI message types
                    switch(data.type){
                        case 'user_message':
                            // Add user message to conversation transcript
                            if (data.message && data.message.content) {
                                setCheckinState((prev)=>({
                                        ...prev,
                                        conversationTranscript: [
                                            ...prev.conversationTranscript,
                                            "User: ".concat(data.message.content)
                                        ]
                                    }));
                            }
                            // Process vocal prosody data from user speech
                            if (data.models && data.models.prosody && data.models.prosody.scores) {
                                const prosodyScores = data.models.prosody.scores;
                                // Convert prosody scores to our emotion format
                                const emotions = {
                                    joy: 0,
                                    sadness: 0,
                                    anger: 0,
                                    fear: 0,
                                    surprise: 0,
                                    disgust: 0,
                                    contempt: 0
                                };
                                // Map prosody emotions to our format
                                Object.keys(prosodyScores).forEach((emotionName)=>{
                                    const normalizedName = emotionName.toLowerCase();
                                    if (normalizedName in emotions) {
                                        emotions[normalizedName] = prosodyScores[emotionName];
                                    }
                                });
                                const emotionPoint = {
                                    timestamp: Date.now(),
                                    emotions,
                                    confidence: data.models.prosody.confidence || 0.7,
                                    source: 'vocal'
                                };
                                setCheckinState((prev)=>({
                                        ...prev,
                                        emotionData: [
                                            ...prev.emotionData,
                                            emotionPoint
                                        ]
                                    }));
                            }
                            break;
                        case 'assistant_message':
                            var _data_message;
                            // Add assistant message to conversation transcript
                            if (data.message && data.message.content) {
                                setCheckinState((prev)=>({
                                        ...prev,
                                        conversationTranscript: [
                                            ...prev.conversationTranscript,
                                            "Assistant: ".concat(data.message.content)
                                        ]
                                    }));
                            }
                            console.log('EVI Assistant response:', (_data_message = data.message) === null || _data_message === void 0 ? void 0 : _data_message.content);
                            break;
                        case 'audio_output':
                            // Handle audio responses from EVI (AI speaking back)
                            if (data.data) {
                                // Play audio response from EVI
                                const audioBlob = new Blob([
                                    Uint8Array.from(atob(data.data), (c)=>c.charCodeAt(0))
                                ], {
                                    type: 'audio/wav'
                                });
                                const audioUrl = URL.createObjectURL(audioBlob);
                                const audio = new Audio(audioUrl);
                                audio.play().catch((error)=>{
                                    console.error('Error playing EVI audio response:', error);
                                });
                            }
                            break;
                        case 'session_status':
                            console.log('EVI Session status:', data.status);
                            break;
                        default:
                            console.log('Unknown EVI message type:', data.type);
                    }
                } catch (error) {
                    console.error('Error processing EVI message:', error);
                }
            };
            eviWs.onerror = (error)=>{
                console.error('EVI WebSocket error:', error);
                setCheckinState((prev)=>({
                        ...prev,
                        connectionStatus: {
                            ...prev.connectionStatus,
                            vocal: 'error'
                        }
                    }));
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Voice analysis connection failed', {
                    description: 'Unable to connect to voice emotion analysis and conversation.',
                    duration: 5000
                });
            };
            eviWs.onclose = ()=>{
                console.log('EVI WebSocket closed');
                setCheckinState((prev)=>({
                        ...prev,
                        connectionStatus: {
                            ...prev.connectionStatus,
                            vocal: 'disconnected'
                        }
                    }));
            };
            // Store WebSocket connections in state
            setCheckinState((prev)=>({
                    ...prev,
                    humeWebSocket: expressionWs,
                    eviWebSocket: eviWs,
                    isConnecting: false
                }));
        } catch (error) {
            console.error('Error initializing Hume connections:', error);
            setCheckinState((prev)=>({
                    ...prev,
                    isConnecting: false
                }));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Connection failed', {
                description: 'Unable to initialize emotion analysis services.',
                duration: 5000
            });
        }
    };
    // Initialize Hume connections when component mounts
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PatientCheckin.useEffect": ()=>{
            initializeHumeConnections();
            // Cleanup WebSocket connections on unmount
            return ({
                "PatientCheckin.useEffect": ()=>{
                    if (checkinState.humeWebSocket) {
                        checkinState.humeWebSocket.close();
                    }
                    if (checkinState.eviWebSocket) {
                        checkinState.eviWebSocket.close();
                    }
                }
            })["PatientCheckin.useEffect"];
        }
    }["PatientCheckin.useEffect"], []);
    // Handle webcam ready state
    const handleWebcamReady = ()=>{
        setCheckinState((prev)=>({
                ...prev,
                webcamReady: true,
                webcamError: null
            }));
    };
    // Handle webcam errors
    const handleWebcamError = (error)=>{
        console.error('Webcam error:', error);
        let errorMessage = 'Camera error occurred';
        let instructions = 'Please refresh the page and try again.';
        if (typeof error === 'string') {
            errorMessage = error;
        } else if (error instanceof DOMException) {
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Camera access denied';
                instructions = 'Please allow camera access in your browser settings and refresh the page.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'No camera found';
                instructions = 'Please connect a camera device and refresh the page.';
            }
        }
        setCheckinState((prev)=>({
                ...prev,
                webcamReady: false,
                webcamError: errorMessage
            }));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(errorMessage, {
            description: instructions,
            duration: 8000
        });
    };
    // Start recording function
    const startRecording = async ()=>{
        if (checkinState.phase !== 'idle' || !checkinState.webcamReady) {
            return;
        }
        // Check if we have a token (either real or demo mode)
        if (!checkinState.humeToken) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Connection not ready', {
                description: 'Please wait for services to initialize.',
                duration: 3000
            });
            return;
        }
        const isDemoMode = checkinState.humeToken === 'demo-mode';
        // Set recording phase and reset timer
        setCheckinState((prev)=>({
                ...prev,
                phase: 'recording',
                timeRemaining: 60,
                emotionData: []
            }));
        // Start streaming video frames to Expression Measurement API (if not in demo mode)
        let videoStreamInterval = null;
        if (!isDemoMode) {
            const streamVideoFrames = ()=>{
                if (webcamRef.current && checkinState.humeWebSocket && checkinState.phase === 'recording') {
                    const canvas = document.createElement('canvas');
                    const video = webcamRef.current.video;
                    if (video && video.videoWidth > 0 && video.videoHeight > 0) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                            ctx.drawImage(video, 0, 0);
                            // Convert canvas to base64 image (JPEG format for better performance)
                            const imageData = canvas.toDataURL('image/jpeg', 0.7);
                            const base64Data = imageData.split(',')[1];
                            // Send frame to Expression Measurement API with proper format
                            if (checkinState.humeWebSocket.readyState === WebSocket.OPEN) {
                                const message = {
                                    data: base64Data,
                                    models: {
                                        face: {}
                                    },
                                    stream_window_ms: 1000,
                                    reset_stream: false
                                };
                                checkinState.humeWebSocket.send(JSON.stringify(message));
                            }
                        }
                    }
                }
            };
            // Start video frame streaming (every 300ms for optimal performance vs accuracy balance)
            videoStreamInterval = setInterval(streamVideoFrames, 300);
        } else {
            // In demo mode, generate mock emotion data
            videoStreamInterval = setInterval(()=>{
                if (checkinState.phase === 'recording') {
                    const mockEmotionPoint = {
                        timestamp: Date.now(),
                        emotions: {
                            joy: Math.random() * 0.3 + 0.1,
                            sadness: Math.random() * 0.2,
                            anger: Math.random() * 0.1,
                            fear: Math.random() * 0.15,
                            surprise: Math.random() * 0.2,
                            disgust: Math.random() * 0.1,
                            contempt: Math.random() * 0.05
                        },
                        confidence: Math.random() * 0.3 + 0.7,
                        source: 'facial'
                    };
                    setCheckinState((prev)=>({
                            ...prev,
                            emotionData: [
                                ...prev.emotionData,
                                mockEmotionPoint
                            ]
                        }));
                }
            }, 500);
        }
        // Start audio capture for EVI (if not in demo mode)
        if (!isDemoMode) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        sampleRate: 16000,
                        channelCount: 1,
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    },
                    video: false
                });
                // Set up audio processing for EVI WebSocket with proper format
                const audioContext = new AudioContext({
                    sampleRate: 16000
                });
                const source = audioContext.createMediaStreamSource(stream);
                // Use AudioWorklet for better performance if available, fallback to ScriptProcessor
                let processor;
                let isProcessing = false;
                if (audioContext.audioWorklet) {
                    // Modern approach with AudioWorklet (better performance)
                    try {
                        await audioContext.audioWorklet.addModule('/audio-processor.js');
                        processor = new AudioWorkletNode(audioContext, 'audio-processor');
                        processor.port.onmessage = (event)=>{
                            if (checkinState.eviWebSocket && checkinState.eviWebSocket.readyState === WebSocket.OPEN && checkinState.phase === 'recording' && !isProcessing) {
                                isProcessing = true;
                                // Convert Float32Array to base64 encoded PCM data
                                const audioData = event.data;
                                const int16Array = new Int16Array(audioData.length);
                                for(let i = 0; i < audioData.length; i++){
                                    int16Array[i] = Math.max(-32768, Math.min(32767, audioData[i] * 32768));
                                }
                                const base64Audio = btoa(String.fromCharCode(...new Uint8Array(int16Array.buffer)));
                                const message = {
                                    type: 'audio_input',
                                    data: base64Audio,
                                    encoding: 'linear16',
                                    sample_rate: 16000
                                };
                                checkinState.eviWebSocket.send(JSON.stringify(message));
                                setTimeout(()=>{
                                    isProcessing = false;
                                }, 50); // Throttle to ~20fps
                            }
                        };
                    } catch (workletError) {
                        console.warn('AudioWorklet not available, falling back to ScriptProcessor');
                        // Fallback to ScriptProcessor
                        processor = audioContext.createScriptProcessor(4096, 1, 1);
                    }
                } else {
                    // Fallback to ScriptProcessor for older browsers
                    processor = audioContext.createScriptProcessor(4096, 1, 1);
                }
                // ScriptProcessor fallback implementation
                if (processor instanceof ScriptProcessorNode) {
                    processor.onaudioprocess = (event)=>{
                        if (checkinState.eviWebSocket && checkinState.eviWebSocket.readyState === WebSocket.OPEN && checkinState.phase === 'recording' && !isProcessing) {
                            isProcessing = true;
                            const inputBuffer = event.inputBuffer.getChannelData(0);
                            // Convert to 16-bit PCM and then to base64
                            const int16Array = new Int16Array(inputBuffer.length);
                            for(let i = 0; i < inputBuffer.length; i++){
                                int16Array[i] = Math.max(-32768, Math.min(32767, inputBuffer[i] * 32768));
                            }
                            const base64Audio = btoa(String.fromCharCode(...new Uint8Array(int16Array.buffer)));
                            const message = {
                                type: 'audio_input',
                                data: base64Audio,
                                encoding: 'linear16',
                                sample_rate: 16000
                            };
                            checkinState.eviWebSocket.send(JSON.stringify(message));
                            setTimeout(()=>{
                                isProcessing = false;
                            }, 50); // Throttle to ~20fps
                        }
                    };
                }
                source.connect(processor);
                if (processor instanceof ScriptProcessorNode) {
                    processor.connect(audioContext.destination);
                }
                // Store cleanup functions
                const cleanup = ()=>{
                    if (videoStreamInterval) clearInterval(videoStreamInterval);
                    processor.disconnect();
                    source.disconnect();
                    stream.getTracks().forEach((track)=>track.stop());
                    audioContext.close();
                };
                // Store cleanup function for later use
                window.humeCleanup = cleanup;
            } catch (error) {
                console.error('Error setting up audio capture:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Audio setup failed', {
                    description: 'Unable to capture audio for voice analysis and conversation.',
                    duration: 3000
                });
            }
        } else {
            // In demo mode, generate mock vocal emotion data
            const vocalDataInterval = setInterval(()=>{
                if (checkinState.phase === 'recording') {
                    const mockVocalPoint = {
                        timestamp: Date.now(),
                        emotions: {
                            joy: Math.random() * 0.4 + 0.2,
                            sadness: Math.random() * 0.3,
                            anger: Math.random() * 0.15,
                            fear: Math.random() * 0.2,
                            surprise: Math.random() * 0.25,
                            disgust: Math.random() * 0.1,
                            contempt: Math.random() * 0.05
                        },
                        confidence: Math.random() * 0.2 + 0.8,
                        source: 'vocal'
                    };
                    setCheckinState((prev)=>({
                            ...prev,
                            emotionData: [
                                ...prev.emotionData,
                                mockVocalPoint
                            ]
                        }));
                }
            }, 800);
            // Store cleanup function for demo mode
            window.humeCleanup = ()=>{
                if (videoStreamInterval) clearInterval(videoStreamInterval);
                clearInterval(vocalDataInterval);
            };
        }
        // Start countdown timer
        timerRef.current = setInterval(()=>{
            setCheckinState((prev)=>{
                const newTimeRemaining = prev.timeRemaining - 1;
                // If timer reaches 0, stop recording
                if (newTimeRemaining <= 0) {
                    stopRecording();
                    return {
                        ...prev,
                        timeRemaining: 0
                    };
                }
                return {
                    ...prev,
                    timeRemaining: newTimeRemaining
                };
            });
        }, 1000);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Recording started', {
            description: 'Please describe how you\'ve been feeling.',
            duration: 3000
        });
    };
    // Submit emotion data to backend
    const submitEmotionData = async (emotionData, transcript)=>{
        try {
            const response = await fetch('/api/checkin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patientId: "patient_".concat(Date.now()),
                    transcript: transcript.join('\n'),
                    emotionTimeline: emotionData,
                    createdAt: new Date()
                })
            });
            if (!response.ok) {
                throw new Error("Failed to submit data: ".concat(response.status));
            }
            const result = await response.json();
            console.log('Emotion data submitted successfully:', result);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Data saved', {
                description: 'Your check-in data has been securely stored.',
                duration: 3000
            });
        } catch (error) {
            console.error('Error submitting emotion data:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Save failed', {
                description: 'Unable to save your check-in data. Please try again.',
                duration: 5000
            });
        }
    };
    // Stop recording function
    const stopRecording = async ()=>{
        // Clear timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        // Clean up audio processing
        if (window.humeCleanup) {
            window.humeCleanup();
            delete window.humeCleanup;
        }
        // Submit collected emotion data and conversation transcript to backend
        if (checkinState.emotionData.length > 0 || checkinState.conversationTranscript.length > 0) {
            await submitEmotionData(checkinState.emotionData, checkinState.conversationTranscript);
        }
        // Set finished phase
        setCheckinState((prev)=>({
                ...prev,
                phase: 'finished',
                timeRemaining: 0
            }));
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Recording completed', {
            description: 'Thank you for completing your check-in.',
            duration: 3000
        });
    };
    // Cleanup timer and WebSocket connections on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PatientCheckin.useEffect": ()=>{
            return ({
                "PatientCheckin.useEffect": ()=>{
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                    }
                    // Clean up audio processing
                    if (window.humeCleanup) {
                        window.humeCleanup();
                        delete window.humeCleanup;
                    }
                    // Close WebSocket connections
                    if (checkinState.humeWebSocket) {
                        checkinState.humeWebSocket.close();
                    }
                    if (checkinState.eviWebSocket) {
                        checkinState.eviWebSocket.close();
                    }
                }
            })["PatientCheckin.useEffect"];
        }
    }["PatientCheckin.useEffect"], [
        checkinState.humeWebSocket,
        checkinState.eviWebSocket
    ]);
    // Render component based on current phase
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                    className: "text-center text-neutral-900",
                    children: "Patient Check-in"
                }, void 0, false, {
                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                    lineNumber: 923,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                lineNumber: 922,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "space-y-6",
                children: [
                    checkinState.phase === 'idle' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center mb-8 px-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-blue-50 border border-blue-100 rounded-lg p-6 max-w-2xl mx-auto",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-neutral-800 text-lg leading-relaxed font-medium mb-2",
                                            children: "To prepare for your appointment, please take 60 seconds to describe how you've been feeling."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                            lineNumber: 933,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-neutral-600 text-sm",
                                            children: "This helps your healthcare provider better understand your current state and provide more personalized care."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                            lineNumber: 936,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                    lineNumber: 932,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 931,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center space-y-4",
                                children: [
                                    checkinState.webcamError ? // Error State
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-6 text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-red-600 font-medium mb-2",
                                                children: checkinState.webcamError
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 947,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-red-500 text-sm mb-4",
                                                children: [
                                                    checkinState.webcamError.includes('denied') && 'Please allow camera access in your browser settings and refresh the page.',
                                                    checkinState.webcamError.includes('found') && 'Please connect a camera device and refresh the page.',
                                                    !checkinState.webcamError.includes('denied') && !checkinState.webcamError.includes('found') && 'Please check your camera permissions and try again.'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 950,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                onClick: ()=>window.location.reload(),
                                                variant: "outline",
                                                className: "text-red-600 border-red-300 hover:bg-red-50",
                                                children: "Refresh Page"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 962,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 946,
                                        columnNumber: 17
                                    }, this) : checkinState.webcamReady ? // Webcam Feed
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full max-w-md",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$webcam$2f$dist$2f$react$2d$webcam$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    ref: webcamRef,
                                                    audio: true,
                                                    width: "100%",
                                                    height: "auto",
                                                    videoConstraints: {
                                                        width: 640,
                                                        height: 480,
                                                        facingMode: "user"
                                                    },
                                                    onUserMedia: handleWebcamReady,
                                                    onUserMediaError: handleWebcamError,
                                                    className: "w-full h-auto"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 974,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 973,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center mt-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-neutral-600 text-sm",
                                                    children: "Camera is ready. You can see yourself in the preview above."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 990,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 989,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 972,
                                        columnNumber: 17
                                    }, this) : // Loading State
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full max-w-md bg-neutral-50 border border-neutral-200 rounded-lg p-8 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "animate-pulse",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-neutral-300 rounded-lg h-48 mb-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 999,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-neutral-600",
                                                    children: "Requesting camera access..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 1000,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                            lineNumber: 998,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 997,
                                        columnNumber: 17
                                    }, this),
                                    checkinState.webcamReady && !checkinState.webcamError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center space-y-3",
                                        children: [
                                            checkinState.isConnecting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-neutral-600 text-sm",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "animate-pulse",
                                                    children: "Connecting to emotion analysis services..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 1012,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 1011,
                                                columnNumber: 21
                                            }, this),
                                            !checkinState.isConnecting && checkinState.humeToken && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: checkinState.humeToken === 'demo-mode' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-blue-600 text-sm flex items-center justify-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-2 h-2 bg-blue-500 rounded-full"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                            lineNumber: 1020,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Demo mode ready (mock emotion data)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                            lineNumber: 1021,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 1019,
                                                    columnNumber: 25
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-green-600 text-sm flex items-center justify-center space-x-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-2 h-2 bg-green-500 rounded-full"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                                    lineNumber: 1026,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Emotion analysis ready"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                                    lineNumber: 1027,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                            lineNumber: 1025,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-center space-x-4 text-xs",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center space-x-1 ".concat(checkinState.connectionStatus.facial === 'connected' ? 'text-green-600' : checkinState.connectionStatus.facial === 'error' ? 'text-red-600' : checkinState.connectionStatus.facial === 'connecting' ? 'text-yellow-600' : 'text-gray-500'),
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-1.5 h-1.5 rounded-full ".concat(checkinState.connectionStatus.facial === 'connected' ? 'bg-green-500' : checkinState.connectionStatus.facial === 'error' ? 'bg-red-500' : checkinState.connectionStatus.facial === 'connecting' ? 'bg-yellow-500' : 'bg-gray-400')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                                            lineNumber: 1038,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "Facial"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                                            lineNumber: 1044,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                                    lineNumber: 1032,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center space-x-1 ".concat(checkinState.connectionStatus.vocal === 'connected' ? 'text-green-600' : checkinState.connectionStatus.vocal === 'error' ? 'text-red-600' : checkinState.connectionStatus.vocal === 'connecting' ? 'text-yellow-600' : 'text-gray-500'),
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-1.5 h-1.5 rounded-full ".concat(checkinState.connectionStatus.vocal === 'connected' ? 'bg-green-500' : checkinState.connectionStatus.vocal === 'error' ? 'bg-red-500' : checkinState.connectionStatus.vocal === 'connecting' ? 'bg-yellow-500' : 'bg-gray-400')
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                                            lineNumber: 1053,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "Voice AI"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                                            lineNumber: 1059,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                                    lineNumber: 1047,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                            lineNumber: 1031,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 1024,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 1017,
                                                columnNumber: 21
                                            }, this),
                                            !checkinState.isConnecting && !checkinState.humeToken && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-red-600 text-sm flex items-center justify-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-2 h-2 bg-red-500 rounded-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                        lineNumber: 1069,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Connection failed - emotion analysis unavailable"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                        lineNumber: 1070,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 1068,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 1009,
                                        columnNumber: 17
                                    }, this),
                                    checkinState.webcamReady && !checkinState.webcamError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "lg",
                                        className: "bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg disabled:bg-neutral-400",
                                        onClick: startRecording,
                                        disabled: checkinState.phase !== 'idle' || checkinState.isConnecting || !checkinState.humeToken,
                                        children: checkinState.isConnecting ? 'Connecting...' : 'Start 60-Second Check-in'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 1078,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 943,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true),
                    checkinState.phase === 'recording' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full max-w-md",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative rounded-lg overflow-hidden bg-neutral-100 border-2 border-red-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$webcam$2f$dist$2f$react$2d$webcam$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                ref: webcamRef,
                                                audio: true,
                                                width: "100%",
                                                height: "auto",
                                                videoConstraints: {
                                                    width: 640,
                                                    height: 480,
                                                    facingMode: "user"
                                                },
                                                className: "w-full h-auto"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 1102,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-2 h-2 bg-white rounded-full animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                        lineNumber: 1116,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Recording"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                        lineNumber: 1117,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 1115,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 1101,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                    lineNumber: 1100,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full max-w-md space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-3xl font-bold text-neutral-900 mb-2",
                                                    children: [
                                                        Math.floor(checkinState.timeRemaining / 60),
                                                        ":",
                                                        (checkinState.timeRemaining % 60).toString().padStart(2, '0')
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 1125,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-neutral-600 mb-2",
                                                    children: "Please describe how you've been feeling"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 1128,
                                                    columnNumber: 19
                                                }, this),
                                                checkinState.humeToken !== 'demo-mode' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-blue-600",
                                                    children: "💬 AI assistant is listening and ready to help you practice"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 1132,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                            lineNumber: 1124,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$progress$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Progress"], {
                                                    value: (60 - checkinState.timeRemaining) / 60 * 100,
                                                    className: "h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 1140,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between text-sm text-neutral-500",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "0:00"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                            lineNumber: 1145,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "1:00"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                            lineNumber: 1146,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                    lineNumber: 1144,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                            lineNumber: 1139,
                                            columnNumber: 17
                                        }, this),
                                        checkinState.emotionData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-green-50 border border-green-200 rounded-lg p-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-green-700 font-medium mb-1",
                                                        children: "Emotion Analysis Active"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                        lineNumber: 1154,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-green-600",
                                                        children: [
                                                            checkinState.emotionData.filter((d)=>d.source === 'facial').length,
                                                            " facial readings, ",
                                                            ' ',
                                                            checkinState.emotionData.filter((d)=>d.source === 'vocal').length,
                                                            " vocal readings"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                        lineNumber: 1157,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 1153,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                            lineNumber: 1152,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                    lineNumber: 1123,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-center max-w-md",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-neutral-600 text-sm",
                                        children: "Speak naturally and describe your current health concerns, symptoms, or how you've been feeling recently."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 1168,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                    lineNumber: 1167,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                            lineNumber: 1098,
                            columnNumber: 13
                        }, this)
                    }, void 0, false),
                    checkinState.phase === 'finished' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center space-y-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-green-50 border border-green-100 rounded-lg p-8 max-w-md mx-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-green-600 text-6xl mb-4",
                                        children: "✓"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 1181,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-2xl font-bold text-neutral-900 mb-2",
                                        children: "Thank You!"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 1182,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-neutral-700 mb-4",
                                        children: "Your check-in has been completed successfully."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 1185,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-neutral-600 text-sm",
                                        children: "Your healthcare provider will review this information before your appointment."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 1188,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 1180,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                            lineNumber: 1179,
                            columnNumber: 13
                        }, this)
                    }, void 0, false),
                    ("TURBOPACK compile-time value", "development") === 'development' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-neutral-400 border-t pt-4 mt-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Debug: Phase: ",
                                    checkinState.phase
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 1199,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Debug: Webcam Ready: ",
                                    checkinState.webcamReady ? 'Yes' : 'No'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 1200,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Debug: Time Remaining: ",
                                    checkinState.timeRemaining,
                                    "s"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 1201,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Debug: Error: ",
                                    checkinState.webcamError || 'None'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 1202,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Debug: Hume Token: ",
                                    checkinState.humeToken ? 'Available' : 'None'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 1203,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Debug: Expression WS: ",
                                    checkinState.humeToken === 'demo-mode' ? 'Demo Mode' : ((_checkinState_humeWebSocket = checkinState.humeWebSocket) === null || _checkinState_humeWebSocket === void 0 ? void 0 : _checkinState_humeWebSocket.readyState) === WebSocket.OPEN ? 'Connected' : 'Disconnected'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 1204,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Debug: EVI WS: ",
                                    checkinState.humeToken === 'demo-mode' ? 'Demo Mode' : ((_checkinState_eviWebSocket = checkinState.eviWebSocket) === null || _checkinState_eviWebSocket === void 0 ? void 0 : _checkinState_eviWebSocket.readyState) === WebSocket.OPEN ? 'Connected' : 'Disconnected'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 1211,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: [
                                    "Debug: Emotion Data Points: ",
                                    checkinState.emotionData.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 1218,
                                columnNumber: 13
                            }, this),
                            checkinState.emotionData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Latest Emotions:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                        lineNumber: 1221,
                                        columnNumber: 17
                                    }, this),
                                    checkinState.emotionData.slice(-3).map((point, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "ml-2 text-xs",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono",
                                                children: [
                                                    point.source,
                                                    ": Joy:",
                                                    point.emotions.joy.toFixed(2),
                                                    "Sad:",
                                                    point.emotions.sadness.toFixed(2),
                                                    "Anger:",
                                                    point.emotions.anger.toFixed(2)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                                lineNumber: 1224,
                                                columnNumber: 21
                                            }, this)
                                        }, index, false, {
                                            fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                            lineNumber: 1223,
                                            columnNumber: 19
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                                lineNumber: 1220,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                        lineNumber: 1198,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/aura/PatientCheckin.tsx",
                lineNumber: 927,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(PatientCheckin, "GcdLh8o/y9Gt1syMDzk0hYrC2Ac=");
_c = PatientCheckin;
var _c;
__turbopack_context__.k.register(_c, "PatientCheckin");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_2b0a0c48._.js.map