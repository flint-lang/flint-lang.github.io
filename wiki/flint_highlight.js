hljs.registerLanguage(
  "flint",
  (function () {
    "use strict";
    return function (e) {
      var t = "u8 i32 i64 u8 u32 u64 f32 f64 str bool bool8 fn bp i32x2 i32x3 i32x4 i32x8 i64x2 i62x3 i64x4 f32x2 f32x3 f32x4 f64x2 f64x3 f64x4 mut const";
      return {
        name: "Flint",
        aliases: ["flint", "ft"],
        keywords: {
          $pattern: e.IDENT_RE + "!?",
          keyword: "use extern def data func entity enum error variant requires extends link hook return throw catch if else do while for in continue break spawn sync async",
          literal: "true false none",
          built_in: t,
        },
        illegal: "</",
        contains: [
          e.C_LINE_COMMENT_MODE,
          e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
          e.inherit(e.QUOTE_STRING_MODE, { begin: /b?"/, illegal: null }),
          { className: "string", variants: [{ begin: /r(#*)"(.|\n)*?"\1(?!#)/ }, { begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/ }] },
          { className: "symbol", begin: /'[a-zA-Z_][a-zA-Z0-9_]*/ },
          { className: "literal", begin: "\\b[A-Z_][A-Z0-9_]*\\b" },
          { className: "type", begin: "\\b[A-Z_][a-zA-Z0-9_]*\\b" },
          { className: "operator", begin: "\\+\\+|--|==|!=|<=|>=|\\+=|-=|\\*=|/=|:=|=|<|>|::|\\+|-|\\*|/|!\\.|!|\\*|%|\\|>|\\?\\.|\\?\\?|\\?(?=\\()" },
          {
            className: "number",
            variants: [
              { begin: "\\b0b([01_]+)" },
              { begin: "\\b0o([0-7_]+)" },
              { begin: "\\b0x([A-Fa-f0-9_]+)" },
              { begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" },
            ],
            relevance: 0,
          },
          { className: "function", beginKeywords: "def", end: "(\\(|<)", excludeEnd: !0, contains: [e.UNDERSCORE_TITLE_MODE] },
          {
            className: "class",
            beginKeywords: "data func entity variant enum error",
            end: ":",
            contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, { endsParent: !0 })],
            illegal: "[\\w\\d]",
          },
          { begin: e.IDENT_RE + "::", keywords: { built_in: t } },
          { begin: "->" },
        ],
      };
    };
  })(),
);
