# Ha Noi Tower

A minimalist, interactive implementation of the classic mathematical puzzle. Test your logic and recursive thinking by moving the entire stack of disks from the source rod to the destination rod.

## 📖 Table of Contents

* [Overview](https://en.wikipedia.org/wiki/Tower_of_Hanoi)
* [Rules of the Game](https://en.wikipedia.org/wiki/Tower_of_Hanoi#Solution)
* [The Legend](https://en.wikipedia.org/wiki/Tower_of_Hanoi)
* [The Algorithm](https://en.wikipedia.org/wiki/Tower_of_Hanoi)
* [Installation & Usage](https://en.wikipedia.org/wiki/Tower_of_Hanoi)
* [Complexity](https://en.wikipedia.org/wiki/Tower_of_Hanoi)

---

## 🧐 Overview

The **Tower of Hanoi** consists of three rods and a number of disks of different diameters, which can slide onto any rod. The puzzle begins with the disks stacked on one rod in order of decreasing size (the smallest at the top, creating a conical shape).

The objective is to move the entire stack to another rod while following a strict set of rules.

## ⚖️ Rules of the Game

1. **Only one disk** can be moved at a time.
2. Each move consists of taking the **upper disk** from one of the stacks and placing it on top of another stack or an empty rod.
3. **No larger disk** may be placed on top of a smaller disk.

## ⛩️ The Legend

The puzzle was invented by the French mathematician **Édouard Lucas** in 1883. It is associated with a legend of a temple containing a large room with three time-worn posts surrounded by 64 golden disks. The monks have been moving these disks in accordance with the rules of the puzzle. According to the legend, when the last move of the 64-disk puzzle is completed, the world will end.

## 🤖 The Algorithm

This project uses a **Recursive Algorithm** to solve the puzzle. The logic follows these three steps:

1. Move  disks from the **Source** to the **Auxiliary** rod.
2. Move the remaining  disk from the **Source** to the **Destination** rod.
3. Move the  disks from the **Auxiliary** rod to the **Destination** rod.

### Mathematical Formula

The minimum number of moves required to solve a Tower of Hanoi puzzle with n disks is: **2<sup>n</sup> - 1**


## 🚀 Installation & Usage

- This game does not need any installation.
- To play the game, go through this site: https://hanoitower-ten.vercel.app/



## 📊 Complexity

* **Time Complexity:** O(2<sup>n</sup>)
* **Space Complexity:** O(n) (due to the recursive call stack)

---
