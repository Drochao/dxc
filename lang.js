/**
 * ODYSSEY · 多语言文本
 *
 * 用法：语言包以「游戏内的英文原文」为键，渲染时自动查表替换。
 * 所以改文案只需要改这里，不用动 index.html 里的调用点。
 * 英文（en）不写字典，直接显示原文。
 *
 * 动态文本用 tpl.* 模板，占位符写成 {a} {b} {n}。
 */

window.ODYSSEY_LANG = {
  // 语言列表：code 与 settings.lang 对应，font 为渲染时优先使用的字体
  languages: [
    {
      code: 'en',
      name: 'ENGLISH',
      font: '"Courier New", ui-monospace, monospace',
    },
    {
      code: 'zh',
      name: '中文',
      font: '"Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif',
    },
    {
      code: 'ja',
      name: '日本語',
      font: '"Yu Gothic", "Hiragino Sans", "Meiryo", "Noto Sans JP", sans-serif',
    },
  ],

  dict: {
    /* ============ English（只登记模板，其余直接用原文） ============ */
    en: {
      'tpl.act': 'ACT {a} / {b}',
      'tpl.actBanner': 'ACT {n}',
      'tpl.foes': 'FOES {n}',
      'tpl.coins': 'COINS {n}',
      'tpl.room': 'ROOM {a} / {b}',
      'tpl.saved': 'SAVED · ACT {a} · ROOM {b}',
      'tpl.hint': 'WASD MOVE   {bow} BOW   {block} BLOCK   {sword} SWORD   M MAP',
      'tpl.mapInfo': 'ACT {a} / {b}   ·   ROOM {c} / {d}',
    },

    /* ============ 简体中文 ============ */
    zh: {
      // 标题页
      'ODYSSEY': '奥德赛',
      'THE HOMECOMING': '归乡',
      'TEN YEARS AT TROY. TEN YEARS AT SEA.': '特洛伊十年，海上又是十年。',
      'THE GODS TOOK EVERY SHIP BUT ONE.': '神明只留下一条船。',
      'RETURN TO ITHACA AND RECLAIM YOUR HALL.': '回到伊萨卡，夺回你的宫殿。',
      'PRESS  ENTER  TO  SAIL': '按 ENTER 起航',
      'PRESS  ENTER  TO  CONTINUE': '按 ENTER 继续',
      'START': '开始游戏',
      'CONTINUE': '继续游戏',
      'NEW GAME': '新的航海',
      'PRESS  N  FOR  NEW  GAME': '按 N 开始新的航海',
      'PRESS  S  FOR  SETTINGS': '按 S 打开设置',
      '3 ACTS · 12 ROOMS · 3 BOSSES': '三幕 · 十二间房 · 三位首领',

      // HUD
      'HP': '生命',
      'SP': '体力',
      'ENTER': '进入',
      'WAY UNSEALED': '通路已开启',
      'DROWSY': '困倦',
      'BLOCK': '格挡',
      'KO': '击倒',
      'REINFORCEMENTS': '援军抵达',
      'A GIFT FROM THE GODS': '神明的赠礼',
      '+1 HP': '生命 +1',

      // 房间与地图标签
      'AMBUSH': '遭遇战',
      'TRIAL': '试炼',
      'BOSS': '首领',
      'SHORE': '海岸',
      'VOYAGE MAP': '航海图',
      'CLEARED': '已通过',
      'CURRENT': '当前',
      'UNKNOWN': '未探索',
      'PRESS  M  TO  CLOSE': '按 M 关闭',

      // 幕名
      'THE SACK OF ISMARUS': '伊斯马罗斯的劫掠',
      'THE LOTUS SHORE': '食莲人之地',
      'THE CYCLOPS ISLE': '独眼巨人之岛',
      'SAILING': '航行中',

      // 首领
      'THE CHARIOTEER': '战车长',
      'THE LOTUS KING': '食莲人王',
      'POLYPHEMUS': '波吕斐摩斯',

      // 弓与箭演出
      'THE BOW OF ODYSSEUS': '奥德修斯之弓',
      'ONLY ODYSSEUS CAN STRING THIS BOW': '唯有奥德修斯能拉开此弓',

      // 战败过场
      'THE CITY HOLDS': '城池未破',
      'DAWN BRINGS THEIR ARMIES': '黎明带来他们的援军',
      'WE LEAVE ISMARUS WITH SIX MEN LESS': '我们离开伊斯马罗斯，少了六个人',

      // 结算与死亡
      'TO BE CONTINUED': '未完待续',
      'POLYPHEMUS FALLS. THE SEA IS STILL.': '波吕斐摩斯倒下了，海面依旧平静。',
      'ITHACA LIES BEYOND THIS SHORE.': '伊萨卡就在这片海岸之外。',
      'THE VOYAGE CONTINUES.': '航行仍在继续。',
      'THE SEA TAKES YOU': '大海带走了你',
      'ITHACA REMAINS UNREACHED': '伊萨卡终未抵达',
      'PRESS  R  TO  RETRY': '按 R 重试',
      'PRESS  R  TO  SAIL  AGAIN': '按 R 再次起航',

      // 暂停与设置
      'PAUSED': '已暂停',
      'PRESS  P  TO  RESUME': '按 P 继续',
      'PRESS  S  FOR  SETTINGS': '按 S 打开设置',
      'SETTINGS': '设置',
      'BGM': '音乐',
      'SFX': '音效',
      'BOW': '射箭',
      'SWORD': '挥剑',
      'LANGUAGE': '语言',
      'FULLSCREEN': '全屏',
      'RESET TO DEFAULT': '恢复默认',
      'BACK': '返回',
      'W/S SELECT   A/D ADJUST   ENTER CONFIRM': 'W/S 选择   A/D 调整   ENTER 确认',
      'ESC BACK': 'ESC 返回',
      'PRESS A KEY': '请按键',
      'ON': '开',
      'OFF': '关',

      // 敌人名（供图鉴与提示使用）
      'CITIZEN': '民众',
      'SOLDIER': '士兵',
      'SKELETON': '亡者',
      'LOTUS EATER': '食莲者',
      'CYCLOPS': '独眼巨人',

      // 道具：名称
      'BOWSTRING OF HEPHAESTUS': '赫菲斯托斯的弓弦',
      'SANDALS OF HERMES': '赫尔墨斯的凉鞋',
      'QUIVER OF ARTEMIS': '阿尔忒弥斯的箭袋',
      'GREAVES OF ACHILLES': '阿喀琉斯的胫甲',
      'AEGIS OF ATHENA': '雅典娜的埃癸斯',
      'HAMMER OF HEPHAESTUS': '赫菲斯托斯的锻锤',
      'THE GOLDEN FLEECE': '金羊毛',
      'HERB OF CIRCE': '喀耳刻的药草',
      'TRIDENT OF POSEIDON': '波塞冬的三叉戟之赐',
      'CRESCENT OF ARTEMIS': '阿尔忒弥斯的月牙',
      'EMBER OF HEPHAESTUS': '赫菲斯托斯的火种',
      'GAZE OF ATHENA': '雅典娜的凝视',
      'WINGS OF HERMES': '赫尔墨斯的羽翼',
      'EYE OF THE CYCLOPS': '独眼巨人的眼球',
      'TRIDENT STRIKE': '三叉戟突刺',
      'AEGIS WALL': '埃癸斯之墙',
      "CIRCE'S DRAUGHT": '喀耳刻的变形药',
      "HERMES' DASH": '赫尔墨斯冲刺',
      'HEART OF THE SEA': '深海之心',
      'ARROW BUNDLE': '箭束',
      'SIREN SCALE': '塞壬的鳞片',
      'HELM OF HADES': '哈迪斯的头盔',
      'SONG OF THE SIRENS': '塞壬之歌',
      "TITAN'S CHAIN": '泰坦的枷锁',

      // 道具：描述
      'ARROW DAMAGE +1': '箭矢伤害 +1',
      'MOVE SPEED +15%': '移速 +15%',
      'BOW COOLDOWN -20%': '射箭冷却 -20%',
      'MAX HP +1': '生命上限 +1',
      'BLOCK COST -40%': '格挡消耗 -40%',
      'SWORD DAMAGE +1': '挥剑伤害 +1',
      'BARRELS DROP MORE COINS': '木桶掉落更多金币',
      '25% CHANCE TO HEAL ON KILL': '击杀时有 25% 概率回血',

      // 动态模板
      'tpl.act': '第 {a} 幕 / {b}',
      'tpl.actBanner': '第 {n} 幕',
      'tpl.foes': '敌人 {n}',
      'tpl.coins': '金币 {n}',
      'tpl.room': '房间 {a} / {b}',
      'tpl.saved': '存档 · 第 {a} 幕 · 第 {b} 间',
      'tpl.hint': 'WASD 移动   {bow} 射箭   {block} 格挡   {sword} 挥剑   M 地图',
      'tpl.mapInfo': '第 {a} 幕 / {b}   ·   房间 {c} / {d}',
    },

    /* ============ 日本語 ============ */
    ja: {
      // タイトル
      'ODYSSEY': 'オデュッセイア',
      'THE HOMECOMING': '帰郷',
      'TEN YEARS AT TROY. TEN YEARS AT SEA.': 'トロイアに十年、海に十年。',
      'THE GODS TOOK EVERY SHIP BUT ONE.': '神々は一艘を残して全ての船を奪った。',
      'RETURN TO ITHACA AND RECLAIM YOUR HALL.': 'イタケへ帰り、館を取り戻せ。',
      'PRESS  ENTER  TO  SAIL': 'ENTER で出航',
      'PRESS  ENTER  TO  CONTINUE': 'ENTER で続ける',
      'START': 'ゲーム開始',
      'CONTINUE': '続きから',
      'NEW GAME': '新しい航海',
      'PRESS  N  FOR  NEW  GAME': 'N で新しい航海',
      'PRESS  S  FOR  SETTINGS': 'S で設定',
      '3 ACTS · 12 ROOMS · 3 BOSSES': '三幕・十二部屋・三体のボス',

      // HUD
      'HP': '体力',
      'SP': '気力',
      'ENTER': '入る',
      'WAY UNSEALED': '道が開いた',
      'DROWSY': '眠気',
      'BLOCK': 'ガード',
      'KO': '撃破',
      'REINFORCEMENTS': '援軍到着',
      'A GIFT FROM THE GODS': '神々の贈り物',
      '+1 HP': '体力 +1',

      // 部屋と地図
      'AMBUSH': '待ち伏せ',
      'TRIAL': '試練',
      'BOSS': 'ボス',
      'SHORE': '海岸',
      'VOYAGE MAP': '航海図',
      'CLEARED': '踏破',
      'CURRENT': '現在地',
      'UNKNOWN': '未踏',
      'PRESS  M  TO  CLOSE': 'M で閉じる',

      // 幕名
      'THE SACK OF ISMARUS': 'イスマロスの略奪',
      'THE LOTUS SHORE': 'ロートスの海岸',
      'THE CYCLOPS ISLE': 'キュクロプスの島',
      'SAILING': '航行中',

      // ボス
      'THE CHARIOTEER': '戦車長',
      'THE LOTUS KING': 'ロートスの王',
      'POLYPHEMUS': 'ポリュペモス',

      // 弓の演出
      'THE BOW OF ODYSSEUS': 'オデュッセウスの弓',
      'ONLY ODYSSEUS CAN STRING THIS BOW': 'この弓を張れるのはオデュッセウスだけ',

      // 敗走
      'THE CITY HOLDS': '街は落ちない',
      'DAWN BRINGS THEIR ARMIES': '夜明けと共に援軍が来る',
      'WE LEAVE ISMARUS WITH SIX MEN LESS': '六人を失い、イスマロスを去る',

      // 結末と死
      'TO BE CONTINUED': 'つづく',
      'POLYPHEMUS FALLS. THE SEA IS STILL.': 'ポリュペモスは倒れ、海は静かだ。',
      'ITHACA LIES BEYOND THIS SHORE.': 'イタケはこの岸の向こうにある。',
      'THE VOYAGE CONTINUES.': '航海は続く。',
      'THE SEA TAKES YOU': '海がお前を奪った',
      'ITHACA REMAINS UNREACHED': 'イタケには届かなかった',
      'PRESS  R  TO  RETRY': 'R でやり直す',
      'PRESS  R  TO  SAIL  AGAIN': 'R でもう一度出航',

      // 一時停止と設定
      'PAUSED': '一時停止',
      'PRESS  P  TO  RESUME': 'P で再開',
      'PRESS  S  FOR  SETTINGS': 'S で設定',
      'SETTINGS': '設定',
      'BGM': '音楽',
      'SFX': '効果音',
      'BOW': '弓',
      'SWORD': '剣',
      'LANGUAGE': '言語',
      'FULLSCREEN': '全画面',
      'RESET TO DEFAULT': '初期化',
      'BACK': '戻る',
      'W/S SELECT   A/D ADJUST   ENTER CONFIRM': 'W/S 選択   A/D 調整   ENTER 決定',
      'ESC BACK': 'ESC 戻る',
      'PRESS A KEY': 'キーを押す',
      'ON': 'オン',
      'OFF': 'オフ',

      // 敵名
      'CITIZEN': '市民',
      'SOLDIER': '兵士',
      'SKELETON': '亡者',
      'LOTUS EATER': 'ロートス喰い',
      'CYCLOPS': 'キュクロプス',

      // アイテム名
      'BOWSTRING OF HEPHAESTUS': 'ヘパイストスの弓弦',
      'SANDALS OF HERMES': 'ヘルメスのサンダル',
      'QUIVER OF ARTEMIS': 'アルテミスの矢筒',
      'GREAVES OF ACHILLES': 'アキレウスのすね当て',
      'AEGIS OF ATHENA': 'アテナのアイギス',
      'HAMMER OF HEPHAESTUS': 'ヘパイストスの鎚',
      'THE GOLDEN FLEECE': '金羊毛',
      'HERB OF CIRCE': 'キルケの薬草',
      'TRIDENT OF POSEIDON': 'ポセイドンの三叉槍',
      'CRESCENT OF ARTEMIS': 'アルテミスの月牙',
      'EMBER OF HEPHAESTUS': 'ヘパイストスの火種',
      'GAZE OF ATHENA': 'アテナの視線',
      'WINGS OF HERMES': 'ヘルメスの翼',
      'EYE OF THE CYCLOPS': 'キュクロプスの目',
      'TRIDENT STRIKE': '三叉槍の突き',
      'AEGIS WALL': 'アイギスの壁',
      "CIRCE'S DRAUGHT": 'キルケの変身薬',
      "HERMES' DASH": 'ヘルメスの突進',
      'HEART OF THE SEA': '深海の心',
      'ARROW BUNDLE': '矢の束',
      'SIREN SCALE': 'セイレーンの鱗',
      'HELM OF HADES': 'ハデスの兜',
      'SONG OF THE SIRENS': 'セイレーンの歌',
      "TITAN'S CHAIN": 'ティターンの鎖',

      // アイテム説明
      'ARROW DAMAGE +1': '矢のダメージ +1',
      'MOVE SPEED +15%': '移動速度 +15%',
      'BOW COOLDOWN -20%': '弓の冷却 -20%',
      'MAX HP +1': '最大体力 +1',
      'BLOCK COST -40%': 'ガード消費 -40%',
      'SWORD DAMAGE +1': '剣のダメージ +1',
      'BARRELS DROP MORE COINS': '樽から金貨が増える',
      '25% CHANCE TO HEAL ON KILL': '撃破時 25% で回復',

      // テンプレート
      'tpl.act': '第 {a} 幕 / {b}',
      'tpl.actBanner': '第 {n} 幕',
      'tpl.foes': '敵 {n}',
      'tpl.coins': '金貨 {n}',
      'tpl.room': '部屋 {a} / {b}',
      'tpl.saved': 'セーブ・第 {a} 幕・第 {b} 部屋',
      'tpl.hint': 'WASD 移動   {bow} 弓   {block} ガード   {sword} 剣   M 地図',
      'tpl.mapInfo': '第 {a} 幕 / {b}   ·   部屋 {c} / {d}',
    },
  },
};
