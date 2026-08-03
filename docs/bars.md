# 条

条让你能以更直接的方式展示信息。它可以是进度条、生命条、容量表，或任何其他东西。

条的定义方式与其他大型特性相同：

```js
bars: {
    bigBar: {
        direction: RIGHT,
        width: 200,
        height: 50,
        progress() { return 0 },
        etc
    },
    etc
}
```

特性：

- direction：UP、DOWN、LEFT 或 RIGHT（不是字符串）。决定条随进度填充的方向。RIGHT 表示从左到右。

- width、height：条的尺寸（以像素为单位），但用数字表示（末尾不加“px”）。

- progress()：一个函数，返回条已填充的部分，从 0 表示“空”到 1 表示“满”，自动更新。
    （如果值超出这些范围也不会发生什么坏事，它可以是数字或 `Decimal`）

- display()：**可选**。一个函数，返回显示在条上方的文本，可以使用 HTML。

- unlocked()：**可选**。一个返回布尔值的函数，用于确定条是否可见。默认值为 unlocked。

- baseStyle、fillStyle、borderStyle、textStyle：**可选**，以对象形式对未填充部分、填充部分、边框以及条上显示的文本应用 CSS，其中键为 CSS 属性，值为这些属性的值（均为字符串）。

- layer：**自动分配**。其值与此层的名称相同，因此你可以执行 `player[this.layer].points` 或类似操作。

- id：**自动分配**。这是条存储时所用的“键”，便于访问。示例中条的 id 是“bigBar”。


- instant：**非常可选**。如果为 true，条将立即跳转到当前值，而不是在中间进行动画过渡。适用于涉及精确计时的场景。