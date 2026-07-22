hljs.registerLanguage(
  "flint",
  (function () {
    "use strict";
    return function (e) {
      var t = "str void anyerror opaque fn bp mut const persistent bool bool8 u8 u8x2 u8x3 u8x4 u8x8 i8 i8x2 i8x3 i8x4 i8x8 u16 u16x2 u16x3 u16x4 u16x8 i16 i16x2 i16x3 i16x4 i16x8 u32 u32x2 u32x3 u32x4 u32x8 i32 i32x2 i32x3 i32x4 i32x8 u64 u64x2 u64x3 u64x4 i64 i64x2 i64x3 i64x4 f32 f32x2 f32x3 f32x4 f32x8 f64 f64x2 f64x2 f64x3 f64x4 int float";
      var keywords = {
        $pattern: e.IDENT_RE + "!?",
        keyword: "use as extern def data func interface object enum error variant requires implements return throw catch if else do while for in continue break switch spawn sync async type",
        literal: "true false none null",
        built_in: t,
      };
      var commonModes = [
        e.C_LINE_COMMENT_MODE,
        e.COMMENT("/\\*", "\\*/", { contains: ["self"] }),
        { className: "symbol", begin: /'[a-zA-Z_][a-zA-Z0-9_]*/ },
        { className: "literal", begin: "\\b[A-Z_][A-Z0-9_]*\\b" },
        {
          className: "type",
          begin: "\\b[A-Z_][a-zA-Z0-9_]*\\b|\\?(?=[^.?\\(\\[])",
        },
        { className: "operator", begin: "::\\b" },
        { className: "function", begin: "(?<=::)[a-z_][a-zA-Z0-9_]*" },
        {
          className: "operator",
          begin:
            "\\+\\+|--|==|!=|<=|>=|\\+=|-=|\\*=|/=|:=|=|<|>|::|\\+|-|\\*|/|&|!\\.|!|\\*|%|\\|>|\\?\\.|\\?\\?|\\?(?=\\()",
        },
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
          beginKeywords: "data func interface object variant enum error",
          end: ":",
          contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, { endsParent: !0 })],
          illegal: "[\\w\\d]",
        },
        { begin: e.IDENT_RE + "::", keywords: { built_in: t } },
        { begin: "->" },
        {
          className: "function",
          begin: "\\b[a-z_][a-zA-Z0-9_]*\\s*(?=\\()",
        },
      ];
      var normalString = e.inherit(e.QUOTE_STRING_MODE, { begin: /b?"/, illegal: null });
      var otherString = { className: "string", variants: [{ begin: /r(#*)"(.|\n)*?"\1(?!#)/ }, { begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/ }] };
      var subst = {
        className: "subst",
        begin: /\{/,
        end: /\}/,
        contains: []
      };
      var interpolatedString = {
        className: "string",
        begin: /\$"/,
        end: /"/,
        contains: [e.BACKSLASH_ESCAPE, subst]
      };
      subst.contains = [
        "self",
        normalString,
        otherString,
        interpolatedString,
        ...commonModes
      ];
      var contains = [
        ...commonModes,
        normalString,
        otherString,
        interpolatedString
      ];
      return {
        name: "Flint",
        aliases: ["flint", "ft"],
        keywords: keywords,
        illegal: "</",
        contains: contains,
      };
    };
  })(),
);
