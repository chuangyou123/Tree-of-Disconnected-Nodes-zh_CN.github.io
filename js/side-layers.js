addLayer("ach", {
    // general stuff
    name: "成就",
    symbol: "★",
    position: 0, // horizontal position
    startData() { return {
        unlocked: true,
    }},
    color: "#999999",
    tooltip: "成就",
    type: "none",
    row: "side", // side layer
    layerShown(){return true},

    // UI elements
    tabFormat: [
        () => !player.f.unlocked ? ["display-text", `目前这里什么都没有...`] : '',
        () => player.f.unlocked ? ["display-text", `每解锁一个节点，你就会解锁一行成就；每解锁一个其他节点，你就会解锁一列成就。`] : '',
        "blank",
        () => player.f.unlocked ? "achievements" : '',
    ],
    achievements: {
        11: {
            name: "浮点溢出",
            done() {return player.m.points.gte(Decimal.pow(2, 1024))},
            tooltip() {return `达到 ${format(Decimal.pow(2, 1024))} 物质。`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#ff56f7"; return style},
        },
        12: {
            name: "强相互作用",
            done() {return player.m.particles.gluons.gte(1e128)},
            tooltip() {return `达到 ${format(1e128)} 胶子。`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#ff56f7"; return style},
            unlocked() {return player.s.unlocked},
        },
        21: {
            name: "天网",
            done() {return player.f.singularities.gte(1e9)},
            tooltip() {return `达到 ${format(1e9)} 奇点。`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#6cc9fe"; return style},
        },
        22: {
            name: "事情正在升温",
            done() {return player.f.planckPoints.gte(1e21)},
            tooltip() {return `达到 ${format(1e21)} 普朗克点。`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#6cc9fe"; return style},
            unlocked() {return player.s.unlocked},
        },
        31: {
            name: "康威的杂草",
            done() {return layers.c.upgraderTileCount() >= 80},
            tooltip() {return `拥有至少 ${formatWhole(80)} 个升级器瓦片。`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#8c51d8"; return style},
            unlocked() {return player.c.unlocked}
        },
        32: {
            name: "无条件循环",
            done() {return hasMilestone("c",6)},
            tooltip() {return `获得第 7 个芯片里程碑。`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#8c51d8"; return style},
            unlocked() {return player.s.unlocked},
        },
        41: {
            name: "挤压成型",
            done() {return player.s.dimensionUpgrades[3].gte(3)},
            tooltip() {return `达到 3 米的主弦深度。`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#2ec766"; return style},
            unlocked() {return player.s.unlocked}
        },
        42: {
            name: "五元精髓",
            done() {return player.s.stringTypes[5].gte(55555)},
            tooltip() {return `达到 ${format(55555)} 五元弦。`},
            style() {const style = {}; if (hasAchievement(this.layer,this.id)) style["background-color"] = "#2ec766"; return style},
            unlocked() {return player.s.unlocked}
        },
    },
})

addLayer("help", {
    // general stuff
    name: "帮助",
    symbol: "?",
    position: 1, // horizontal position
    startData() { return {
        unlocked: true,
    }},
    color: "#ffffff",
    tooltip: "帮助",
    type: "none",
    row: "side", // side layer
    layerShown(){return true},

    // UI format
    tabFormat: {
        "ach": {
            content: [
                ["display-text", () => `注意：这不是教程菜单，而是帮助菜单。`],
            ],
        },
        "ach": {
            buttonStyle: {
                "border-color": "#ff56f7",
            },
            content: [
                ["display-text", () => `我在一片广阔无垠的虚空中醒来。起初，我无法睁开眼睛。我小心翼翼地让眼皮垂下又抬起。一开始很难分辨我的眼睛是睁着还是闭着。<br><br>
                我试着移动。我试图挥舞我的手臂，但它们纹丝不动。我的四肢感觉像是被岩石包裹，仿佛整个世界的重量都压在我身上。我试着晃动我的腿，但它们也拒绝听从我的意愿。<br><br>
                过了一会儿，我想到了用我的声音。我大声呼喊，渴望得到回应。<br><br>
                “有人吗？我需要帮助！”我试图说出口，但声音却闷闷的。就像有一只手按在我的嘴上。我的喉咙感觉很紧。<br><br>
                深渊没有回应。<br><br>
                “我孤身一人！我动不了！求求你们，谁来帮帮我！”我想。<br><br>
                我想尖叫，但我做不到。我想让眼泪流下脸颊，去感受些什么，但就连我眼睛里的泪腺也拒绝让我的泪水流下。<br><br>
                “求求你们...”<br><br>
                如果现实存在于脑海中，那么我的脑海就是一片空白。除了黑暗，我的感知中空无一物。然而，我的周围却有如此巨大的压力。<br><br>
                我相信周围的世界正在合谋摧毁我的意志。它想让我对着命运挥舞拳头，然后绝望地向虚空投降。但我不会屈服！正如我的身体拒绝服从我一样，我也不会屈服于抛向我的任何事物。我要逃离这个监狱...这场折磨！<br><br>
                总有一天，我会找到移动的方法。我会离开这里。<br><br>
                你能听到我吗？`],
            ],
        },
        "ach": {
            unlocked() {return player.f.unlocked},
            buttonStyle: {
                "border-color": "#6cc9fe",
            },
            content: [
                ["display-text", () => `我想我发现了一些东西。由于我感官有限，起初我并没有意识到这种感觉。就好像这个地方是我唯一体验过的刺激。如此令人窒息的地方会对你产生这种影响。<br><br>
                我在一片无尽海洋的底部。黑暗的海水环绕着我。大海束缚着我，压缩着我的肺，直到它们无法反抗。我感觉到了脚下的沙子，细小的鹅卵石在我的脚趾间滑动，奔向某个未知的目的地。<br><br>
                有一段时间，我慢慢地训练自己重新移动双腿。现在意识到了周围的水，我慢慢地让双腿在洋流中跋涉。我移动双脚踢起沙子。我非常渴望以任何方式感受质感。<br><br>
                我很无聊。我的思绪开始飘散。当我试图理清思绪时，我通常会踱步；不幸的是，我当时没有那种奢侈。<br><br>
                在我生命的大部分时间里，我都感到压力压在我身上。无论是好成绩、友善的行为，还是正确的看法，我都遵循着。我希望别人快乐。为什么我就不能对自己也这么说呢？<br><br>
                花点时间想想这个。你有没有为了他人的方便而牺牲过自己的幸福？<br><br>
                我有时害怕自己最终会做一份讨厌的工作；更糟的是，因为市场不存在，我永远不会被雇用。我甚至想过，我本不应该存在于这个世界上，这个世界排斥我，因为它的系统不是为我设计的。也许这就是我被困在这里的原因。<br><br>
                我试着深呼吸，但水涌入喉咙时我呛住了。我咳嗽起来。那是我第一次能够喊叫。<br><br>
                我试着理清思绪。让我们转向一个乐观的角度。<br><br>
                我真诚地相信世界会随着时间的推移变得更好。新概念将被常态化，更多机会将变得可及，技术也将进步。<br><br>
                无论你给自己施加了什么样的压力，请记住未来是不确定的，所以你可以成为塑造它的人。`],
            ],
        },
        "ach": {
            unlocked() {return player.c.unlocked},
            buttonStyle: {
                "border-color": "#8c51d8",
            },
            content: [
                ["display-text", () => `在这个新环境中，我最终重新获得了自由移动的能力。在这个高压的地方，我越是锻炼我的肌肉，我的四肢就越能适应并重新变得有用。<br><br>
                有一次，我变得好奇。我向前伸展左腿，慢慢地把脚踩进沙子里。然后，我有意识地把左腿作为支点。抬起右腿，我得以把脚放在比左脚更远的地方。我弄清楚了如何走路！<br><br>
                我时不时地四处走动，探索我的新栖息地。我确保在我最初出现的地方画一个圆圈。起初，我只向前走了几米，然后焦虑地退了回来。但随着我继续移动，我的路径变得更加大胆。<br><br>
                十米。二十米。五十米。在某个时刻，我决定要一直沿着直线向前走。在找到有趣的东西之前，我拒绝走回去。既然我已经立下了这个心理约定，我若有所思地凝视着海底的地平线，开始了我的漫长跋涉。<br><br>
                很长一段时间里，除了我已经不幸习以为常的水和沙子，我什么也没看到。然而，当我的旅程大约进行到 300 米时，情况发生了变化。<br><br>
                有一道光。一道闪烁的绿光，离我很远。但我仍然能看到它。我变得非常兴奋，以至于在某个时刻我的身体忘记了感知周围的压力。<br><br>
                我试着跳跃，我的双脚离开了地面。但是，我没有落回地面。我挥舞着手臂，但它们只是把我向前推。那一刻，我意识到我可以自由地游泳了。<br><br>
                我继续游着，到达了绿光处。它来自一张桌子上的小型电脑。电脑旁边是一个键盘和鼠标。为什么这些东西会在海底？它可能根本不能用。但为什么这套设备摆放得如此整齐？<br><br>
                这让我想起了一些事情。人类天生就想找出所有问题的解决方案。通常，强行给生活中的所有问题套上整齐的答案会形成一个被曲解的图景。<br><br>
                我们中的许多人非常想假装自己是完全理性的生物。然而，在我们大脑最偏远的角落，存在着一个非理性的思维。一个拥有我们无法完全理解的想法、欲望和情感的思维。我们试图通过逻辑推理来解释为什么这些想法是错误的或不相关的；然而，它们不断回来。<br><br>
                我想我只需要接受我的世界本质上也是非理性的。`],
            ],
        },
        "ach": {
            unlocked() {return player.s.unlocked},
            buttonStyle: {
                "border-color": "#2ec766",
            },
            content: [
                ["display-text", () => `我小心翼翼地坐在面前的办公椅上，开始茫然地盯着空白的电脑显示器。走了这么远，我很庆幸有时间考虑接下来的步骤。<br><br>
                这台电脑在水下能用吗？如果能，上面有什么？它能帮助我吗？我想只有一种方法可以知道。<br><br>
                我按下电源按钮，开始听到轻微的嗡嗡声。我已经很久只听到周围水流的声音了，所以我的耳朵对这种新发现的噪音很敏感。我欢迎这种新的刺激。<br><br>
                相信我，当显示器发出明亮的光芒时，我震惊了。我忽略了涌入脑海的关于电脑在这个深度水下如何工作的任何问题，因为我也不知道自己是如何在这个深度醒来的。<br><br>
                不幸的是，这台电脑没有操作系统。白屏过渡到了一个老式的终端。一个绿色的“>”符号和闪烁的光标吸引了我的注意。<br><br>
                我不懂任何计算机编程，所以我不知道自己能否有所进展。我试着输入一个简单的命令，希望它能起作用。<br><br>
                <span style="color:#00ff00">"> start"</span><br>
                <span style="color:#ff0000">"错误：无效命令。输入 'help' 查看可用命令。"</span><br><br>
                嗯，这似乎是个好建议。<br><br>
                <span style="color:#00ff00">"> help"</span><br>
                <span style="color:#00ff00">"可用命令：help, matter, fluid, chips, strings"</span><br><br>
                我心想这些命令过于具体和奇怪。尽管如此，我还是忽略了这种感觉，依次尝试了每个命令。我惊讶地发现，显示的页面是我关于海洋囚禁的想法。<br><br>
                我读了“matter”页面的开头。“我在一片广阔无垠的虚空中醒来。起初，我无法睁开眼睛...”<br><br>
                我的头感觉很重。我觉得自己要吐了。又读了一些之后，我输入了最后一个可用命令。<br><br>
                <span style="color:#00ff00">"> strings"</span><br><br>
                屏幕上没有显示段落，而是出现了一个波动网格的 3D ASCII 显示。屏幕底部写着一些文字，声称这是一个量子物理模拟。<br><br>
                你知道吗，在通过这些命令阅读了一些我转录的想法后，我意识到我可能显得说教或自命不凡，好像我认为自己在描述非常深刻或原创的感受或观点，而这些是别人从未说过的，但实际上我是在让自己出丑。事实是，我只是想离开这里，好吗？`],
            ],
        },
    },
})