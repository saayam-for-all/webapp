// Lightweight i18n mapping for timezone location names (hybrid approach)
// Falls back to the IANA id if no mapping is found.

const TELUGU = {
  "America/New_York": "అమెరికా/న్యూయార్క్",
  "America/Chicago": "అమెరికా/షికాగో",
  "America/Los_Angeles": "అమెరికా/లాస్ ఏంజెల్స్",
  "America/Denver": "అమెరికా/డెన్వర్",
  "America/Phoenix": "అమెరికా/ఫీనిక్స్",
  "America/Halifax": "కెనడా/హాలిఫాక్స్",
  "America/St_Johns": "కెనడా/సెంట్ జాన్స్",
  "America/Mexico_City": "మెక్సికో/మెక్సికో సిటీ",
  "America/Bogota": "కొలంబియా/బోగోటా",
  "America/Caracas": "వెనిజులా/కారకాస్",
  "America/Sao_Paulo": "బ్రెజిల్/సావో పౌలో",
  "America/Argentina/Buenos_Aires": "అర్జెంటీనా/బ్యూనస్ ఐరీస్",
  "Europe/London": "యూరప్/లండన్",
  "Europe/Paris": "యూరప్/పారిస్",
  "Europe/Berlin": "యూరప్/బెర్లిన్",
  "Europe/Madrid": "యూరప్/మాడ్రిడ్",
  "Europe/Rome": "యూరప్/రోమ్",
  "Europe/Athens": "యూరప్/ఏథెన్స్",
  "Europe/Amsterdam": "యూరప్/ఆమ్స్టర్‌డామ్",
  "Europe/Brussels": "యూరప్/బ్రస్సెల్స్",
  "Europe/Warsaw": "యూరప్/వార్సా",
  "Europe/Helsinki": "యూరప్/హెల్సింకి",
  "Europe/Istanbul": "టర్కీ/ఇస్తాంబుల్",
  "Europe/Moscow": "రష్యా/మాస్కో",
  "Asia/Kolkata": "భారత్/కోల్‌కతా",
  "Asia/Dubai": "యుఏఈ/దుబాయి",
  "Asia/Singapore": "సింగపూర్/సింగపూర్",
  "Asia/Tokyo": "జపాన్/టోక్యో",
  "Asia/Shanghai": "చైనా/షాంఘై",
  "Asia/Seoul": "దక్షిణ కొరియా/సియోల్",
  "Asia/Hong_Kong": "హాంకాంగ్/హాంకాంగ్",
  "Asia/Bangkok": "థాయిలాండ్/బ్యాంకాక్",
  "Asia/Kuala_Lumpur": "మలేసియా/కౌలాలంపూర్",
  "Asia/Manila": "ఫిలిప్పీన్స్/మనిలా",
  "Asia/Tehran": "ఇరాన్/టెహ్రాన్",
  "Asia/Jakarta": "ఇండోనేషియా/జకార్టా",
  "Asia/Kathmandu": "నేపాల్/కాఠ్మాండు",
  "Asia/Karachi": "పాకిస్తాన్/కరాచీ",
  "Asia/Baghdad": "ఇరాక్/బాగ్దాద్",
  "Asia/Beirut": "లెబనాన్/బీరుట్",
  "Asia/Colombo": "శ్రీలంక/కొలంబో",
  "Asia/Jerusalem": "ఇజ్రాయెల్/జెరూసలేం",
  "Asia/Vladivostok": "రష్యా/వ్లాడివోస్టాక్",
  "Australia/Sydney": "ఆస్ట్రేలియా/సిడ్నీ",
  "Australia/Brisbane": "ఆస్ట్రేలియా/బ్రిస్బేన్",
  "Australia/Adelaide": "ఆస్ట్రేలియా/అడిలైడ్",
  "Australia/Perth": "ఆస్ట్రేలియా/పెర్త్",
  "Australia/Darwin": "ఆస్ట్రేలియా/డార్విన్",
  "Australia/Lord_Howe": "ఆస్ట్రేలియా/లార్డ్ హోవ్",
  "Australia/Eucla": "ఆస్ట్రేలియా/యూక్లా",
  "Pacific/Auckland": "న్యూజీలాండ్/ఆక్లాండ్",
  "Pacific/Chatham": "న్యూజీలాండ్/చాథం",
  "Pacific/Fiji": "ఫిజీ/ఫిజీ",
  "Pacific/Honolulu": "యుఎస్/హోనలులు",
  "Pacific/Midway": "యుఎస్/మిడ్‌వే",
  "Pacific/Noumea": "న్యూ కాలెడోనియా/న్యూమియా",
  "Pacific/Port_Moresby": "పాపువా న్యూ గినియా/పోర్ట్ మోర్స్‌బీ",
  "Pacific/Tongatapu": "టోంగా/టోంగాటాపు",
  "Pacific/Easter": "చిలీ/ఈస్టర్ దీవి",
  "Pacific/Majuro": "మార్షల్ దీవులు/మజురో",
  "Pacific/Kiritimati": "కిరిబాటి/కిరితిమతి",
  "Atlantic/Azores": "పోర్చుగల్/అజోరెస్",
  "Atlantic/Cape_Verde": "కేప్ వెర్డే/కేప్ వెర్డే",
  UTC: "సర్వలోక సమయం (UTC)",
};

const MAP_BY_LANG = {
  "te-IN": TELUGU,
};

export function getLocalizedLocationName(timezoneId, language) {
  if (!timezoneId) return "";
  const lang = language || "en-US";
  const langMap = MAP_BY_LANG[lang];
  if (langMap && langMap[timezoneId]) return langMap[timezoneId];
  // Default: prettify IANA id for display in other languages
  return timezoneId.replace(/_/g, " ");
}

export default getLocalizedLocationName;
