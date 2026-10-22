/**
 * ODYSSEY · 关卡与敌人数值配置
 * 改这个文件就能调整关卡顺序、房间内容、敌人属性，不需要动游戏逻辑。
 *
 * 地图节点坐标：[列, 行]，左上为 [0, 0]
 * 房间类型：start 起点 | combat 战斗 | elite 试炼 | boss 首领
 * 场景主题：city 城池 | shore 海岸 | cliff 岩滩 | cave 洞窟
 */
window.ODYSSEY_DATA = {
  // 房间尺寸与场景布局
  room: {
    bounds: { l: 14, t: 14, r: 466, b: 256 },
    pillars: [
      { x: 66, y: 74, w: 20, h: 20 },
      { x: 394, y: 74, w: 20, h: 20 },
      { x: 66, y: 176, w: 20, h: 20 },
      { x: 394, y: 176, w: 20, h: 20 },
    ],
    torches: [
      { x: 20, y: 96 }, { x: 460, y: 96 },
      { x: 20, y: 186 }, { x: 460, y: 186 },
    ],
    // 刷怪点，实际生成时会避开玩家附近的点
    spawnPoints: [
      { x: 96, y: 66 }, { x: 384, y: 66 },
      { x: 96, y: 214 }, { x: 384, y: 214 },
      { x: 240, y: 62 }, { x: 124, y: 142 }, { x: 356, y: 142 },
    ],
  },

  // 敌人属性：hp 生命 / speed 速度 / w,h 碰撞盒 / r 半径 / dmg 伤害 / kb 击退系数
  enemies: {
    // 第一幕：伊斯马罗斯的平民，逃跑为主，被逼急才扔石头
    citizen:  { hp: 2,  speed: 52, w: 10, h: 12, r: 7,  dmg: 1, kb: 1.0 },
    // 第一幕：喀孔涅斯士兵，长矛突刺
    soldier:  { hp: 6,  speed: 58, w: 10, h: 14, r: 8,  dmg: 1, kb: 0.7 },
    // 第一幕首领：战车长
    chariot:  { hp: 30, speed: 46, w: 34, h: 24, r: 22, dmg: 2, kb: 0.1 },
    // 第二幕：食莲者，被莲花迷住的人，动作迟缓、只会贴身纠缠
    lotus_eater: { hp: 3, speed: 34, w: 12, h: 12, r: 7, dmg: 1, kb: 1.0 },
    // 莱斯特律戈涅斯人：原著第十卷，晚于独眼巨人，本 Demo 不启用，留到正式版
    laestrygonian: { hp: 3, speed: 42, w: 12, h: 10, r: 7, dmg: 1, kb: 1.0 },
    // 第二、三幕：亡者
    skeleton: { hp: 6,  speed: 60, w: 10, h: 14, r: 8,  dmg: 1, kb: 0.8 },
    // 第二幕首领：食莲人
    lotus:    { hp: 20, speed: 36, w: 24, h: 26, r: 17, dmg: 1, kb: 0.2 },
    // 第三幕首领：独眼巨人
    cyclops:  { hp: 34, speed: 34, w: 28, h: 30, r: 20, dmg: 2, kb: 0.15 },
    // 预留：求婚者首领（本 Demo 不出场）
    boss:     { hp: 26, speed: 42, w: 22, h: 24, r: 16, dmg: 2, kb: 0.25 },
  },

  // 道具：击败首领后掉落在底座上，走上去即永久生效
  // mods 字段说明见 DESIGN.md 第 16 节，数值按"加法或百分比"叠加
  items: {
    // 箭矢伤害 +1
    bowstring: {
      name: 'BOWSTRING OF HEPHAESTUS',
      desc: 'ARROW DAMAGE +1',
      icon: 'bowstring',
      mods: { arrowDmg: 1 },
    },
    // 移速 +15%
    sandals: {
      name: 'SANDALS OF HERMES',
      desc: 'MOVE SPEED +15%',
      icon: 'sandals',
      mods: { speedPct: 0.15 },
    },
    // 射箭冷却 -20%
    quiver: {
      name: 'QUIVER OF ARTEMIS',
      desc: 'BOW COOLDOWN -20%',
      icon: 'quiver',
      mods: { bowCdPct: -0.2 },
    },
    // 生命上限 +1，并立刻补满这一格
    greaves: {
      name: 'GREAVES OF ACHILLES',
      desc: 'MAX HP +1',
      icon: 'greaves',
      mods: { maxHp: 1 },
    },
    // 格挡体力消耗 -40%
    aegis: {
      name: 'AEGIS OF ATHENA',
      desc: 'BLOCK COST -40%',
      icon: 'aegis',
      mods: { blockCostPct: -0.4 },
    },
    // 近战伤害 +1
    hammer: {
      name: 'HAMMER OF HEPHAESTUS',
      desc: 'SWORD DAMAGE +1',
      icon: 'hammer',
      mods: { meleeDmg: 1 },
    },
    // 木桶金币掉落数量 +1
    fleece: {
      name: 'THE GOLDEN FLEECE',
      desc: 'BARRELS DROP MORE COINS',
      icon: 'fleece',
      mods: { coinBonus: 1 },
    },
    // 击杀敌人有 25% 概率回 1 点生命
    herb: {
      name: 'HERB OF CIRCE',
      desc: '25% CHANCE TO HEAL ON KILL',
      icon: 'herb',
      mods: { lifesteal: 0.25 },
    },
  },

  // 三幕：map 是地图节点坐标，rooms 按推进顺序一一对应
  // afterBoss：击败首领后的特殊处理，'defeat' 表示播放战败过场
  acts: [
    {
      name: 'THE SACK OF ISMARUS',
      theme: 'city',
      map: [[0, 0], [1, 0], [2, 0], [2, 1]],
      rooms: [
        { type: 'start',  spawns: [] },
        { type: 'combat', spawns: ['citizen', 'citizen', 'soldier'] },
        { type: 'combat', spawns: ['citizen', 'soldier', 'soldier'] },
        { type: 'boss',   title: 'THE CHARIOTEER', spawns: ['chariot'], afterBoss: 'defeat' },
      ],
    },
    {
      name: 'THE LOTUS SHORE',
      theme: 'shore',
      map: [[0, 1], [0, 0], [1, 0], [2, 0]],
      rooms: [
        { type: 'start',  spawns: [] },
        { type: 'combat', spawns: ['citizen', 'lotus_eater', 'lotus_eater'] },
        { type: 'combat', spawns: ['soldier', 'skeleton', 'lotus_eater'] },
        { type: 'boss',   title: 'THE LOTUS KING', spawns: ['lotus', 'lotus_eater'] },
      ],
    },
    {
      name: 'THE CYCLOPS ISLE',
      theme: 'cliff',
      map: [[0, 0], [1, 0], [1, 1], [2, 1]],
      rooms: [
        { type: 'start',  spawns: [] },
        { type: 'combat', spawns: ['soldier', 'skeleton', 'skeleton'] },
        { type: 'combat', spawns: ['citizen', 'soldier', 'skeleton', 'skeleton'] },
        { type: 'boss',   theme: 'cave', title: 'POLYPHEMUS', spawns: ['cyclops', 'skeleton'] },
      ],
    },
  ],
};
