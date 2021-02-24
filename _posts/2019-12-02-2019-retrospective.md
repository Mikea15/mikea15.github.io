---
id: 796
title: 2019 Retrospective
date: 2019-12-02T12:29:27+00:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=796
permalink: /2019/12/2019-retrospective/
categories:
  - General
---
 

With 2019 comming to a close I though it&#8217;d be nice to have a look back and see what I&#8217;ve been up to.

<figure class="wp-block-image size-large">
<img src="http://mikeadev.net/wp-content/uploads/image-6.png" alt="" /></figure> 

The hot topic for this year was clearly **Ray Tracing**, which has been a goal of mine for quite some time. I&#8217;ve spent some time reading [Ray Tracing in One Weekend, The Next Weekend, and The Rest of Your Life](https://raytracing.github.io/) which are great resources and entry points to the subject. I created a few projects on the subject with an SDL2 base game where I added multi threading support and calculating ambient occlusion.

I&#8217;ve started to use [vcpkg ( C++ Library Manager for Windows, Linux, and MacOS )](https://github.com/microsoft/vcpkg) which is a neat little tool that allows me to easily grab libraries and keep them updated. No more issues with making SDL apps, importing Assimp, etc.

I started to familiarise myself with CMake. It&#8217;s still a hassle to get things working correctly on my first try, but I now have a couple of projects that I can look up to. 

I forked my OpenGL sanbox and created a creativelly named [Engine Sandbox](https://github.com/Mikea15/EngineSandbox) project with **CMake**, used **vcpkg** for SDL, Assimp, nlohmann, etc.. I&#8217;ve been mostly fixing it, and working on neat new things, like **Hot Reloading Shaders**, investigating on how to **Hot Reload Cpp** code ( will need a bit of re-structuring ). I&#8217;ll probably make a new one next year, with a bit of planning to organize it better, but for now, It will do.

**Vulkan**: I started to readup on that, but after a few tutorials, and not getting anything on screen I eventually ventured of to other topics. Maybe someday i&#8217;ll come back to that. **SIMD**: I&#8217;ve read a few tutorials and articles on the subject. Data Oriented Design is another topics I&#8217;m looking into.  
**C++ Concurrency** In Action 2nd edition: I&#8217;ve been reading this book, which has been on my whishlist for some time, and that naturally spun up a few projects.

I have many topics for next year, namelly, GPU RayTracing, Bounding Volume Hierarchies and other acceleration structures, Data oriented design, AI Design and Control, more MultiThreading, and I&#8217;m sure that list will keep on growing.