import type { Lang } from "../i18n/langs";

/** Frase en japonés con su significado en cada idioma de la interfaz. */
export type Phrase = { jp: string; romaji: string; meaning: Record<Lang, string> };

export type PhraseGroup = { id: string; title: Record<Lang, string>; phrases: Phrase[] };

export const PHRASE_GROUPS: PhraseGroup[] = [
  {
    id: "basics",
    title: { es: "Básicas", ca: "Bàsiques", en: "Basics", fr: "L’essentiel" },
    phrases: [
      {
        jp: "すみません",
        romaji: "Sumimasen",
        meaning: {
          es: "Perdón / disculpe",
          ca: "Perdó / disculpi",
          en: "Excuse me / sorry",
          fr: "Pardon / excusez-moi",
        },
      },
      {
        jp: "ありがとうございます",
        romaji: "Arigatō gozaimasu",
        meaning: { es: "Muchas gracias", ca: "Moltes gràcies", en: "Thank you very much", fr: "Merci beaucoup" },
      },
      {
        jp: "英語を話せますか？",
        romaji: "Eigo o hanasemasu ka?",
        meaning: {
          es: "¿Habla inglés?",
          ca: "Parla anglès?",
          en: "Do you speak English?",
          fr: "Parlez-vous anglais ?",
        },
      },
      {
        jp: "トイレはどこですか？",
        romaji: "Toire wa doko desu ka?",
        meaning: {
          es: "¿Dónde está el baño?",
          ca: "On és el lavabo?",
          en: "Where is the toilet?",
          fr: "Où sont les toilettes ?",
        },
      },
    ],
  },
  {
    id: "food",
    title: { es: "Comer", ca: "Menjar", en: "Eating out", fr: "Au restaurant" },
    phrases: [
      {
        jp: "二人です",
        romaji: "Futari desu",
        meaning: { es: "Somos dos", ca: "Som dos", en: "There are two of us", fr: "Nous sommes deux" },
      },
      {
        jp: "英語のメニューはありますか？",
        romaji: "Eigo no menyū wa arimasu ka?",
        meaning: {
          es: "¿Tienen menú en inglés?",
          ca: "Tenen la carta en anglès?",
          en: "Do you have an English menu?",
          fr: "Avez-vous un menu en anglais ?",
        },
      },
      {
        jp: "これをください",
        romaji: "Kore o kudasai",
        meaning: { es: "Esto, por favor", ca: "Això, si us plau", en: "This one, please", fr: "Ceci, s’il vous plaît" },
      },
      {
        jp: "お会計お願いします",
        romaji: "O-kaikei onegaishimasu",
        meaning: {
          es: "La cuenta, por favor",
          ca: "El compte, si us plau",
          en: "The bill, please",
          fr: "L’addition, s’il vous plaît",
        },
      },
      {
        jp: "おすすめは何ですか？",
        romaji: "Osusume wa nan desu ka?",
        meaning: {
          es: "¿Qué me recomienda?",
          ca: "Què em recomana?",
          en: "What do you recommend?",
          fr: "Que me conseillez-vous ?",
        },
      },
    ],
  },
  {
    id: "transport",
    title: { es: "Moverse", ca: "Desplaçar-se", en: "Getting around", fr: "Se déplacer" },
    phrases: [
      {
        jp: "この住所までお願いします",
        romaji: "Kono jūsho made onegaishimasu",
        meaning: {
          es: "A esta dirección, por favor",
          ca: "A aquesta adreça, si us plau",
          en: "To this address, please",
          fr: "À cette adresse, s’il vous plaît",
        },
      },
      {
        jp: "この電車は京都に行きますか？",
        romaji: "Kono densha wa Kyōto ni ikimasu ka?",
        meaning: {
          es: "¿Este tren va a Kioto?",
          ca: "Aquest tren va a Kyoto?",
          en: "Does this train go to Kyoto?",
          fr: "Ce train va-t-il à Kyoto ?",
        },
      },
      {
        jp: "荷物を預かってもらえますか？",
        romaji: "Nimotsu o azukatte moraemasu ka?",
        meaning: {
          es: "¿Pueden guardarnos el equipaje?",
          ca: "Ens poden guardar l’equipatge?",
          en: "Could you keep our luggage?",
          fr: "Pouvez-vous garder nos bagages ?",
        },
      },
      {
        jp: "宅急便で送りたいです",
        romaji: "Takkyūbin de okuritai desu",
        meaning: {
          es: "Queremos enviarlo con Takkyubin",
          ca: "Volem enviar-ho amb Takkyubin",
          en: "We’d like to send it by Takkyubin",
          fr: "Nous voudrions l’envoyer par Takkyubin",
        },
      },
    ],
  },
  {
    id: "shopping",
    title: { es: "Compras", ca: "Compres", en: "Shopping", fr: "Achats" },
    phrases: [
      {
        jp: "カードで払えますか？",
        romaji: "Kādo de haraemasu ka?",
        meaning: {
          es: "¿Se puede pagar con tarjeta?",
          ca: "Es pot pagar amb targeta?",
          en: "Can I pay by card?",
          fr: "Puis-je payer par carte ?",
        },
      },
      {
        jp: "免税できますか？",
        romaji: "Menzei dekimasu ka?",
        meaning: {
          es: "¿Puedo comprar tax free?",
          ca: "Puc comprar tax free?",
          en: "Can I buy this tax-free?",
          fr: "Puis-je acheter en détaxe ?",
        },
      },
      {
        jp: "袋はいりません",
        romaji: "Fukuro wa irimasen",
        meaning: {
          es: "No necesito bolsa",
          ca: "No necessito bossa",
          en: "I don’t need a bag",
          fr: "Je n’ai pas besoin de sac",
        },
      },
    ],
  },
  {
    id: "emergency",
    title: { es: "Emergencia", ca: "Emergència", en: "Emergency", fr: "Urgence" },
    phrases: [
      {
        jp: "助けてください",
        romaji: "Tasukete kudasai",
        meaning: {
          es: "¡Ayuda, por favor!",
          ca: "Ajuda, si us plau!",
          en: "Help, please!",
          fr: "À l’aide, s’il vous plaît !",
        },
      },
      {
        jp: "病院に連れて行ってください",
        romaji: "Byōin ni tsurete itte kudasai",
        meaning: {
          es: "Llévenos al hospital, por favor",
          ca: "Porti’ns a l’hospital, si us plau",
          en: "Please take us to the hospital",
          fr: "Emmenez-nous à l’hôpital, s’il vous plaît",
        },
      },
      {
        jp: "パスポートをなくしました",
        romaji: "Pasupōto o nakushimashita",
        meaning: {
          es: "He perdido el pasaporte",
          ca: "He perdut el passaport",
          en: "I’ve lost my passport",
          fr: "J’ai perdu mon passeport",
        },
      },
    ],
  },
];

export const EMERGENCY: { label: Record<Lang, string>; number: string }[] = [
  { label: { es: "Policía", ca: "Policia", en: "Police", fr: "Police" }, number: "110" },
  {
    label: {
      es: "Ambulancia y bomberos",
      ca: "Ambulància i bombers",
      en: "Ambulance and fire",
      fr: "Ambulance et pompiers",
    },
    number: "119",
  },
  {
    label: {
      es: "Japan Visitor Hotline (inglés, 24 h)",
      ca: "Japan Visitor Hotline (anglès, 24 h)",
      en: "Japan Visitor Hotline (English, 24/7)",
      fr: "Japan Visitor Hotline (anglais, 24 h/24)",
    },
    number: "050-3816-2787",
  },
  {
    label: {
      es: "Embajada de España en Tokio",
      ca: "Ambaixada d’Espanya a Tòquio",
      en: "Embassy of Spain in Tokyo",
      fr: "Ambassade d’Espagne à Tokyo",
    },
    number: "03-3583-8531",
  },
];
