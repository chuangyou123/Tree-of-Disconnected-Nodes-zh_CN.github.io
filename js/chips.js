addLayer("c", {
    // general stuff
    name: "芯片",
    symbol: "C",
    position: 1, // horizontal position
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
        timer: 5,
        bytes: new Decimal(0),
        goldenTileMult: new Decimal(10),
        clickRadius: 1,
        windfallCooldown: 20,
    }},
    color: "#8c51d8",
    requires: new Decimal(1e42),
    resource: "芯片",
    baseResource: "流体", // resource required to unlock
    baseAmount() {return player.f.points},
    type: "none",
    row: 1, // 0 is first row
    layerShown(){return hasMilestone("f",2)},

    // calculations
    gainMult() {
        mult = new Decimal(1)
        mult = mult.mul(buyableEffect("c",12))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    bytesGen() {
        let gen = player.c.points
        gen = gen.mul(buyableEffect("c",11))
        gen = gen.mul(buyableEffect("c",33))
        gen = gen.mul(layers.s.stringsEffect())
        return gen
    },
    chipsEffect() {
        return player.c.points.pow(0.75).add(1)
    },
    numberToGridID(num) {
        let x = Math.floor(num) % buyableEffect("c",22) == 0 ? buyableEffect("c",22) : Math.floor(num) % buyableEffect("c",22)
        let y = Math.floor(1 + (Math.floor(num - 1) / buyableEffect("c",22)))
        return y + (x >= 10 ? "" : "0") + x
    },
    goldenTileChance() {
        return hasMilestone("c",0) ? 0.02 + buyableEffect("c", 13) : 0
    },
    creatorTileChance() {
        return hasMilestone("c",1) ? 0.05 : 0
    },
    upgraderTileChance() {
        return hasMilestone("c",2) ? 0.04 : 0
    },
    upgraderTileCount() {
        let count = 0
        for (let i = 1; i <= 100; i++) {
            if (player.c.grid[layers.c.numberToGridID(i)] == 4) count++
        }
        return count
    },
    automate() {
        let a = new Decimal(0)
        let b = new Decimal(0)
        let c = new Decimal(0)
        if (player.c.autoByteBuyables && hasMilestone("c",4)) {
            a = Decimal.log10(1.05)
            b = Decimal.log10(4)
            c = Decimal.log10(200).sub(player.c.bytes.max(1).log10())
            setBuyableAmount("c", 11, tmp.c.buyables[11].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("c",11))
            a = Decimal.log10(1.1)
            b = Decimal.log10(5)
            c = Decimal.log10(1000).sub(player.c.bytes.max(1).log10())
            setBuyableAmount("c", 12, tmp.c.buyables[12].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("c",12))
            a = Decimal.log10(1.2)
            b = Decimal.log10(25)
            c = Decimal.log10(1e14).sub(player.c.bytes.max(1).log10())
            setBuyableAmount("c", 23, tmp.c.buyables[23].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("c",23))
            a = Decimal.log10(1.1)
            b = Decimal.log10(10000)
            c = Decimal.log10(1e36).sub(player.c.bytes.max(1).log10())
            setBuyableAmount("c", 33, tmp.c.buyables[33].canAfford ? b.mul(-1).add(Decimal.pow(b,2).sub(Decimal.mul(4,a.mul(c))).max(0).sqrt()).div(a.mul(2)).add(1).floor() : getBuyableAmount("c",33))
        }
        if (player.c.autoWindfall && player.c.windfallCooldown <= 0 && hasMilestone("c",6)) {
            player.c.windfallCooldown = hasMilestone("c",5) ? 2 : 20
            for (let i = 0; i < 40; i++) {
                let rand = Math.random()
                let selected = layers.c.numberToGridID((Math.random() * (buyableEffect("c",22) ** 2)) + 1)
                player.c.grid[selected] = 4
            }
        }
    },
    update(diff) {
        if (!player[this.layer].unlocked && player.f.points.gte(1e42)) player[this.layer].unlocked = true
        if (player[this.layer].unlocked) {
            player.c.timer -= diff
            if (player.c.timer <= 0) {
                player.c.timer = buyableEffect("c", 21)
                let rand = Math.random()
                let tile = 0
                if (rand < layers.c.goldenTileChance()) tile = 2
                if (rand > layers.c.goldenTileChance() && rand < layers.c.goldenTileChance() + layers.c.creatorTileChance()) tile = 3
                if (rand > layers.c.goldenTileChance() + layers.c.creatorTileChance() && rand < layers.c.goldenTileChance() + layers.c.creatorTileChance() + layers.c.upgraderTileChance()) tile = 4
                if (rand > layers.c.goldenTileChance() + layers.c.creatorTileChance() + layers.c.upgraderTileChance()) tile = 1
                let selected = layers.c.numberToGridID((Math.random() * (buyableEffect("c",22) ** 2)) + 1)
                if (player.c.grid[selected] == 0) player.c.grid[selected] = tile
            }
            player.c.bytes = player.c.bytes.add(layers.c.bytesGen().mul(diff))
            if (hasMilestone("c", 3) && player.c.windfallCooldown > 0) player.c.windfallCooldown -= diff
            if (player.c.windfallCooldown < 0) player.c.windfallCooldown = 0
            if (hasMilestone("c",6) && layers.c.upgraderTileCount() > 0) layers.c.grid.onClick(player.c.grid[505], 505, 6)
        }
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `你的芯片正在将每次填充获得的流体和蒸汽乘以 <h2 style="color: #8c51d8; text-shadow: 0px 0px 10px #8c51d8">${format(layers.c.chipsEffect())}</h2>倍。`],
        "blank",
        ["display-text", () => `剩余时间: ${format(player.c.timer)}秒`],
        ["display-text", () => `当计时器结束时，一个随机方块会亮起。<br>如果选中的方块已经亮起，则不会发生任何事情。`],
        "blank",
        () => hasMilestone("c",0) ? ["display-text", `<span style="color: #ffd900">金色方块概率: ${format(layers.c.goldenTileChance() * 100)}%</span>`] : '',
        () => hasMilestone("c",0) ? ["display-text", `<span style="color: #ffd900">金色方块倍率: ${format(player.c.goldenTileMult)}倍</span>`] : '',
        () => hasMilestone("c",0) ? "blank" : '',
        () => hasMilestone("c",1) ? ["display-text", `<span style="color: #003dd6">创造者方块概率: ${format(layers.c.creatorTileChance() * 100)}%</span>`] : '',
        () => hasMilestone("c",1) ? ["display-text", `<span style="color: #003dd6">点击创造者方块会点亮其周围的8个方块。</span>`] : '',
        () => hasMilestone("c",1) ? "blank" : '',
        () => hasMilestone("c",2) ? ["display-text", `<span style="color: #00ff77">升级者方块概率: ${format(layers.c.upgraderTileChance() * 100)}%</span>`] : '',
        () => hasMilestone("c",2) ? ["display-text", `<span style="color: #00ff77">点击升级者方块会升级其周围的8个方块，并相当于点击了 ${formatWhole(Decimal.mul(50, buyableEffect("c",32)))} 个方块。</span>`] : '',
        () => hasMilestone("c",2) ? ["display-text", `<span style="color: #00ff77">(升级链: 空 → 普通 → 创造者 → 金色 → 升级者)</span>`] : '',
        () => hasMilestone("c",2) ? "blank" : '',
        "grid",
        () => getBuyableAmount("c",31).gte(1) ? "blank" : '',
        () => getBuyableAmount("c",31).gte(1) ? ["display-text", `点击半径: ${formatWhole(player.c.clickRadius)}`] : '',
        () => getBuyableAmount("c",31).gte(1) ? "clickables" : '',
        "blank",
        ["display-text", () => `你拥有 ${format(player.c.bytes)} 字节。(${format(layers.c.bytesGen())}/秒)`],
        "buyables",
    ],
    buyables: {
        11: {
            title: "<h3>算术逻辑单元</h3>",
            cost(x) { return new Decimal(200).mul(Decimal.pow(4, x)).mul(Decimal.pow(1.05, x.pow(2))) },
            display() { return `<span style="font-size:12px;">字节生成速度翻倍。<br>购买次数: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>成本: ${format(this.cost())} 字节<br>效果: ${format(this.effect())}倍 字节/秒</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(2, getBuyableAmount(this.layer, this.id))},
        },
        12: {
            title: "<h3>中央处理器</h3>",
            cost(x) { return new Decimal(1000).mul(Decimal.pow(5, x)).mul(Decimal.pow(1.1, x.pow(2))) },
            display() { return `<span style="font-size:12px;">每次点击方块获得的芯片数量变为三倍。<br>购买次数: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>成本: ${format(this.cost())} 字节<br>效果: ${format(this.effect())}倍 芯片/点击</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(3, getBuyableAmount(this.layer, this.id))},
        },
        13: {
            title: "<h3>图形处理器</h3>",
            cost(x) { return new Decimal(5e13).mul(Decimal.pow(100, x)).mul(Decimal.pow(1.5, x.pow(2))) },
            display() { return `<span style="font-size:12px;">+0.5% 金色方块概率。<br>购买次数: ${formatWhole(getBuyableAmount(this.layer, this.id))}/6<br>成本: ${format(this.cost())} 字节<br>效果: +${format(this.effect() * 100)}% 概率</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            purchaseLimit: 6,
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.mul(0.005, getBuyableAmount(this.layer, this.id)).toNumber()},
            unlocked() {return hasMilestone("c", 0)},
        },
        21: {
            title: "<h3>随机存取存储器</h3>",
            cost(x) { return new Decimal(5000).mul(Decimal.pow(5, x)).mul(Decimal.pow(1.2, x.pow(2))) },
            display() { return `<span style="font-size:12px;">方块生成冷却时间除以 /1.25。<br>购买次数: ${formatWhole(getBuyableAmount(this.layer, this.id))}/10<br>成本: ${format(this.cost())} 字节<br>效果: 冷却时间为 ${format(this.effect())}秒</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            purchaseLimit: 10,
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.div(5, Decimal.pow(1.25, getBuyableAmount(this.layer, this.id))).toNumber()},
        },
        22: {
            title: "<h3>主板</h3>",
            cost(x) { return new Decimal(1e6).mul(Decimal.pow(100, x)).mul(Decimal.pow(1.5, x.pow(2))) },
            display() { return `<span style="font-size:12px;">网格尺寸增加1行和1列。<br>购买次数: ${formatWhole(getBuyableAmount(this.layer, this.id))}/5<br>成本: ${format(this.cost())} 字节<br>效果: ${formatWhole(this.effect())}x${formatWhole(this.effect())} 网格</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            purchaseLimit: 5,
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.add(5, getBuyableAmount(this.layer, this.id)).toNumber()},
        },
        23: {
            title: "<h3>固态硬盘</h3>",
            cost(x) { return new Decimal(1e14).mul(Decimal.pow(25, x)).mul(Decimal.pow(1.2, x.pow(2))) },
            display() { return `<span style="font-size:12px;">金色方块倍率起始值和增长值变为10倍。<br>购买次数: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>成本: ${format(this.cost())} 字节<br>效果: ${format(this.effect())}倍 金色方块倍率</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(10, getBuyableAmount(this.layer, this.id))},
            unlocked() {return hasMilestone("c", 0)},
        },
        31: {
            title: "<h3>外部组件</h3>",
            cost(x) { return new Decimal(1e34).mul(Decimal.pow(1000, x)).mul(Decimal.pow(1.25, x.pow(2))) },
            display() { return `<span style="font-size:12px;">最大点击半径+1。<br>购买次数: ${formatWhole(getBuyableAmount(this.layer, this.id))}/4<br>成本: ${format(this.cost())} 字节<br>效果: 最大点击半径为 ${formatWhole(this.effect())}</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            purchaseLimit: 4,
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return getBuyableAmount(this.layer, this.id).toNumber() + 1},
            unlocked() {return hasMilestone("c", 2)},
        },
        32: {
            title: "<h3>电源供应器</h3>",
            cost(x) { return new Decimal(1e35).mul(Decimal.pow(100, x)).mul(Decimal.pow(1.5, x.pow(2))) },
            display() { return `<span style="font-size:12px;">升级者方块效果变为5倍。<br>购买次数: ${formatWhole(getBuyableAmount(this.layer, this.id))}/10<br>成本: ${format(this.cost())} 字节<br>效果: ${format(this.effect())}倍 升级者方块效果</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            purchaseLimit: 10,
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(5, getBuyableAmount(this.layer, this.id))},
            unlocked() {return hasMilestone("c", 2)},
        },
        33: {
            title: "<h3>算术逻辑单元 II</h3>",
            cost(x) { return new Decimal(1e36).mul(Decimal.pow(10000, x)).mul(Decimal.pow(1.1, x.pow(2))) },
            display() { return `<span style="font-size:12px;">字节生成速度变为10倍。<br>购买次数: ${formatWhole(getBuyableAmount(this.layer, this.id))}<br>成本: ${format(this.cost())} 字节<br>效果: ${format(this.effect())}倍 字节/秒</span>` },
            canAfford() { return player[this.layer].bytes.gte(this.cost()) },
            buy() {
                player[this.layer].bytes = player[this.layer].bytes.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {return Decimal.pow(10, getBuyableAmount(this.layer, this.id))},
            unlocked() {return hasMilestone("c", 2)},
        },
    },
    milestones: {
        0: {
            requirementDescription() {return `${format(3e6)} 芯片`},
            effectDescription: "解锁金色方块和2个新的可购买项。",
            done() { return player.c.points.gte(3e6) },
            unlocked() { return getBuyableAmount("c",22).gte(3) },
        },
        1: {
            requirementDescription() {return `${format(1e17)} 芯片`},
            effectDescription: "解锁创造者方块。",
            done() { return player.c.points.gte(1e17) },
            unlocked() { return hasMilestone("c",0) },
        },
        2: {
            requirementDescription() {return `${format(1e20)} 芯片`},
            effectDescription: "解锁升级者方块和3个新的可购买项。",
            done() { return player.c.points.gte(1e20) },
            unlocked() { return hasMilestone("c",1) },
        },
        3: {
            requirementDescription() {return `${format(1e35)} 芯片`},
            effectDescription: "解锁意外之财能力。",
            done() { return player.c.points.gte(1e35) },
            unlocked() { return hasMilestone("c",2) },
        },
        4: {
            requirementDescription() {return `${format(1e60)} 芯片`},
            effectDescription: "自动购买字节可购买项，不消耗字节。",
            done() { return player.c.points.gte(1e60) },
            unlocked() { return player.s.unlocked },
            toggles: [
                ["c","autoByteBuyables"],
            ],
        },
        5: {
            requirementDescription() {return `${format(1e90)} 芯片`},
            effectDescription: "最大点击半径+1，意外之财冷却时间为2秒。",
            done() { return player.c.points.gte(1e90) },
            unlocked() { return hasMilestone("c",4) },
        },
        6: {
            requirementDescription() {return `${format(1e120)} 芯片`},
            effectDescription: "解锁自动意外之财，并且如果存在升级者方块，棋盘会自动清除。",
            done() { return player.c.points.gte(1e120) },
            unlocked() { return hasMilestone("c",5) },
            toggles: [
                ["c","autoWindfall"],
            ],
        },
    },
    clickables: {
        11: {display: `<h2>-</h2>`,onClick() {player.c.clickRadius--},canClick() {return player.c.clickRadius > 1},style() {return {"width": "75px", "min-height": "75px"}},},
        12: {display: `<h2>+</h2>`,onClick() {player.c.clickRadius++},canClick() {return player.c.clickRadius < buyableEffect("c",31) + (hasMilestone("c",5) ? 1 : 0)},style() {return {"width": "75px", "min-height": "75px"}},},
        21: {
            display() {return `意外之财${player.c.windfallCooldown > 0 ? `<br>(${format(player.c.windfallCooldown)}秒)` : ``}`},
            tooltip: `召唤大量升级者方块`,
            onClick() {
                player.c.windfallCooldown = hasMilestone("c",5) ? 2 : 20
                for (let i = 0; i < 40; i++) {
                    let rand = Math.random()
                    let selected = layers.c.numberToGridID((Math.random() * (buyableEffect("c",22) ** 2)) + 1)
                    player.c.grid[selected] = 4
                }
            },
            canClick() {return player.c.windfallCooldown <= 0},
            style() {return {"width": "75px", "min-height": "75px"}},
            unlocked() {return hasMilestone("c",3)},
        },
    },
    grid: {
        rows() {return buyableEffect("c",22)},
        cols() {return buyableEffect("c",22)},
        maxRows: 10,
        maxCols: 10,
        getStartData(id) {
            return 0
        },
        getUnlocked(id) { // Default
            return true
        },
        getCanClick(data, id) {
            return true
        },
        onClick(data, id, clickRadius) {
            if (clickRadius === undefined) clickRadius = player.c.clickRadius

            if (clickRadius > 1) {
                let arr = [id - 1, id + 1, id - 100, id + 100, id - 101, id - 99, id + 99, id + 101]
                for (let i = 0; i < 8; i++) {
                    layers.c.grid.onClick(player.c.grid[arr[i]], arr[i], clickRadius - 1)
                }
            }

            if (data == 1 || data < 0) {
                player[this.layer].grid[id] = 0
                player.c.points = player.c.points.add(layers.c.generation())
                if (hasMilestone("c",0)) player.c.goldenTileMult = player.c.goldenTileMult.add(Decimal.mul(10, buyableEffect("c", 23)))
            }
            if (data == 2) {
                player[this.layer].grid[id] -= 2
                player.c.points = player.c.points.add(layers.c.generation().mul(player.c.goldenTileMult))
                player.c.goldenTileMult = Decimal.mul(10, buyableEffect("c", 23))
            }
            if (data == 3) {
                player[this.layer].grid[id] -= 3
                player.c.points = player.c.points.add(layers.c.generation())
                player.c.goldenTileMult = player.c.goldenTileMult.add(Decimal.mul(10, buyableEffect("c", 23)))
                let arr = [id - 1, id + 1, id - 100, id + 100, id - 101, id - 99, id + 99, id + 101]
                for (let i = 0; i < 8; i++) {
                    if (player.c.grid[arr[i]] != undefined && player.c.grid[arr[i]] == 0) {
                        let rand = Math.random()
                        let tile = 0
                        if (rand < layers.c.goldenTileChance()) tile = 2
                        if (rand > layers.c.goldenTileChance() && rand < layers.c.goldenTileChance() + layers.c.creatorTileChance()) tile = 3
                        if (rand > layers.c.goldenTileChance() + layers.c.creatorTileChance() && rand < layers.c.goldenTileChance() + layers.c.creatorTileChance() + layers.c.upgraderTileChance()) tile = 4
                        if (rand > layers.c.goldenTileChance() + layers.c.creatorTileChance() + layers.c.upgraderTileChance()) tile = 1
                        if (player.c.grid[arr[i]] == 0) player.c.grid[arr[i]] = tile
                    }
                }
            }
            if (data == 4) {
                player[this.layer].grid[id] -= 3
                player.c.points = player.c.points.add(layers.c.generation().mul(50))
                player.c.goldenTileMult = player.c.goldenTileMult.add(Decimal.mul(500, buyableEffect("c", 23)).mul(buyableEffect("c", 32)))
                let arr = [id - 1, id + 1, id - 100, id + 100, id - 101, id - 99, id + 99, id + 101]
                for (let i = 0; i < 8; i++) {
                    if (player.c.grid[arr[i]] != undefined) {
                        if (player.c.grid[arr[i]] == 0) player.c.grid[arr[i]] = 1
                        else if (player.c.grid[arr[i]] == 1) player.c.grid[arr[i]] = 3
                        else if (player.c.grid[arr[i]] == 3) player.c.grid[arr[i]] = 2
                        else if (player.c.grid[arr[i]] == 2) player.c.grid[arr[i]] = 4
                    }
                }
            }

            if (data < 0) {
                data == 0
            }
        },
        getStyle(data, id) {
            const style = {}
            style["width"] = "70px"
            style["max-height"] = "70px"
            if (data == 0) style["background-color"] = "#2e1a48"
            if (data == 2) style["background-color"] = "#ffd900"
            if (data == 3) style["background-color"] = "#003dd6"
            if (data == 4) style["background-color"] = "#00ff77"
            return style
        }
    }
})