// https://stackoverflow.com/questions/5437674/what-unicode-characters-represent-time
// https://russellcottrell.com/greek/utilities/SurrogatePairCalculator.htm

const emojiLogin = [
  '\uD83D\uDE01', // 😁
  '\uD83D\uDE02', // 😂
  '\uD83D\uDE03', // 😃
  '\uD83D\uDE04', // 😄
  '\uD83D\uDE05', // 😅
  '\uD83D\uDE06', // 😆
  '\uD83D\uDE09', // 😉
  '\uD83D\uDE0A', // 😊
  '\uD83D\uDE0B', // 😋
  '\uD83D\uDE0C', // 😌
  '\uD83D\uDE0D', // 😍
  '\uD83D\uDE0F', // 😏
  '\uD83D\uDE12', // 😒
  '\uD83D\uDE13', // 😓
  '\uD83D\uDE14', // 😔
  '\uD83D\uDE16', // 😖
  '\uD83D\uDE18', // 😘
  '\uD83D\uDE1A', // 😚
  '\uD83D\uDE1C', // 😜
  '\uD83D\uDE1D', // 😝
  '\uD83D\uDE1E', // 😞
  '\uD83D\uDE20', // 😠
  '\uD83D\uDE21', // 😡
  '\uD83D\uDE22', // 😢
  '\uD83D\uDE23', // 😣
  '\uD83D\uDE24', // 😤
  '\uD83D\uDE25', // 😥
  '\uD83D\uDE28', // 😨
  '\uD83D\uDE29', // 😩
  '\uD83D\uDE2A', // 😪
  '\uD83D\uDE2B', // 😫
  '\uD83D\uDE2D', // 😭
  '\uD83D\uDE30', // 😰
  '\uD83D\uDE31', // 😱
  '\uD83D\uDE32', // 😲
  '\uD83D\uDE33', // 😳
  '\uD83D\uDE35', // 😵
  '\uD83D\uDE37', // 😷
  '\uD83D\uDE38', // 😸
  '\uD83D\uDE39', // 😹
  '\uD83D\uDE3A', // 😺
  '\uD83D\uDE3B', // 😻
  '\uD83D\uDE3C', // 😼
  '\uD83D\uDE3D', // 😽
  '\uD83D\uDE3E', // 😾
  '\uD83D\uDE3F', // 😿
  '\uD83D\uDE40', // 🙀
  '\uD83D\uDC76', // 👶
  '\uD83E\uDDD2', // 🧒
  '\uD83D\uDC67', // 👧
  '\uD83D\uDC68', // 👨
  '\uD83E\uDDD4', // 🧔
  '\uD83D\uDC69', // 👩
  '\uD83D\uDC73\u200D\u2642\uFE0F', // 👳‍♂️
  '\uD83D\uDC69\u200D\uD83E\uDDB2', // 👩‍🦲
  '\uD83D\uDC73\u200D\u2640\uFE0F', // 👳‍♀️
  '\uD83E\uDDD3', // 🧓
  '\uD83D\uDC75', // 👵
  '\uD83D\uDC70', // 👰
  '\uD83D\uDC68', // 👨‍🦰
  '\uD83D\uDC7C', // 👨‍🦰
  '\uD83D\uDD75\uFE0F\u200D\u2642\uFE0F', // 🕵️‍♂️
  '\uD83E\uDD37\u200D\u2640\uFE0F', // 🤷‍♀️
  '\uD83E\uDD26\u200D\u2640\uFE0F', // 🤦‍♀️
  '\uD83E\uDDD9\u200D\u2640\uFE0F', // 🧙‍♀️
  '\uD83E\uDD84', // 🦄
  '\uD83D\uDC30', // 🐰
  '\uD83E\uDD94', // 🦔
  '\uD83D\uDC37', // 🐷
  '\uD83D\uDC35', // 🐵
  '\uD83D\uDC12', // 🐒
  '\uD83E\uDD9D', // 🦝
  '\uD83D\uDC13', // 🐓
  '\uD83D\uDC3B', // 🐻
  '\uD83E\uDD8A', // 🦊
  '\uD83D\uDC22', // 🐢
  '\uD83C\uDF83', // 🎃
  '\uD83D\uDC29', // 🐩
  '\uD83E\uDD91', // 🦑
  '\uD83E\uDD9A', // 🦚
  '\uD83D\uDC1E', // 🐞
  '\uD83E\uDD8B', // 🦋
  '\uD83D\uDD77\uFE0F', // 🕷️
  '\uD83D\uDC38', // 🐸
  '\uD83C\uDF3C', // 🌼
  '\uD83C\uDF3B', // 🌻
  '\uD83C\uDF35', // 🌵
  '\uD83C\uDF44', // 🍄
  '\uD83C\uDF77', // 🍷
  '\uD83C\uDF7A', // 🍺
  '\uD83D\uDE93', // 🚓
  '\uD83D\uDE9C', // 🚜
  '\uD83D\uDE94', // 🚔
  '\uD83D\uDE89', // 🚉
  '\uD83D\uDE81', // 🚁
  '\uD83C\uDF4C', // 🍌
  '\uD83C\uDF4B', // 🍋
  '\uD83C\uDF53', // 🍓
  '\uD83C\uDF52', // 🍒
  '\uD83C\uDF47', // 🍇
  '\uD83C\uDF49', // 🍉
  '\uD83E\uDD51', // 🥑
  '\uD83E\uDD55', // 🥕
  '\uD83C\uDF56', // 🍖
  '\uD83D\uDCA5', // 💥
  '\u2B50', // ⭐
];

export default emojiLogin;
