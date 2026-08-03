addLayer("f", {
    // general stuff
    name: "流体",
    symbol: "F",
    position: 1, // horizontal position
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        vapor: new Decimal(0),
        barProgress: [0,0],
        singularities: new Decimal(0),
        infinity: [false,false],
        infinityFills: [new Decimal(0),new Decimal(0)],
        planckPoints: new Decimal(0),
        fluidPerSecond: new Decimal(0),
    }},
    color: "#6cc9fe",
    requires: new Decimal(1e66),
    resource: "流体",
    baseResource: "物质", // resource required to unlock
    baseAmount() {return player.m.points},
    type: "none",
    row: 0, // 0 is first row
    layerShown(){return hasMilestone("m",3)},

    // calculations
    gainMult() {
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("f", 11))
        mult = mult.mul(buyableEffect("f", 13))
        mult = mult.mul(buyableEffect("f", 23))
        mult = mult.mul(layers.f.singularityEffect())
        mult = mult.mul(layers.c.chipsEffect())
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    vaporGen() {
        return buyableEffect("f", 21).mul(layers.c.chipsEffect())
    },
    singularityGen() {
        let gen = Decimal.pow(1.5, getBuyableAmount("f",11).add(getBuyableAmount("f",21)).sub(15))
        gen = gen.mul(buyableEffect("f", 31))
        return gen
    },
    planckPointsGen() {
        let gen = Decimal.pow(1.5, getBuyableAmount("f",13).add(getBuyableAmount("f",23)).sub(13))
        gen = gen.mul(buyableEffect("f", 33))
        return gen
    },
    fluidEffect() {
        return player.f.points.pow(1.5).add(1)
    },
    vaporEffect() {
        return player.f.vapor.pow(2).add(1)
    },
    singularityEffect() {
        return player.f.singularities.pow(0.25).add(1)
    },
    infinityFillEffect(x) {
        if (x == 1) {
            return player.f.infinityFills[0].pow(0.1).add(1)
        }
        if (x == 2) {
            return player.f.infinityFills[1].pow(0.2).add(1)
        }
    },
    fillSpeed(x) {
        if (x == 1) { // fluid bar fill speed
            return buyableEffect("f",12).div(5).mul(layers.f.infinityFillEffect(1)).mul(buyableEffect("f",32))
        }
        if (x == 2) { // vapor bar fill speed WITHOUT vapor infinity active
            return new Decimal(0.001).div(player.f.vapor.add(1)).mul(buyableEffect("f", 22)).mul(layers.f.infinityFillEffect(2)).mul(buyableEffect("f", 32))
        }
        if (x == 3) { // vapor bar fill speed WITH vapor infinity active
            return new Decimal(0.001).mul(buyableEffect("f", 22)).mul(layers.f.infinityFillEffect(2)).mul(buyableEffect("f", 32))
        }
    },
    automate() {
        let a = new Decimal(0)
        let b = new Decimal(0)
        let c = new Decimal(0)
        if (player.f.autoFluidBuyables && hasMilestone("f",4)) {
            a = Decimal.log10(1.1)
            b = Decimal.log10(5)
            c = Decimal.log10(3).sub(player.f.points.max(1).log10())
            setBuyableAmount("f", 11, tmp.f.buyables[11].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",11))
            a = Decimal.log10(1.2)
            b = Decimal.log10(4)
            c = Decimal.log10(30).sub(player.f.points.max(1).log10())
            setBuyableAmount("f", 12, tmp.f.buyables[12].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",12))
            a = Decimal.log10(1.3)
            b = Decimal.log10(6)
            c = Decimal.log10(300).sub(player.f.points.max(1).log10())
            setBuyableAmount("f", 13, tmp.f.buyables[13].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",13))
        }
        if (player.f.autoVaporBuyables && hasMilestone("f",4)) {
            a = Decimal.log10(1.05)
            b = Decimal.log10(3)
            c = Decimal.log10(3).sub(player.f.vapor.max(1).log10())
            setBuyableAmount("f", 21, tmp.f.buyables[21].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",21))
            a = Decimal.log10(1.1)
            b = Decimal.log10(3)
            c = Decimal.log10(1).sub(player.f.vapor.max(1).log10())
            setBuyableAmount("f", 22, tmp.f.buyables[22].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",22))
            a = Decimal.log10(1.15)
            b = Decimal.log10(3)
            c = Decimal.log10(10).sub(player.f.vapor.max(1).log10())
            setBuyableAmount("f", 23, tmp.f.buyables[23].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",23))
        }
        if (player.f.autoPlanckBuyables && hasMilestone("f",6)) {
            a = Decimal.log10(1.05)
            b = Decimal.log10(8)
            c = Decimal.log10(20).sub(player.f.planckPoints.max(1).log10())
            setBuyableAmount("f", 31, tmp.f.buyables[31].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",31))
            a = Decimal.log10(1.1)
            b = Decimal.log10(12)
            c = Decimal.log10(50).sub(player.f.planckPoints.max(1).log10())
            setBuyableAmount("f", 32, tmp.f.buyables[32].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",32))
            a = Decimal.log10(1.15)
            b = Decimal.log10(16)
            c = Decimal.log10(250).sub(player.f.planckPoints.max(1).log10())
            setBuyableAmount("f", 33, tmp.f.buyables[33].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("f",33))
        }
    },
    update(diff) {
        if (!player[this.layer].unlocked && player.m.points.gte(1e66)) player[this.layer].unlocked = true
        if (player[this.layer].unlocked) {
            if (hasMilestone("f",5)) player.f.vapor = player.f.vapor.add(layers.f.vaporGen().mul(diff))
            
            if (!player.f.infinity[0]) {
                // no fluid infinity
                // fluid bar fills up in more than 1 tick:
                if (layers.f.fillSpeed(1).mul(0.04).lt(1)) {
                    player.f.barProgress[0] += layers.f.fillSpeed(1).mul(0.04).toNumber()
                    player.f.fluidPerSecond = layers.f.generation().mul(layers.f.fillSpeed(1))
                    if (player.f.barProgress[0] >= 1) {
                        player.f.barProgress[0] = 0
                        player.f.points = player.f.points.add(layers.f.generation())
                        player.f.barProgress[1] += layers.f.fillSpeed(2).toNumber()
                    }
                    if (player.f.barProgress[1] >= 1) {
                        player.f.barProgress[1] = 0
                        player.f.vapor = player.f.vapor.add(layers.f.vaporGen())
                    }
                }
                // fluid bar fills up in 1 tick:
                if (layers.f.fillSpeed(1).mul(0.04).gte(1)) {
                    player.f.barProgress[0] = 1
                    player.f.points = player.f.points.add(layers.f.generation().mul(layers.f.fillSpeed(1)).mul(5).mul(diff))
                    player.f.fluidPerSecond = layers.f.generation().mul(layers.f.fillSpeed(1)).mul(5)
                    if (!player.f.infinity[1]) {
                        // no vapor infinity
                        if (layers.f.fillSpeed(2).mul(layers.f.fillSpeed(1).mul(0.04)).lt(1)) {
                            // vapor bar fills up in more than 1 tick:
                            player.f.barProgress[1] += layers.f.fillSpeed(2).mul(layers.f.fillSpeed(1).mul(diff)).toNumber()
                            if (player.f.barProgress[1] >= 1) {
                                player.f.barProgress[1] = 0
                                player.f.vapor = player.f.vapor.add(layers.f.vaporGen())
                            }
                        } else {
                            // vapor bar fills up in 1 tick:
                            player.f.barProgress[1] = 1
                            player.f.vapor = player.f.vapor.add(layers.f.vaporGen().mul(layers.f.fillSpeed(2)).mul(layers.f.fillSpeed(1).mul(diff)))
                        }
                    } else {
                        // vapor infinity active
                        player.f.barProgress[1] += (1 - (player.f.barProgress[1] * 1.1)) * 0.04
                        if (player.f.barProgress[1] > 0.4) player.f.barProgress[1] += Math.cos(player.timePlayed * 8) * 0.05 * 0.04
                        if (!hasMilestone("f",3)) player.f.infinityFills[1] = player.f.infinityFills[1].add(layers.f.fillSpeed(3).mul(layers.f.fillSpeed(1).mul(diff)))
                        player.f.vaporPerSecond = new Decimal(0)
                    }
                }
            } else {
                // fluid infinity active
                player.f.barProgress[0] += (1 - (player.f.barProgress[0] * 1.1)) * 0.04
                if (player.f.barProgress[0] > 0.4) player.f.barProgress[0] += Math.cos(player.timePlayed * 8) * 0.05 * 0.04
                if (!hasMilestone("f",3)) player.f.infinityFills[0] = player.f.infinityFills[0].add(layers.f.fillSpeed(1).mul(diff))
                player.f.fluidPerSecond = new Decimal(0)
            }
            if (hasMilestone("f",0)) player.f.singularities = player.f.singularities.add(layers.f.singularityGen().mul(diff))
            if (hasMilestone("f",1)) player.f.planckPoints = player.f.planckPoints.add(layers.f.planckPointsGen().mul(diff))
            if (hasMilestone("f",3)) {
                player.f.infinityFills[0] = player.f.infinityFills[0].add(layers.f.fillSpeed(1).mul(diff))
                player.f.infinityFills[1] = player.f.infinityFills[1].add(layers.f.fillSpeed(3).mul(layers.f.fillSpeed(1).mul(diff)))
            }
        }
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `你的流体正在将物质倍增器的力量乘以 <h2 style="color: #6cc9fe; text-shadow: 0px 0px 10px #6cc9fe">${format(layers.f.fluidEffect())}</h2>x。`],
        ["display-text", () => `每次第一个条填满时，你获得 ${format(layers.f.generation())} 流体。`],
        () => hasMilestone("f",0) ? ["display-text", `<span style="color:yellow">它有 ${format(player.f.infinityFills[0])} 次存储的填充，将其填充速度乘以 ${format(layers.f.infinityFillEffect(1))}x。</span>`] : '',
        "blank",
        ["bar","fluid"],
        "blank",
        ["display-text", () => `你有 <h2 style="color: #2e7197; text-shadow: 0px 0px 10px #2e7197">${formatWhole(player.f.vapor)}</h2> 蒸汽`],
        "blank",
        ["display-text", () => `你的蒸汽正在将物质粒子的获取乘以 <h2 style="color: #2e7197; text-shadow: 0px 0px 10px #2e7197">${format(layers.f.vaporEffect())}</h2>x。`],
        ["display-text", () => `每次第二个条填满时，你获得 ${format(layers.f.vaporGen())} 蒸汽。`],
        () => hasMilestone("f",5) ? ["display-text", `你每秒额外获得 ${format(layers.f.vaporGen())} 蒸汽。`] : '',
        ["display-text", () => `<span style="color:red">第二个条的填充速度会被你的蒸汽量所除。</span>`],
        () => hasMilestone("f",2) ? ["display-text", `<span style="color:yellow">它有 ${format(player.f.infinityFills[1])} 次存储的填充，将其填充速度乘以 ${format(layers.f.infinityFillEffect(2))}x。</span>`] : '',
        "blank",
        ["bar","vapor"],
        "blank",
        ["buyables", [1,2]],
        "blank",
        () => hasMilestone("f",0) ? ["display-text", `你有 <h2 style="color: #000000; text-shadow: 0px 0px 10px #ffffff">${format(player.f.singularities)}</h2> 奇点，将每次填充获得的流体乘以 <h2 style="color: #000000; text-shadow: 0px 0px 10px #ffffff">${format(layers.f.singularityEffect())}</h2>x。（${format(layers.f.singularityGen())}/秒）`] : '',
        () => hasMilestone("f",0) ? ["display-text", `你根据压力与压力<sup>2</sup>的购买获得更多奇点。<br>启用流体无限可以让你存储第一个条的填充，同时停止流体生产。`] : '',
        () => hasMilestone("f",2) ? ["display-text", `启用蒸汽无限可以让你存储第二个条的填充，同时停止蒸汽生产。`] : '',
        () => hasMilestone("f",0) ? "clickables" : '',
        "blank",
        () => hasMilestone("f",1) ? ["display-text", `你有 <h2 style="color: #ff5900; text-shadow: 0px 0px 10px #ff5900">${format(player.f.planckPoints)}</h2> 普朗克点。（${format(layers.f.planckPointsGen())}/秒）`] : '',
        () => hasMilestone("f",1) ? ["display-text", `你根据温度与温度<sup>2</sup>的购买获得更多普朗克点。`] : '',
        "blank",
        () => hasMilestone("f",1) ? ["buyables", [3]] : '',
        "blank",
    ],
    buyables: {
        11: {
            title: "<h3>压力</h3>",
            cost(x) { return new Decimal(3).mul(Decimal.pow(5, x)).mul(Decimal.pow(1.1, x.pow(2))) },
            display() { return `<span style="font-size:12px;">将每次填充获得的流体乘以 3.5x。<br>购买次数：${formatWhole(getBuyableAmount(this.layer, this.id))}<br>花费：${format(this.cost())} 流体<br>效果：${format(this.effect())}x 流体/填充</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(3.5, getBuyableAmount(this.layer, this.id))},
        },
        12: {
            title: "<h3>体积</h3>",
            cost(x) { return new Decimal(30).mul(Decimal.pow(4, x)).mul(Decimal.pow(1.2, x.pow(2))) },
            display() { return `<span style="font-size:12px;">将第一个条的填充速度乘以 1.75x。<br>购买次数：${formatWhole(getBuyableAmount(this.layer, this.id))}<br>花费：${format(this.cost())} 流体<br>效果：${format(this.effect())}x 填充速度</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(1.75, getBuyableAmount(this.layer, this.id))},
        },
        13: {
            title: "<h3>温度</h3>",
            cost(x) { return new Decimal(300).mul(Decimal.pow(6, x)).mul(Decimal.pow(1.3, x.pow(2))) },
            display() { return `<span style="font-size:12px;">根据物质将每次填充获得的流体乘以。<br>购买次数：${formatWhole(getBuyableAmount(this.layer, this.id))}<br>花费：${format(this.cost())} 流体<br>每次购买倍率：${format(this.matterEffect())}x<br>效果：${format(this.effect())}x 流体/填充</span>` },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            matterEffect() {return player.m.points.add(1).log10().add(1).log10().add(1)},
            effect() {return Decimal.pow(this.matterEffect(), getBuyableAmount(this.layer, this.id))},
        },
        21: {
            title: "<h3>压力<sup>2</sup></h3>",
            cost(x) { return new Decimal(3).mul(Decimal.pow(3, x)).mul(Decimal.pow(1.05, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">将每次填充获得的蒸汽翻倍。<br>购买次数：${formatWhole(getBuyableAmount(this.layer, this.id))}<br>花费：${format(this.cost())} 蒸汽<br>效果：${format(this.effect())}x 蒸汽/填充</span>` },
            canAfford() { return player[this.layer].vapor.gte(this.cost()) },
            buy() {
                player[this.layer].vapor = player[this.layer].vapor.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#2e7197"; style["color"] = "#ffffff"}; return style}
        },
        22: {
            title: "<h3>体积<sup>2</sup></h3>",
            cost(x) { return Decimal.pow(3, x).mul(Decimal.pow(1.1, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">将第二个条的填充速度乘以 1.5x。<br>购买次数：${formatWhole(getBuyableAmount(this.layer, this.id))}<br>花费：${format(this.cost())} 蒸汽<br>效果：${format(this.effect())}x 填充速度</span>` },
            canAfford() { return player[this.layer].vapor.gte(this.cost()) },
            buy() {
                player[this.layer].vapor = player[this.layer].vapor.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(1.5, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#2e7197"; style["color"] = "#ffffff"}; return style}
        },
        23: {
            title: "<h3>温度<sup>2</sup></h3>",
            cost(x) { return new Decimal(10).mul(Decimal.pow(3, x)).mul(Decimal.pow(1.15, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">根据蒸汽将每次填充获得的流体乘以。<br>购买次数：${formatWhole(getBuyableAmount(this.layer, this.id))}<br>花费：${format(this.cost())} 蒸汽<br>每次购买倍率：${format(this.vaporEffect())}x<br>效果：${format(this.effect())}x 流体/填充</span>` },
            canAfford() { return player[this.layer].vapor.gte(this.cost()) },
            buy() {
                player[this.layer].vapor = player[this.layer].vapor.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            vaporEffect() {return player.f.vapor.add(1).ln().add(1)},
            effect() {return Decimal.pow(this.vaporEffect(), getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#2e7197"; style["color"] = "#ffffff"}; return style}
        },
        31: {
            title: "<h3>压力<sup>3</sup></h3>",
            cost(x) { return new Decimal(20).mul(Decimal.pow(8, x)).mul(Decimal.pow(1.05, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">将奇点生成速度乘以 5x。<br>购买次数：${formatWhole(getBuyableAmount(this.layer, this.id))}<br>花费：${format(this.cost())} 普朗克点<br>效果：${format(this.effect())}x 奇点</span>` },
            canAfford() { return player[this.layer].planckPoints.gte(this.cost()) },
            buy() {
                player[this.layer].planckPoints = player[this.layer].planckPoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(5, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#ff5900"}; return style}
        },
        32: {
            title: "<h3>体积<sup>3</sup></h3>",
            cost(x) { return new Decimal(50).mul(Decimal.pow(12, x)).mul(Decimal.pow(1.1, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">将两个条的填充速度翻倍。<br>购买次数：${formatWhole(getBuyableAmount(this.layer, this.id))}<br>花费：${format(this.cost())} 普朗克点<br>效果：${format(this.effect())}x 填充速度</span>` },
            canAfford() { return player[this.layer].planckPoints.gte(this.cost()) },
            buy() {
                player[this.layer].planckPoints = player[this.layer].planckPoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#ff5900"}; return style}
        },
        33: {
            title: "<h3>温度<sup>3</sup></h3>",
            cost(x) { return new Decimal(250).mul(Decimal.pow(16, x)).mul(Decimal.pow(1.15, x.pow(2))).floor() },
            display() { return `<span style="font-size:12px;">将普朗克点生成速度乘以 5x。<br>购买次数：${formatWhole(getBuyableAmount(this.layer, this.id))}<br>花费：${format(this.cost())} 普朗克点<br>效果：${format(this.effect())}x 普朗克点</span>` },
            canAfford() { return player[this.layer].planckPoints.gte(this.cost()) },
            buy() {
                player[this.layer].planckPoints = player[this.layer].planckPoints.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(5, getBuyableAmount(this.layer, this.id))},
            style() {const style = {}; if (this.canAfford()) {style["background-color"] = "#ff5900"}; return style}
        },
    },
    milestones: {
        0: {
            requirementDescription() {return `${formatWhole(15)} 次压力购买`},
            effectDescription: "解锁奇点。",
            done() { return getBuyableAmount("f",11).gte(15) },
            unlocked() { return getBuyableAmount("f",11).gte(10) },
        },
        1: {
            requirementDescription() {return `${formatWhole(12)} 次温度购买`},
            effectDescription: "解锁普朗克点。",
            done() { return getBuyableAmount("f",13).gte(12) },
            unlocked() { return hasMilestone("f",0) },
        },
        2: {
            requirementDescription() {return `${formatWhole(22)} 次压力购买`},
            effectDescription: "解锁蒸汽无限。",
            done() { return getBuyableAmount("f",11).gte(22) },
            unlocked() { return hasMilestone("f",1) },
        },
        3: {
            requirementDescription() {return `${formatWhole(31)} 次压力购买`},
            effectDescription: "当无限未激活时，可以生成存储的填充。",
            done() { return getBuyableAmount("f",11).gte(31) },
            unlocked() { return player.c.unlocked },
        },
        4: {
            requirementDescription() {return `${formatWhole(30)} 次体积购买`},
            effectDescription: "自动购买流体和蒸汽升级，不消耗流体和蒸汽。",
            done() { return getBuyableAmount("f",12).gte(30) },
            unlocked() { return hasMilestone("f",3) },
            toggles: [
                ["f","autoFluidBuyables"],
                ["f","autoVaporBuyables"],
            ],
        },
        5: {
            requirementDescription() {return `${formatWhole(36)} 次体积购买`},
            effectDescription: "即使第二个条未满，也能被动生成蒸汽。",
            done() { return getBuyableAmount("f",12).gte(36) },
            unlocked() { return hasMilestone("f",4) },
        },
        6: {
            requirementDescription() {return `${formatWhole(40)} 次温度购买`},
            effectDescription: "自动购买普朗克点升级，不消耗普朗克点。",
            done() { return getBuyableAmount("f",13).gte(40) },
            unlocked() { return hasMilestone("f",5) },
            toggles: [
                ["f","autoPlanckBuyables"],
            ],
        },
    },
    clickables: {
        11: {
            display() {return `流体无限：${player.f.infinity[0] ? `已启用` : `已禁用`}`},
            onClick() {
                player.f.infinity[0] = !player.f.infinity[0]
                player.f.barProgress[0] = 0
            },
            canClick() {return true},
            style() {
                const style = {};
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (this.canClick()) {
                    style["background-color"] = "black"
                    style["color"] = "white"
                }
                return style
            },
        },
        12: {
            display() {return `蒸汽无限：${player.f.infinity[1] ? `已启用` : `已禁用`}`},
            onClick() {
                player.f.infinity[1] = !player.f.infinity[1]
                player.f.barProgress[1] = 0
            },
            canClick() {return true},
            style() {
                const style = {};
                style["width"] = "100px"
                style["min-height"] = "100px"
                if (this.canClick()) {
                    style["background-color"] = "black"
                    style["color"] = "white"
                }
                return style
            },
            unlocked() {return hasMilestone("f",2)}
        },
    },
    bars: {
        fluid: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.f.barProgress[0]},
            display: () => `${format(player.f.barProgress[0] * 100)}% （平均：${format(player.f.fluidPerSecond)} 流体/秒）`,
            fillStyle() { return {"background-color": "#5fb2e1"} },
        },
        vapor: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.f.barProgress[1]},
            display: () => `${format(player.f.barProgress[1] * 100)}%`,
            fillStyle() { return {"background-color": "#286284"} },
        },
    },
})