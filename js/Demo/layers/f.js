// This layer is mostly minimal but it uses a custom prestige type and a clickable
addLayer("f", {
    infoboxes:{
        coolInfo: {
            title: "背景故事",
            titleStyle: {'color': '#FE0000'},
            body: "深层背景故事！",
            bodyStyle: {'background-color': "#0000EE"}
        }
    },

    startData() { return {
        unlocked: false,
        points: new Decimal(0),
        boop: false,
        clickables: {[11]: "Start"}, // Optional default Clickable state
    }},
    color: "#FE0102",
    requires() {return new Decimal(10)}, 
    resource: "农场点数", 
    baseResource: "点数", 
    baseAmount() {return player.points},
    type: "static",
    exponent: 0.5,
    base: 3,
    roundUpCost: true,
    canBuyMax() {return false},
    //directMult() {return new Decimal(player.c.otherThingy)},

    row: 1,
    layerShown() {return true}, 
    branches: ["c"], // When this layer appears, a branch will appear from this layer to any layers here. Each entry can be a pair consisting of a layer id and a color.

    tooltipLocked() { // Optional, tooltip displays when the layer is locked
        return ("这只奇怪的恐龙农夫只会在你拥有至少 " + this.requires() + " 点数时才会看到你。你目前只有 " + formatWhole(player.points))
    },
    midsection: [
        "blank", ['display-image', 'https://images.beano.com/store/24ab3094eb95e5373bca1ccd6f330d4406db8d1f517fc4170b32e146f80d?auto=compress%2Cformat&dpr=1&w=390'],
        ["display-text", "汪汪叫！"]
    ],
    // The following are only currently used for "custom" Prestige type:
    prestigeButtonText() { //Is secretly HTML
        if (!this.canBuyMax()) return "嗨！我是一只<u>奇怪的恐龙</u>，我会给你一个农场点数，以换取你所有的点数和棒棒糖！（至少需要 " + formatWhole(tmp[this.layer].nextAt) + " 点数）"
        if (this.canBuyMax()) return "嗨！我是一只<u>奇怪的恐龙</u>，我会给你 <b>" + formatWhole(tmp[this.layer].resetGain) + "</b> 个农场点数，以换取你所有的点数和棒棒糖！（你将在 " + formatWhole(tmp[this.layer].nextAtDisp) + " 点数时再获得一个）"
    },
    getResetGain() {
        return getResetGain(this.layer, useType = "static")
    },
    getNextAt(canMax=false) { //  
        return getNextAt(this.layer, canMax, useType = "static")
    },
    canReset() {
        return tmp[this.layer].baseAmount.gte(tmp[this.layer].nextAt)
    },
    // This is also non minimal, a Clickable!
    clickables: {

        masterButtonPress() {
            if (getClickableState(this.layer, 11) == "Borkened...")
                player[this.layer].clickables[11] = "Start"
        },
        masterButtonText() {return (getClickableState(this.layer, 11) == "Borkened...") ? "修复可点击按钮！" : "什么都不做"}, // Text on Respec button, optional
        11: {
            title: "点一点！", // Optional, displayed at the top in a larger font
            display() { // Everything else displayed in the buyable button after the title
                let data = getClickableState(this.layer, this.id)
                return "当前状态：<br>" + data
            },
            unlocked() { return player[this.layer].unlocked }, 
            canClick() {
                return getClickableState(this.layer, this.id) !== "Borkened..."},
            onClick() { 
                switch(getClickableState(this.layer, this.id)){
                    case "Start":
                        player[this.layer].clickables[this.id] = "A new state!"
                        break;
                    case "A new state!":
                        player[this.layer].clickables[this.id] = "Keep going!"
                        break;
                    case "Keep going!":
                        player[this.layer].clickables[this.id] = "Maybe that's a bit too far..."
                        break;                        
                    case "Maybe that's a bit too far...":
                        makeParticles(coolParticle, 4)
                        player[this.layer].clickables[this.id] = "Borkened..."
                        break;
                    default:
                        player[this.layer].clickables[this.id] = "Start"
                        break;
                }
            },
            onHold(){
                console.log("Clickkkkk...")
            },
            style() {
                switch(getClickableState(this.layer, this.id)){
                    case "Start":
                        return {'background-color': 'green'}
                        break;
                    case "A new state!":
                        return {'background-color': 'yellow'}
                        break;
                    case "Keep going!":
                        return {'background-color': 'orange'}
                        break;                        
                    case "Maybe that's a bit too far...":
                        return {'background-color': 'red'}
                        break;
                    default:
                        return {}
                        break;
            }},
        },
    },

}, 
)

const coolParticle = {
    image:"options_wheel.png",
    spread: 20,
    gravity: 2,
    time: 3,
    rotation (id) {
        return 20 * (id - 1.5) + (Math.random() - 0.5) * 10
    },
    dir() {
        return (Math.random() - 0.5) * 10
    },
    speed() {
        return (Math.random() + 1.2) * 8 
    },
    onClick() {
        console.log("yay")
    },
    onMouseOver() {
        console.log("hi")
    },
    onMouseLeave() {
        console.log("bye")
    },
    update() {
        //this.width += 1
        //setDir(this, 135)
    },
    layer: 'f',
}