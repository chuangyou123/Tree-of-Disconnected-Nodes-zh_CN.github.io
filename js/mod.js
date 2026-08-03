let modInfo = {
	name: "断连节点之树",
	author: "randomtuba",
	pointsName: "",
	modFiles: ["tree.js", "side-layers.js", "matter.js", "fluid.js", "chips.js", "strings.js"],

	discordName: "tuba的新地盘",
	discordLink: "https://discord.gg/HhcavwM5rm",
	initialStartPoints: new Decimal (0), // 用于硬重置和新玩家
	offlineLimit: 1,  // 单位：小时
}

// 在此处设置版本号和名称
let VERSION = {
	num: "第一幕 第四部分",
	name: "弦",
}

let changelog = `<h1>更新日志</h1><br>
	<span style="font-size:11px;">如果这个游戏被弃坑了，别忘了我就行，好吗？</span><br><br>
	<h3>第一幕 第四部分：弦（2026年1月8日）</h3><br>
	<b>终局：1.00e380 弦</b><br>
		- 新增弦节点。<br>
		- 新增5个成就。<br>
		- 新增1个流体里程碑。<br>
		- 新增3个芯片里程碑。<br><br>
	<h3>第一幕 第三部分：芯片（2026年7月18日）</h3><br>
	<b>终局：1.00e49 芯片</b><br>
		- 新增芯片节点。<br>
		- 新增1个成就。<br>
		- 新增3个流体里程碑。<br>
		- 背景颜色会根据最新解锁的节点而变化。<br><br>
	<h3>第一幕 第二部分：流体（2026年7月4日）</h3><br>
	<b>终局：1.00e42 流体</b><br>
		- 新增流体节点。<br>
		- 新增2个成就。<br>
		- 新增2个物质里程碑。<br><br>
	<h3>第一幕 第一部分：物质（2026年6月28日）</h3><br>
	<b>终局：1.00e66 物质</b><br>
		- 新增物质节点。<br>
		- 新增成就菜单。<br>
		- 新增帮助菜单。`

let winText = `恭喜！你已经到达终点并通关了这个游戏，但暂时就这样吧...`

// 如果你在某个层内添加了任何新函数，并且这些函数在被调用时会产生效果，请将它们添加到这里。
// （这里的只是示例，所有官方函数都已经处理好了）
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// 决定是否显示每秒点数
function canGenPoints(){
	return true
}

// 计算每秒点数！
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	gain = gain.add(player.m.multiplier[1].add(player.m.multiplier[2]).add(player.m.multiplier[3]).add(player.m.multiplier[4]).add(player.m.multiplier[5]).add(player.m.multiplier[6]))
	gain = gain.mul(player.f.singularities.sqrt().add(1))
	gain = gain.mul(player.f.planckPoints.cbrt().add(1))
	gain = gain.mul(getBuyableAmount("c",11).add(getBuyableAmount("c",12)).add(getBuyableAmount("c",13)).add(getBuyableAmount("c",21)).add(getBuyableAmount("c",22)).add(getBuyableAmount("c",23)).add(getBuyableAmount("c",31)).add(getBuyableAmount("c",32)).add(getBuyableAmount("c",33)).add(1))
	gain = gain.mul(player.s.stringTypes[1].add(1)).mul(player.s.stringTypes[2].add(1)).mul(player.s.stringTypes[3].add(1)).mul(player.s.stringTypes[4].add(1)).mul(player.s.stringTypes[5].add(1))
	return gain
}

// 你可以在这里添加与层无关的、需要存入"player"并保存的变量及其默认值
function addedPlayerData() { return {
}}

// 在页面顶部显示额外内容
var displayThings = [
	() => `当前终局：${format("1e380")} 弦`,
]

// 决定游戏何时"结束"
function isEndgame() {
	return player.s.points.gte(new Decimal("1e380"))
}



// 从这里开始是不太重要的内容！

// 背景样式，可以是函数
function backgroundStyle() {
  	let ret = {}

  	if (!player.f.unlocked) ret["background-color"] = "#1e0a1d"
	else if (!player.c.unlocked) ret["background-color"] = "#0c161c"
	else if (!player.s.unlocked) ret["background-color"] = "#150c1c"
	else ret["background-color"] = "#05140b"

  	return ret
}

// 如果你有可能会被长tick时长搞乱的东西，可以修改这个
function maxTickLength() {
	return(3600) // 默认是1小时，这已经足够大了
}

// 如果需要修复旧版本的通胀问题，可以使用这个。如果版本比修复问题的版本更旧，
// 你可以用这个来限制他们的当前资源。
function fixOldSave(oldVersion){
}