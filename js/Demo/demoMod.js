let modInfo = {
	name: "The Modding Tree",
	id: "modbase",
	pointsName: "点数",
	modFiles: ["Demo/layers/c.js", "Demo/layers/f.js", "Demo/layers/a.js", "Demo/demoTree.js"],


	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // 用于硬重置和新玩家
	offlineLimit: 1,  // 小时
}

// 在此设置版本号和名称
let VERSION = {
	num: "2.6.6",
	name: "固定现实",
}

let changelog = `<h1>更新日志：</h1><br>
	<h3>v0.0</h3><br>
		- 添加了功能。<br>
		- 添加了内容。`

let winText = `恭喜！你已经到达终点并通关了这个游戏，但目前...`
// 如果你在层内添加了任何新函数，并且这些函数在被调用时有效果，请将它们添加到这里。
// （这里的只是示例，所有官方函数都已经处理好了）
var doNotCallTheseFunctionsEveryTick = ["doReset", "buy", "onPurchase", "blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// 决定是否显示每秒点数
function canGenPoints(){
	return hasUpgrade("c", 11)
}

// 计算每秒点数！
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasUpgrade("c", 12)) gain = gain.times(upgradeEffect("c", 12))
	return gain
}

// 你可以在这里添加与层无关的变量，这些变量会存入"player"并保存，以及默认值
function addedPlayerData() { return {
	weather: "是",
	happiness: new Decimal(72),
}}

// 在页面顶部显示额外内容
var displayThings = [
	function() {if (player.points.eq(69)) return "嘻嘻！"},
	function() {if (player.f.points.gt(1)) return `你有 ${player.f.points} 农场点数。（目前没有作用。）`},
	function() {if (inChallenge("c", 11)) return "游戏目前难度 <h1>0%</h1> 更高。"},
]

// 决定游戏何时"结束"
function isEndgame() {
	return player.points.gte(new Decimal("11"))
}



// 从这里开始是不太重要的内容！

// 背景样式，可以是函数
var backgroundStyle = {
}

// 如果你有会被长时间刻度影响的内容，可以修改此设置
function maxTickLength() {
	return(3600) // 默认是1小时，这只是一个任意大的值
}

// 如果你需要修复旧版本的通胀问题，可以使用此功能。如果版本早于修复问题的版本，
// 你可以用这个来限制他们的当前资源。
function fixOldSave(oldVersion){
}