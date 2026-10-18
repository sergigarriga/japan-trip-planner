export type Phrase = { jp: string; romaji: string; es: string };

export const PHRASE_GROUPS: { title: string; phrases: Phrase[] }[] = [
  {
    title: "Básicas",
    phrases: [
      { jp: "すみません", romaji: "Sumimasen", es: "Perdón / disculpe" },
      { jp: "ありがとうございます", romaji: "Arigatō gozaimasu", es: "Muchas gracias" },
      { jp: "英語を話せますか？", romaji: "Eigo o hanasemasu ka?", es: "¿Habla inglés?" },
      { jp: "トイレはどこですか？", romaji: "Toire wa doko desu ka?", es: "¿Dónde está el baño?" },
    ],
  },
  {
    title: "Comer",
    phrases: [
      { jp: "二人です", romaji: "Futari desu", es: "Somos dos" },
      { jp: "英語のメニューはありますか？", romaji: "Eigo no menyū wa arimasu ka?", es: "¿Tienen menú en inglés?" },
      { jp: "これをください", romaji: "Kore o kudasai", es: "Esto, por favor" },
      { jp: "お会計お願いします", romaji: "O-kaikei onegaishimasu", es: "La cuenta, por favor" },
      { jp: "おすすめは何ですか？", romaji: "Osusume wa nan desu ka?", es: "¿Qué me recomienda?" },
    ],
  },
  {
    title: "Moverse",
    phrases: [
      { jp: "この住所までお願いします", romaji: "Kono jūsho made onegaishimasu", es: "A esta dirección, por favor" },
      {
        jp: "この電車は京都に行きますか？",
        romaji: "Kono densha wa Kyōto ni ikimasu ka?",
        es: "¿Este tren va a Kioto?",
      },
      {
        jp: "荷物を預かってもらえますか？",
        romaji: "Nimotsu o azukatte moraemasu ka?",
        es: "¿Pueden guardarnos el equipaje?",
      },
      { jp: "宅急便で送りたいです", romaji: "Takkyūbin de okuritai desu", es: "Queremos enviarlo con Takkyubin" },
    ],
  },
  {
    title: "Compras",
    phrases: [
      { jp: "カードで払えますか？", romaji: "Kādo de haraemasu ka?", es: "¿Se puede pagar con tarjeta?" },
      { jp: "免税できますか？", romaji: "Menzei dekimasu ka?", es: "¿Puedo comprar tax free?" },
      { jp: "袋はいりません", romaji: "Fukuro wa irimasen", es: "No necesito bolsa" },
    ],
  },
  {
    title: "Emergencia",
    phrases: [
      { jp: "助けてください", romaji: "Tasukete kudasai", es: "¡Ayuda, por favor!" },
      {
        jp: "病院に連れて行ってください",
        romaji: "Byōin ni tsurete itte kudasai",
        es: "Llévenos al hospital, por favor",
      },
      { jp: "パスポートをなくしました", romaji: "Pasupōto o nakushimashita", es: "He perdido el pasaporte" },
    ],
  },
];

export const EMERGENCY = [
  { label: "Policía", number: "110" },
  { label: "Ambulancia y bomberos", number: "119" },
  { label: "Japan Visitor Hotline (inglés, 24 h)", number: "050-3816-2787" },
  { label: "Embajada de España en Tokio", number: "03-3583-8531" },
];
