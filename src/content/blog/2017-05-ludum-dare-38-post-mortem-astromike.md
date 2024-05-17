---
title: 'Ludum Dare 38 Post Mortem : Astromike'
date: "2017-05-11"
---

Ready, set, GO!

* * *

TL;DR; <a href="https://twitter.com/MarcoValeKaz" target="_blank" rel="noopener noreferrer">Marco Vale</a> and I made a game for Ludum Dare 38 in 72h that <a href="https://mikea15.itch.io/astromike" target="_blank" rel="noopener noreferrer">you can play here</a>. What follows is a small post mortem.

* * *

I was awake at 3 am to know the theme for Ludum Dare 38. I still hadn't made my mind if I was going to participate, it would depend on the theme and if I could come up with something. The theme was released, 'A Small World', and I immediately went to bed. There's nothing like a good night sleep, and letting my brain think about the theme.

So in the morning, I started researching the theme, I had micro-organisms in mind, micro and macro ecosystems but nothing really that would stand out. I thought about how Small World could lead to having a simple set of rules in a small constrained world, and with the micro-organisms idea, I shifted towards a space exploration game, heavily inspired by Hitman GO and Lara Croft GO games.

<img class="img-fluid rounded-5 m-1" src="{{ 'content/img/Pasted-image-at-2017_04_22-01_33-PM.png'" /> Initially, the idea would be to have your main character cleanup each level from organisms there but quickly shifted to a puzzle-solver sci-fi game. Having Hitman GO in mind, I prototyped a level and started to create what would become the node-based navigation system. A collection of nodes that the main character and enemies could travel to, based on their distances.

![Intro Level](/img/intro_level.png)

At this point, I had a friend of mine, <a href="https://twitter.com/MarcoValeKaz" target="_blank" rel="noopener noreferrer">Marco Vale</a>, asking if I needed an artist, so we teamed-up and he started to create assets for the game's environment, as well as a character, gun, jetpack and a crashed ship, while I was developing game mechanics. Soon after that, I had a node-based navigation working, and something a lot prettier than cubes to show.

At the end of day 1, we had a placeholder character moving around a map, an exit to finish the level, an enemy that would follow and kill the player, items to pick up, a simple inventory system, and trigger objects that would fire events, either to open or close passages and activate traps.

On day 2, Marco started with the main character, gun, and jetpack. Meanwhile, I was working on creating more levels, introducing new components to the game and building up from the previous levels. For instance, on level 2 you grab the gun, therefore level 3 has enemies that you're now able to shoot at in order to solve the puzzle and go on. The jetpack is unlocked further and will allow the player to jump across gaps.

![Jump](/img/jump_.png)

At this point, I was still implementing a Hitman GO movement style, because I thought that we wouldn't have time to make animations. Ultimately we had, so we threw that away, and gladly because it looks and feels much better.

<blockquote class="twitter-tweet" data-width="525" data-dnt="true">
  <p lang="en" dir="ltr">
    walk animation Hitman GO style! hi <a href="https://twitter.com/SquareEnixMtl?ref_src=twsrc%5Etfw">@SquareEnixMtl</a> <a href="https://twitter.com/hashtag/gamedev?src=hash&ref_src=twsrc%5Etfw">#gamedev</a> <a href="https://twitter.com/hashtag/indiedev?src=hash&ref_src=twsrc%5Etfw">#indiedev</a> <a href="https://twitter.com/hashtag/ldjam?src=hash&ref_src=twsrc%5Etfw">#ldjam</a> <a href="https://twitter.com/hashtag/ld38?src=hash&ref_src=twsrc%5Etfw">#ld38</a> <a href="https://t.co/qWM3WTZkxf">pic.twitter.com/qWM3WTZkxf</a>
  </p>
  
  <p>
    &mdash; Michael Adaixo (@MichaelAdaixo) <a href="https://twitter.com/MichaelAdaixo/status/856193366006038530?ref_src=twsrc%5Etfw">April 23, 2017</a>
  </p>
</blockquote>

The last couple of hours before the compo deadline, I swapped all placeholders for the gun and jetpack, integrated the animations for the main character, made some quick particle effects, created a teleport mechanic and added sound.

![Screen3](/img/screen_3.png)

On day 3, we focused on making it look better and fixing a few issues that were making the game difficult to play. We also added the crash site with the spaceship, decorations, particle effects and camera post processing.

<blockquote class="twitter-tweet" data-width="525" data-dnt="true">
  <p lang="en" dir="ltr">
    new menu scene for Astromike <a href="https://twitter.com/hashtag/ldjam?src=hash&ref_src=twsrc%5Etfw">#ldjam</a> <a href="https://twitter.com/hashtag/ld38?src=hash&ref_src=twsrc%5Etfw">#ld38</a> <a href="https://twitter.com/hashtag/indiedev?src=hash&ref_src=twsrc%5Etfw">#indiedev</a> <a href="https://twitter.com/hashtag/gamedev?src=hash&ref_src=twsrc%5Etfw">#gamedev</a> <a href="https://twitter.com/hashtag/madewithunity?src=hash&ref_src=twsrc%5Etfw">#madewithunity</a> <a href="https://t.co/HzMzvJQnwL">pic.twitter.com/HzMzvJQnwL</a>
  </p>
  
  <p>
    &mdash; Michael Adaixo (@MichaelAdaixo) <a href="https://twitter.com/MichaelAdaixo/status/856553416260280321?ref_src=twsrc%5Etfw">April 24, 2017</a>
  </p>
</blockquote>



I started the Ludum Dare alone, with a faint idea of what to do, and with <a href="https://twitter.com/MarcoValeKaz" target="_blank" rel="noopener noreferrer">Marco</a>'s amazing help, we were able to make something really nice, and learn a lot in the process. I think this is the most fun I've had making games in quite a while, and definitely my best LD entry so far. 72h later, I'm proud of the game we've created. <a href="https://mikea15.itch.io/astromike" target="_blank" rel="noopener noreferrer">Feel free to try it out</a>, and leave a comment if you like.

See you next Ludum Dare.