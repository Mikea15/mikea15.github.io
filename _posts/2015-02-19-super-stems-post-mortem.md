---
id: 275
title: Super Stems Post Mortem
date: 2015-02-19T22:08:13+00:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=275
permalink: /2015/02/super-stems-post-mortem/
dsq_thread_id:
  - "3530719011"
image: /wp-content/uploads/B9Hq3-fIgAA0Kj-.jpg
categories:
  - General
tags:
  - development
  - gamedev
  - GameJam
  - iOS
  - ipad
  - iphone
  - ludum dare
  - programming
  - super stems
  - unity3d
---
<img class="alignleft size-medium wp-image-278" src="http://mikeadev.net/wp-content/uploads/B4L4pozCYAAHAwj-300x203.png" alt="B4L4pozCYAAHAwj" /> Super Stems, originally called Stems, started on a gamejam weekend, Ludum Dare 31. The theme was "Entire Game on One Screen", which many people complained about, me included, since a lot of people were expecting the snowman theme to be chosen. Aside from that, once the theme was announced, I started to make Stems.

So what is Super Stems? Super Stems is a board domination strategy game. You have tiles and board slots. Each tile has three sides, a number attached, and adjacent sides on the board will battle. Upon battle, the higher number will win, and the losing tile will be captured. This is a simple concept that I stripped down from another game I'm planning, which has this basic gameplay with more gameplay mechanics, inventory and multiplayer in it.<img class="alignright size-medium wp-image-279" src="http://mikeadev.net/wp-content/uploads/B4M3HkVCAAAjR2a-300x159.png" alt="B4M3HkVCAAAjR2a" /> But since I had only 48 hours to make it happen, I stripped it down to this. A few hours in, I had the tiles and placeholder models and ready to be used in Unity.

I don't usually take much time in planning during gamejams, I usually go all in with a minimum planning and knowing what I must do and sort and solve problems as they arrive. But since [Indies vs Pew Die Pie](http://mikeadev.net/2014/11/indies-vs-pewdiepie-gamejam/ "Indies vs PewDiePie Gamejam") gamejam went really bad because from the lack of planning, this time around, I took some time to plan ahead and think of what I wanted to make.

<img class="alignleft size-medium wp-image-280" src="http://mikeadev.net/wp-content/uploads/B4NwB0yCYAA60AN-300x141.png" alt="B4NwB0yCYAA60AN" /> 

So with my plan written down and my idea right fixed in my head, I started developing the game until I had basic gameplay done. If you asked me by then, how much more time would I take me to finish a minimum viable product, I would've said a week, maybe less, but oh boy was I wrong. First things first, the gamejam atitude of coding this and that without taking much care, because time is of the essence, is bad. I don't use magic numbers, nor hardcode anything. I usually take care in writing beautiful and maintainable code. So for that end, I was good. On the other hand, I manually placed the grid and linked neighbors, one by one. Since the original grid had only 9 pieces, it was fast and did the job. Finding after a few days that some of those links were broken/switched, was bad tho.. Mistake #1.

<img class="alignright size-medium wp-image-281" src="http://mikeadev.net/wp-content/uploads/B4S5hSqCYAEo2QU-300x150.png" alt="B4S5hSqCYAEo2QU" /> 

But nonetheless, everything was in place, I had the grid, the basic Turn-by-Turn gameplay, basic animation, tile capturing, teams, score. I was just missing an opponent.. better yet.. an Intelligent Opponent. Making the Artificial Intelligence was hard. It was hard because of mistake n# 1, not having a generic grid, in which I could make the calculations required to make it easier for me. Having a properly made grid system, I could have made methods to make my life so much easier, but nooo.. I might have written the battle, capture, AI play code at least 5 times! And by this I mean, really starting from scratch. Taking pen and paper, putting it all in a new perspective. And every time I did it, something good came out of it. Every time it god better. Obviously by now, the 48h period had long gone. I was more like two weeks after the deadline, mainly because I was working on it part time, after work, 3 or 4 hours a day, and you can only do so much.

<img class="alignright size-medium wp-image-282" src="http://mikeadev.net/wp-content/uploads/B7bShESIEAEFEi6-225x300.jpg" alt="B7bShESIEAEFEi6" /> 

But still after those AI changes, it wasn't working properly yet. I wanted to make it smarter. After another brainstorming session with pen and paper, I finally tweaked the algorithm to make it the way I wanted to. You can now have decent battles with it. It will lose, but also win. So far, from online gameplay and local testing, my analytics say that the AI wins above 60% of the times, so I'm ok with that. During that time, while I was trying to get the AI right, I kept changing the UI, textures and models. The images speak for themselves. 

<img class="alignleft size-medium wp-image-283" src="http://mikeadev.net/wp-content/uploads/B9Hq3-fIgAA0Kj--225x300.jpg" alt="B9Hq3-fIgAA0Kj-" /> 

Right now the game is ready to be published. Its maybe not as polished as I would like it to be, but I have to release it, get feedback, and then I'll see what I'll do with it. I'm already thinking of other games I want to make. This is my second &#8216;board' game. This one has a new gameplay type, which is good, since I always try to make new gameplay on each game. So I'll be releasing the game in the upcoming weeks, hopefully this will get some players. At least more than my previous one.