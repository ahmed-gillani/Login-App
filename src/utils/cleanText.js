export function cleanText(input) {
  if (!input) return "";
  let text = String(input);

  // Remove unwanted prefixes
  text = text.replace(/data:\s*/gi, "")
             .replace(/AssistantAssistant/gi, "")
             .replace(/YouYou/gi, "");

  // Fix common acronyms
  const acronyms = {
    "S N F": "SNF",
    "R N": "RN",
    "L P N": "LPN",
    "C N A": "CNA",
    "P T": "PT",
    "O T": "OT",
    "S L P": "SLP",
    "E V S": "EVS",
    "AD Ls": "ADLs"
  };
  Object.entries(acronyms).forEach(([k, v]) => {
    text = text.replace(new RegExp(`\\b${k.split("").join("\\s*")}\\b`, "gi"), v);
  });

  // Fix minor splits and hyphenated words
  const minorFixes = {
    "Sk illed Nursing Facility": "Skilled Nursing Facility",
    "occup ational therapy": "occupational therapy",
    "post - acute": "post-acute",
    "long - term care": "long-term care",
    "co or dination": "coordination",
    "co or dinate": "coordinate",
    "co or dinates": "coordinates",
    "monit or ing" : "monitoring",
    "supp or t": "support",
    "supp or ting": "supporting",
    "supp or tive": "supportive",
    "regulat or y": "regulatory",
    "rep or ting": "reporting",
    "SN Fs": "SNFs",
    "SN F": "SNF",
    "sh or t-term": "short-term",
    "st and ards": "standards",
    "fe ver": "fever",
    "comf or t": "comfort",
    "w or sen": "worsen"
  };
  Object.entries(minorFixes).forEach(([k, v]) => {
    text = text.replace(new RegExp(k.split("").join("\\s*"), "gi"), v);
  });

  // Merge single-letter splits in words (e.g., "M o n i t o r i n g" → "Monitoring")
  text = text.replace(/\b(\w(?:\s+\w){1,})\b/g, (match) => {
    // Remove internal spaces if it looks like broken letters
    const noSpaces = match.replace(/\s+/g, '');
    // Only replace if reasonable length (avoid merging normal words)
    return noSpaces.length > 2 && noSpaces.length <= 20 ? noSpaces : match;
  });

  // Normalize punctuation and spacing
  text = text.replace(/\s*([,.:;!?])/g, "$1")
             .replace(/([,.:;!?])([^\s])/g, "$1 $2")
             .replace(/\(\s+/g, "(")
             .replace(/\s+\)/g, ")")
             .replace(/\)([^\s])/g, ") $1")
             .replace(/\s*\/\s*/g, "/")
             .replace(/\b(\w+)and(\w+)\b/g, "$1 and $2")
             .replace(/\b(\w+)or(\w+)\b/g, "$1 or $2")
             .replace(/\s+/g, " ")
             .replace(/\s*\n\s*/g, "\n")
             .replace(/\n{2,}/g, "\n\n");

  // Convert sentences starting with . or - into bullet points
  text = text
    .split(/(?<=\.)\s+/)
    .map(sentence => {
      sentence = sentence.trim();
      if (sentence.startsWith(".") || sentence.startsWith("-")) {
        return "- " + sentence.replace(/^[\.-]+\s*/, "");
      }
      return sentence;
    })
    .join("\n");

  // Ensure consistent spacing for bullets
  text = text.replace(/\n-\s+/g, "\n- ");

  return text.trim();
}
