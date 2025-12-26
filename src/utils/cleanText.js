export function cleanText(input) {
  if (!input) return "";
  let text = String(input);

  text = text.replace(/data:\s*/gi, "")
             .replace(/AssistantAssistant/gi, "")
             .replace(/YouYou/gi, "");

  const fixes = {
    "S N F": "SNF", "R N": "RN", "L P N": "LPN",
    "C N A": "CNA", "P T": "PT", "O T": "OT",
    "S L P": "SLP", "E V S": "EVS"
  };
  Object.entries(fixes).forEach(([k,v])=>{
    text = text.replace(new RegExp(`\\b${k.replace(/ /g,"\\s*")}\\b`,"gi"),v);
  });

  const commonWords = ["short","long","term","care","rehabilitation","nursing","respiratory","compliance","dietary","case","management","therapists","facility"];
  commonWords.forEach(word=>{
    text = text.replace(new RegExp(word.split("").join("\\s*"),"gi"), word);
  });

  text = text.replace(/\s*([,.:;!?])/g,"$1")
             .replace(/([,.:;!?])([^\s])/g,"$1 $2")
             .replace(/\(\s+/g,"(").replace(/\s+\)/g,")")
             .replace(/\)([^\s])/g,") $1")
             .replace(/\s*\/\s*/g,"/")
             .replace(/\b(\w+)and(\w+)\b/g,"$1 and $2")
             .replace(/\b(\w+)or(\w+)\b/g,"$1 or $2")
             .replace(/\n?\s*-\s*/g,"\n- ")
             .replace(/\s+/g," ")
             .replace(/\s+\n/g,"\n")
             .replace(/\n\s+/g,"\n")
             .replace(/\n{2,}/g,"\n\n");

  return text.trim();
}
