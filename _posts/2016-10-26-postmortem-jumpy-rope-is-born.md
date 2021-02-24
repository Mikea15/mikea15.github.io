---
id: 409
title: 'Postmortem: Jumpy Rope is born'
date: 2016-10-26T22:12:17+01:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=409
permalink: /2016/10/postmortem-jumpy-rope-is-born/
mixpanel_event_label:
  - ""
dsq_thread_id:
  - "5255803995"
image: /content/img/MWU_Banner.jpg
categories:
  - General
---
Jumpy Rope is an endless arcade jumper game for [iOS](http://bit.ly/sky_jrope_), and on [Android](http://bit.ly/sk_jrope_) platforms, featuring low poly graphic style, customizable characters and simple gameplay mechanics.

Jumpy Rope was inspired from Final Fantasy IX mini jump rope game, which has Vivi play jump the rope. I thought it could be fun to have a small game that would bring back these memories. So from the beginning, this is what I wanted to game to play like.

<figure id="attachment_421" aria-describedby="caption-attachment-421" class="wp-caption aligncenter"><img class="wp-image-421 size-large" src="http://mikeadev.net/content/img/pmjr_3.png" alt="pmjr_3" /><figcaption id="caption-attachment-421" class="wp-caption-text">Art Style orientation</figcaption></figure>

As for visual style, Crossy Road, Monument Valley where all people talked about, and for good reason, they look very good, and they play very well. I decided to go for the same direction and aim for low poly flat shading. I was really fond of the idea to have a small, contained environment. After browsing for inspiration, I found a mix of floating islands like Captain Toad Treasure Tracker. By now, I had gameplay and art orientation, so I started to work on it.

I started to work as I always do, gameplay first, so I focused on the jumping mechanism, which is the most important part of the game, [making a tutorial at the same time for that](http://mikeadev.net/2015/08/variable-jump-height-in-unity/) ( which as evolved from the tutorial, and is was not implemented in the game ).

A week later I had a prototype which ugly models, art, and no polish, as prototypes should be. With a couple of polish here and there, and a couple of assets from Unity's asset store, I tough I could make it, and release it. It wouldn't be the best thing in the world, but having no team to work with, it was all I had. Luckily, I stumble upon this:

<blockquote class="twitter-tweet" data-width="525" data-dnt="true">
  <p lang="en" dir="ltr">
    Trying my hand at some low-poly illustration<a href="https://twitter.com/hashtag/3dart?src=hash&ref_src=twsrc%5Etfw">#3dart</a> <a href="https://twitter.com/hashtag/blender3d?src=hash&ref_src=twsrc%5Etfw">#blender3d</a> <a href="https://twitter.com/hashtag/lowpoly?src=hash&ref_src=twsrc%5Etfw">#lowpoly</a> <a href="https://twitter.com/hashtag/illustration?src=hash&ref_src=twsrc%5Etfw">#illustration</a> <a href="https://t.co/ddZbkpWVdB">pic.twitter.com/ddZbkpWVdB</a>
  </p>
  
  <p>
    &mdash; Fi da Silva 🎀 (@fifsilva) <a href="https://twitter.com/fifsilva/status/658029067187396609?ref_src=twsrc%5Etfw">October 24, 2015</a>
  </p>
</blockquote>



When I saw this, I immediately knew this was the style and islands I was looking for. After contacting [@fifsilva](https://twitter.com/fifsilva) and explaining the project, she jumped along to make a couple of floating islands for Jumpy Rope.

The game went from mediocre looking to awesome! I really love those tiny floating islands she made. This pushed the overall game quality, and I had no more programmer art anymore. All I needed now was characters. I met some people and then was references to others. I was lucky enough to get concept art and models from them.

<figure id="attachment_425" aria-describedby="caption-attachment-425" style="width: 687px" class="wp-caption aligncenter"><img class="wp-image-425 size-large" src="http://mikeadev.net/content/img/0-1024x558.jpg" alt="Characters Concept" /><figcaption id="caption-attachment-425" class="wp-caption-text">Concept art by Jenny Harder</figcaption></figure>

At some point the game looked this this:

<blockquote class="twitter-tweet" data-width="525" data-dnt="true">
  <p lang="en" dir="ltr">
    I’m still good fir <a href="https://twitter.com/hashtag/screenshotsaturday?src=hash&ref_src=twsrc%5Etfw">#screenshotsaturday</a> right? :) Here’s my little wizard! WIP. <a href="http://t.co/gYkS8lRXaD">pic.twitter.com/gYkS8lRXaD</a>
  </p>
  
  <p>
    &mdash; Michael Adaixo (@MichaelAdaixo) <a href="https://twitter.com/MichaelAdaixo/status/642851771308752896?ref_src=twsrc%5Etfw">September 13, 2015</a>
  </p>
</blockquote>



And then came the environments:

<blockquote class="twitter-tweet" data-width="525" data-dnt="true">
  <p lang="en" dir="ltr">
    The environments are getting soooo cute :D <a href="https://twitter.com/hashtag/gamedev?src=hash&ref_src=twsrc%5Etfw">#gamedev</a> <a href="https://twitter.com/hashtag/indiedev?src=hash&ref_src=twsrc%5Etfw">#indiedev</a> <a href="https://twitter.com/hashtag/madewithunity?src=hash&ref_src=twsrc%5Etfw">#madewithunity</a> <a href="https://twitter.com/hashtag/lowpoly?src=hash&ref_src=twsrc%5Etfw">#lowpoly</a> almost there. :) <a href="https://t.co/NYnvTEvBuj">pic.twitter.com/NYnvTEvBuj</a>
  </p>
  
  <p>
    &mdash; Michael Adaixo (@MichaelAdaixo) <a href="https://twitter.com/MichaelAdaixo/status/671434020824227840?ref_src=twsrc%5Etfw">November 30, 2015</a>
  </p>
</blockquote>



Couple of months later I was working on two player mode, while waiting for characters and animation ( by Guilherme Martins ), to be finished to be integrated in the game.

<blockquote class="twitter-tweet" data-width="525" data-dnt="true">
  <p lang="en" dir="ltr">
    This dude looks happy! Working on landscape mode and two player mode! <a href="https://twitter.com/hashtag/gamedev?src=hash&ref_src=twsrc%5Etfw">#gamedev</a> <a href="https://t.co/2pnmlbjkB9">pic.twitter.com/2pnmlbjkB9</a>
  </p>
  
  <p>
    &mdash; Michael Adaixo (@MichaelAdaixo) <a href="https://twitter.com/MichaelAdaixo/status/710602259978199040?ref_src=twsrc%5Etfw">March 17, 2016</a>
  </p>
</blockquote>



While waiting for assets from the team, I had made UI, a Replay System to save people's games and replay them as ghosts ( never made it ), local two player mode ( was removed because people didn't play it ), changed leaderboard system to be cross-platform and integrated with facebook, changed gameplay input based on player feedback ( twice ), and of course the api to handle all that stuff online. The UI took several iterations, I really think that at each step it got better, but at some point I had to close on a final version.

<blockquote class="twitter-tweet" data-width="525" data-dnt="true">
  <p lang="en" dir="ltr">
    Last UI Redesign I hope... Made this 3 times already.. a <a href="https://twitter.com/hashtag/gamedev?src=hash&ref_src=twsrc%5Etfw">#gamedev</a> suffers.. :P How's my 'Programmer' art for ya? :P <a href="https://t.co/N45tvEaDOw">pic.twitter.com/N45tvEaDOw</a>
  </p>
  
  <p>
    &mdash; Michael Adaixo (@MichaelAdaixo) <a href="https://twitter.com/MichaelAdaixo/status/732704841592672256?ref_src=twsrc%5Etfw">May 17, 2016</a>
  </p>
</blockquote>



<blockquote class="twitter-tweet" data-width="525" data-dnt="true">
  <p lang="en" dir="ltr">
    <a href="https://twitter.com/hashtag/screenshotsaturday?src=hash&ref_src=twsrc%5Etfw">#screenshotsaturday</a> <a href="https://twitter.com/hashtag/jumpyrope?src=hash&ref_src=twsrc%5Etfw">#jumpyrope</a> <a href="https://twitter.com/hashtag/gamedev?src=hash&ref_src=twsrc%5Etfw">#gamedev</a> <a href="https://twitter.com/hashtag/lowpoly?src=hash&ref_src=twsrc%5Etfw">#lowpoly</a> Still working on this!! I'm almost there... I promisse! :) <a href="https://t.co/Owtcnb2v9x">pic.twitter.com/Owtcnb2v9x</a>
  </p>
  
  <p>
    &mdash; Michael Adaixo (@MichaelAdaixo) <a href="https://twitter.com/MichaelAdaixo/status/723957094555222016?ref_src=twsrc%5Etfw">April 23, 2016</a>
  </p>
</blockquote>



<blockquote class="twitter-tweet" data-width="525" data-dnt="true">
  <p lang="en" dir="ltr">
    Once upon a time... a bunch-of-ropes! <a href="https://twitter.com/hashtag/gamedev?src=hash&ref_src=twsrc%5Etfw">#gamedev</a> <a href="https://twitter.com/hashtag/indiedev?src=hash&ref_src=twsrc%5Etfw">#indiedev</a> <a href="https://twitter.com/hashtag/ropes?src=hash&ref_src=twsrc%5Etfw">#ropes</a> <a href="https://twitter.com/hashtag/jumpyrope?src=hash&ref_src=twsrc%5Etfw">#jumpyrope</a> <a href="https://t.co/oamNxGJEGj">pic.twitter.com/oamNxGJEGj</a>
  </p>
  
  <p>
    &mdash; Michael Adaixo (@MichaelAdaixo) <a href="https://twitter.com/MichaelAdaixo/status/735464905663467520?ref_src=twsrc%5Etfw">May 25, 2016</a>
  </p>
</blockquote>



In the later stages of development, [Pedro Costa](https://twitter.com/Dainomyte) came in to make the game stand out with audio, sound effects and music. Now the game is freely available on the [AppStore](http://bit.ly/sky_jrope_), and on [GooglePlay](http://bit.ly/sk_jrope_).

Here's the trailer for the final version:  
<span class="embed-youtube" style="text-align:center; display: block;"></span>

In conclusion.  
The bad: No planning whatsoever. I didn't think ahead and plan the game through. I also probably should have got in contact with the community sooner, to ask for help or get feedback for the game. The lack of planning, made is easy to make 'just one more feature', that in the end, either didn't make it to the final build or took way too much effort for what its worth.

The good: You always learn something, some new technology, new and better code practices, and most importantly, you ship a game! Jumpy Rope made me value planning, and careful consideration of features, what to kill and what to invest in. Get feedback early, get it out to the community as soon as possible. 

That's it for now.  
Cheers.