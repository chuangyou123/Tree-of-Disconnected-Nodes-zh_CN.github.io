addLayer("m", {
    // general stuff
    name: "物质",
    symbol: "M",
    position: 0, // horizontal position
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        multiplier: [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        power: [null,new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)],
        particles: {
            protons: new Decimal(0), // boosts powers generation BUT hurts electron gain
            electrons: new Decimal(0), // divides matter multiplier costs BUT hurts proton gain
            muons: new Decimal(0), // divides 2nd electron effect BUT hurts tau particle gain
            tau: new Decimal(0), // boosts electron gain BUT hurts muon gain
            gluons: new Decimal(0), // raises the base output of the 1st slider
            photons: new Decimal(0), // raises the base output of the 2nd slider
        },
        slider: [0.5,0,0],
        sliderTime: 0,
        frozen: false,
    }},
    color: "#ff56f7",
    resource: "物质",
    type: "none",
    row: 0, // 0 is first row
    layerShown(){return true},

    // calculations
    gainMult() {
        mult = new Decimal(1)
        for (let i = 1; i < 7; i++) mult = mult.mul(layers.m.powerMult(i))
        return mult
    },
    gainExp() {
        return new Decimal(1)
    },
    generation() {
        return this.gainMult().pow(this.gainExp())
    },
    powerMult(x) {
        return new Decimal(player[this.layer].power[x]).sqrt().add(1)
    },
    powerGen(x) {
        let gen = Decimal.pow(2, player[this.layer].multiplier[x]).mul(player[this.layer].multiplier[x])
        gen = gen.mul(layers.m.particleEff("proton",1))
        gen = gen.mul(layers.f.fluidEffect())
        return gen
    },
    multiplierCost(x) {
        let cost = Decimal.pow(Decimal.pow(10, Decimal.pow(2, x - 1)), Decimal.add(player[this.layer].multiplier[x], 1))
        cost = cost.div(layers.m.particleEff("electron",1))
        return cost
    },
    particleGen(str) {
        switch (str) {
            case "proton":
                if ((player.m.slider[0] < 0.5 && hasMilestone("m",0)) || (hasMilestone("m",3) && player.m.slider[0] == 0.5)) {
                    let gen = Decimal.pow(2,((0.5 - player.m.slider[0]) * 4) ** 2).pow(layers.m.particleEff("gluon"))
                    if (hasMilestone("m",3) && player.m.slider[0] == 0.5) gen = Decimal.pow(16, layers.m.particleEff("gluon"))
                    gen = gen.div(layers.m.particleEff("electron",2))
                    gen = gen.mul(layers.f.vaporEffect())
                    return gen
                } else return new Decimal(0)
            break
            case "electron":
                if ((player.m.slider[0] > 0.5 && hasMilestone("m",0)) || (hasMilestone("m",3) && player.m.slider[0] == 0.5)) {
                    let gen = Decimal.pow(2,((player.m.slider[0] - 0.5) * 4) ** 2).pow(layers.m.particleEff("gluon"))
                    if (hasMilestone("m",3) && player.m.slider[0] == 0.5) gen = Decimal.pow(16, layers.m.particleEff("gluon"))
                    gen = gen.div(layers.m.particleEff("proton",2))
                    gen = gen.mul(layers.m.particleEff("tau",1))
                    gen = gen.mul(layers.f.vaporEffect())
                    return gen
                } else return new Decimal(0)
            break
            case "muon":
                if ((player.m.slider[1] < 0.5 && hasMilestone("m",1)) || (hasMilestone("m",4) && player.m.slider[1] == 0)) {
                    let gen = Decimal.mul(162, 0.5 - player.m.slider[1]).pow(layers.m.particleEff("photon"))
                    if (hasMilestone("m",4) && player.m.slider[1] == 0) gen = Decimal.pow(81, layers.m.particleEff("photon"))
                    gen = gen.div(layers.m.particleEff("tau",2))
                    gen = gen.mul(layers.f.vaporEffect())
                    return gen
                } else return new Decimal(0)
            break
            case "tau":
                if ((player.m.slider[1] > 0.5 && hasMilestone("m",1)) || (hasMilestone("m",4) && player.m.slider[1] == 0)) {
                    let gen = Decimal.mul(162, player.m.slider[1] - 0.5).pow(layers.m.particleEff("photon"))
                    if (hasMilestone("m",4) && player.m.slider[1] == 0) gen = Decimal.pow(81, layers.m.particleEff("photon"))
                    gen = gen.div(layers.m.particleEff("muon",2))
                    gen = gen.mul(layers.f.vaporEffect())
                    return gen
                } else return new Decimal(0)
            break
            case "gluon":
                let trueSlider = ((player.m.slider[2] + 0.02) / 2) + 0.5
                if (hasMilestone("m",2)) {
                    let gen
                    if (trueSlider > 0.4 && trueSlider < 0.6) gen = new Decimal(50)
                    else if (trueSlider < 0.4) gen = Decimal.sub(50, 50 * (1 - (trueSlider / 0.4)))
                    else if (trueSlider > 0.6) gen = Decimal.sub(50, 50 * ((trueSlider - 0.6) / 0.4))
                    gen = gen.mul(layers.f.vaporEffect())
                    return gen
                } else return new Decimal(0)
            break
        }
    },
    particleEff(str,x) {
        let type = player.m.particles[str + (str == "tau" ? "" : "s")]
        switch (str) {
            case "proton":
                if (x == 1) return type.pow(0.75).add(1)
                if (x == 2) return type.add(1).log10().add(1)
            break
            case "electron":
                if (x == 1) return type.cbrt().add(1)
                if (x == 2) return type.add(1).log10().add(1).div(layers.m.particleEff("muon",1))
            break
            case "muon":
                if (x == 1) return type.pow(1.5).add(1)
                if (x == 2) return type.add(1).log10().add(1)
            break
            case "tau":
                if (x == 1) return type.pow(1.5).add(1)
                if (x == 2) return type.add(1).log10().add(1)
            break
            case "gluon":
                return type.add(1).log10().add(1).ln().add(1)
            break
            case "photon":
                return type.add(1).log10().add(1).ln().add(1)
            break
        }
    },
    automate() {
      if (player.m.autoMults && hasMilestone("m",5)) {
        if (player.m.points.gte(layers.m.multiplierCost(1))) player.m.multiplier[1] = player.m.points.mul(layers.m.particleEff("electron",1)).log(10).floor()
        if (player.m.points.gte(layers.m.multiplierCost(2))) player.m.multiplier[2] = player.m.points.mul(layers.m.particleEff("electron",1)).log(100).floor()
        if (player.m.points.gte(layers.m.multiplierCost(3))) player.m.multiplier[3] = player.m.points.mul(layers.m.particleEff("electron",1)).log(10000).floor()
        if (player.m.points.gte(layers.m.multiplierCost(4))) player.m.multiplier[4] = player.m.points.mul(layers.m.particleEff("electron",1)).log(1e8).floor()
        if (player.m.points.gte(layers.m.multiplierCost(5))) player.m.multiplier[5] = player.m.points.mul(layers.m.particleEff("electron",1)).log(1e16).floor()
        if (player.m.points.gte(layers.m.multiplierCost(6))) player.m.multiplier[6] = player.m.points.mul(layers.m.particleEff("electron",1)).log(1e32).floor()
      }
    },
    update(diff) {
        player[this.layer].points = player[this.layer].points.add(this.generation().mul(diff))
        for (let i = 1; i < 7; i++) {
            player[this.layer].power[i] = player[this.layer].power[i].add(layers.m.powerGen(i).mul(diff))
        }
        player[this.layer].particles.protons = player[this.layer].particles.protons.add(layers.m.particleGen("proton").mul(diff))
        player[this.layer].particles.electrons = player[this.layer].particles.electrons.add(layers.m.particleGen("electron").mul(diff))
        player[this.layer].particles.muons = player[this.layer].particles.muons.add(layers.m.particleGen("muon").mul(diff))
        player[this.layer].particles.tau = player[this.layer].particles.tau.add(layers.m.particleGen("tau").mul(diff))
        if (player.m.frozen) player[this.layer].particles.gluons = player[this.layer].particles.gluons.add(layers.m.particleGen("gluon").mul(diff))
        if (player.m.frozen) player[this.layer].particles.photons = player[this.layer].particles.photons.add(layers.m.particleGen("gluon").mul(diff))
        if (!player.m.frozen) player[this.layer].slider[1] -= diff / (hasMilestone("m",2) ? 10 : 50)
        player[this.layer].slider[1] = Math.max(player[this.layer].slider[1],0)
        if (hasMilestone("m",2) && !player.m.frozen) player[this.layer].sliderTime += 0.05
        if (hasMilestone("m",2) && !player.m.frozen) player[this.layer].slider[2] += Math.cos(player.m.sliderTime)*0.05
    },

    // UI elements
    tabFormat: [
        "milestones",
        "main-display",
        ["display-text", () => `你每秒获得 ${format(layers.m.generation())} 物质。`],
        "buyables",
        "blank",
        ["display-text", () => `你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[1])}</h2> 个一级物质倍率器。<br>你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[1])}</h2> 一级能量。(${format(layers.m.powerGen(1))}/秒)<br>(倍率: ${format(layers.m.powerMult(1))}x)`],
        ["clickables", [1]],
        "blank",
        () => player.m.multiplier[1].gt(0) ? ["display-text", `你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[2])}</h2> 个二级物质倍率器。<br>你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[2])}</h2> 二级能量。(${format(layers.m.powerGen(2))}/秒)<br>(倍率: ${format(layers.m.powerMult(2))}x)`] : '',
        () => player.m.multiplier[1].gt(0) ? ["clickables", [2]] : '',
        "blank",
        () => player.m.multiplier[2].gt(0) ? ["display-text", `你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[3])}</h2> 个三级物质倍率器。<br>你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[3])}</h2> 三级能量。(${format(layers.m.powerGen(3))}/秒)<br>(倍率: ${format(layers.m.powerMult(3))}x)`] : '',
        () => player.m.multiplier[2].gt(0) ? ["clickables", [3]] : '',
        "blank",
        () => player.m.multiplier[3].gt(0) ? ["display-text", `你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[4])}</h2> 个四级物质倍率器。<br>你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[4])}</h2> 四级能量。(${format(layers.m.powerGen(4))}/秒)<br>(倍率: ${format(layers.m.powerMult(4))}x)`] : '',
        () => player.m.multiplier[3].gt(0) ? ["clickables", [4]] : '',
        "blank",
        () => player.m.multiplier[4].gt(0) ? ["display-text", `你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[5])}</h2> 个五级物质倍率器。<br>你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[5])}</h2> 五级能量。(${format(layers.m.powerGen(5))}/秒)<br>(倍率: ${format(layers.m.powerMult(5))}x)`] : '',
        () => player.m.multiplier[4].gt(0) ? ["clickables", [5]] : '',
        "blank",
        () => player.m.multiplier[5].gt(0) ? ["display-text", `你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${formatWhole(player.m.multiplier[6])}</h2> 个六级物质倍率器。<br>你拥有 <h2 style="color: #ff56f7; text-shadow: 0px 0px 10px #ff56f7">${format(player.m.power[6])}</h2> 六级能量。(${format(layers.m.powerGen(6))}/秒)<br>(倍率: ${format(layers.m.powerMult(6))}x)`] : '',
        () => player.m.multiplier[5].gt(0) ? ["clickables", [6]] : '',
        "blank",
        () => hasMilestone("m",0) ? ["bar","slider1"] : '',
        () => hasMilestone("m",0) ? ["clickables",[7]] : '',
        () => hasMilestone("m",0) ? ["display-text", `<span style="color: #72e0ff">你拥有 ${format(player.m.particles.protons)} 个质子，将物质倍率器能量的生成倍率乘以 ${format(layers.m.particleEff("proton",1))}x<br>并将电子生成除以 /${format(layers.m.particleEff("proton",2))}。</span>`] : '',
        "blank",
        () => hasMilestone("m",0) ? ["display-text", `<span style="color: #ff7272">你拥有 ${format(player.m.particles.electrons)} 个电子，将物质倍率器的成本除以 /${format(layers.m.particleEff("electron",1))}<br>并将质子生成除以 /${formatSmall(layers.m.particleEff("electron",2))}。</span>`] : '',
        "blank",
        () => hasMilestone("m",1) ? ["bar","slider2"] : '',
        () => hasMilestone("m",1) ? ["clickables",[8]] : '',
        () => hasMilestone("m",1) ? ["display-text", `此滑块会自然衰减。`] : '',
        "blank",
        () => hasMilestone("m",1) ? ["display-text", `<span style="color: #ffc95d">你拥有 ${format(player.m.particles.muons)} 个μ子，将第二个电子效果除以 /${format(layers.m.particleEff("muon",1))}<br>并将τ粒子生成除以 /${format(layers.m.particleEff("muon",2))}。</span>`] : '',
        "blank",
        () => hasMilestone("m",1) ? ["display-text", `<span style="color: #85fe84">你拥有 ${format(player.m.particles.tau)} 个τ粒子，将电子生成乘以 ${format(layers.m.particleEff("tau",1))}x<br>并将μ子生成除以 /${format(layers.m.particleEff("tau",2))}。</span>`] : '',
        "blank",
        () => hasMilestone("m",2) ? ["bar","slider3"] : '',
        () => hasMilestone("m",2) ? ["clickables",[9]] : '',
        () => hasMilestone("m",2) ? ["display-text", `将此滑块冻结在中心位置将提供最大产量。`] : '',
        () => hasMilestone("m",2) ? ["display-text", `冻结第三个滑块也会冻结第二个滑块。`] : '',
        "blank",
        () => hasMilestone("m",2) ? ["display-text", `<span style="color: #c56fff">你拥有 ${format(player.m.particles.gluons)} 个胶子，将第一个滑块的基础输出提高 ^${format(layers.m.particleEff("gluon"))}。</span>`] : '',
        "blank",
        () => hasMilestone("m",2) ? ["display-text", `<span style="color: #fffd74">你拥有 ${format(player.m.particles.photons)} 个光子，将第二个滑块的基础输出提高 ^${format(layers.m.particleEff("photon"))}。</span>`] : '',
        "blank",
        "blank",
    ],
    milestones: {
        0: {
            requirementDescription() {return `${format(1e7)} 物质`},
            effectDescription: "解锁第一个滑块。",
            done() { return player.m.points.gte(1e7) },
            unlocked() { return player.m.multiplier[3].gt(0) },
        },
        1: {
            requirementDescription() {return `${format(1e21)} 物质`},
            effectDescription: "解锁第二个滑块。",
            done() { return player.m.points.gte(1e21) },
            unlocked() { return player.m.multiplier[5].gt(0) },
        },
        2: {
            requirementDescription() {return `${format(1e44)} 物质`},
            effectDescription: "解锁第三个滑块，并且第二个滑块衰减得更快。",
            done() { return player.m.points.gte(1e44) },
            unlocked() { return player.m.multiplier[6].gt(0) },
        },
        3: {
            requirementDescription() {return `${format(1e60)} 物质`},
            effectDescription: "当第一个滑块居中时，你可以生产质子和电子。",
            done() { return player.m.points.gte(1e60) },
            unlocked() { return hasMilestone("m",2) },
        },
        4: {
            requirementDescription() {return `${format(1e80)} 物质`},
            effectDescription: "当第二个滑块为空时，你可以生产μ子和τ粒子。",
            done() { return player.m.points.gte(1e80) },
            unlocked() { return player.f.unlocked },
        },
        5: {
            requirementDescription() {return `${format(1e120)} 物质`},
            effectDescription: "自动购买倍率器倍率器，不消耗物质。",
            done() { return player.m.points.gte(1e120) },
            unlocked() { return player.f.unlocked },
            toggles: [
                ["m","autoMults"],
            ],
        },
    },
    clickables: {
        11: {
            display() {return `花费 ${format(layers.m.multiplierCost(1))} 物质购买`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(1))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(1))
                player.m.multiplier[1] = player.m.multiplier[1].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        21: {
            display() {return `花费 ${format(layers.m.multiplierCost(2))} 物质购买`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(2))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(2))
                player.m.multiplier[2] = player.m.multiplier[2].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        31: {
            display() {return `花费 ${format(layers.m.multiplierCost(3))} 物质购买`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(3))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(3))
                player.m.multiplier[3] = player.m.multiplier[3].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        41: {
            display() {return `花费 ${format(layers.m.multiplierCost(4))} 物质购买`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(4))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(4))
                player.m.multiplier[4] = player.m.multiplier[4].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        51: {
            display() {return `花费 ${format(layers.m.multiplierCost(5))} 物质购买`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(5))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(5))
                player.m.multiplier[5] = player.m.multiplier[5].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        61: {
            display() {return `花费 ${format(layers.m.multiplierCost(6))} 物质购买`},
            canClick() {return player.m.points.gte(layers.m.multiplierCost(6))},
            onClick() {
                player.m.points = player.m.points.sub(layers.m.multiplierCost(6))
                player.m.multiplier[6] = player.m.multiplier[6].add(1)
            },
            style() {
                return {"min-width": "100px", "min-height": "50px"}
            },
        },
        71: {display: `<h2><-</h2>`,onClick() {player.m.slider[0] -= 0.25},canClick() {return player.m.slider[0] > 0},style() {return {"width": "75px", "min-height": "75px"}},},
        72: {display: `<h2>-></h2>`,onClick() {player.m.slider[0] += 0.25},canClick() {return player.m.slider[0] < 1},style() {return {"width": "75px", "min-height": "75px"}},},
        81: {display: `<h2>-></h2>`,onClick() {player.m.slider[1] += 0.2; player.m.slider[1] = Math.min(player.m.slider[1],1)},canClick() {return player.m.slider[1] < 1},style() {return {"width": "75px", "min-height": "75px"}},},
        91: {display() {return `<h3>${player.m.frozen ? `解冻` : `冻结`}</h3>`},onClick() {player.m.frozen = !player.m.frozen},canClick() {return true},style() {return {"width": "75px", "min-height": "75px"}},},
    },
    bars: {
        slider1: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.m.slider[0]},
            display: () => `每秒生产 ${format(layers.m.particleGen("proton"))} 个质子和 ${format(layers.m.particleGen("electron"))} 个电子`,
            fillStyle() { return {"background-color": "#c00eb7"} },
        },
        slider2: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return player.m.slider[1]},
            display: () => `每秒生产 ${format(layers.m.particleGen("muon"))} 个μ子和 ${format(layers.m.particleGen("tau"))} 个τ粒子`,
            fillStyle() { return {"background-color": "#680b63"} },
        },
        slider3: {
            direction: 3,
            width: 500,
            height: 75,
            progress() {return ((player.m.slider[2] + 0.02) / 2) + 0.5},
            display: () => `${player.m.frozen ? `每秒生产 ${format(layers.m.particleGen("gluon"))} 个胶子和光子` : `冻结后将开始生产`}`,
            fillStyle() { return {"background-color": "#a94ea6"} },
        },
    },
})