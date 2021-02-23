---
id: 383
title: Data Serialization on iOS with Unity and AOT Problems
date: 2015-09-13T01:15:50+01:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=383
permalink: /2015/09/data-serialization-on-ios-with-unity-and-aot-problems/
mixpanel_event_label:
  - ""
dsq_thread_id:
  - "4124088219"
categories:
  - Snippet
tags:
  - iOS
  - snippet
  - unity3d
---
 

**Super quick tip!**  
I&#8217;ve come up with a problem when making a generic data serialization method in which I write my data to a binary file, which is an error that only occurs on iOS because it can&#8217;t run JIT ( Just-in-time ) compilation and/or AOT ( Ahead-of-time ) compilation because it doesn&#8217;t allow runtime code generation. 

There are some answers on Unity Ansers, but [this forum post](http://forum.unity3d.com/threads/persistent-data-storage-unity-serialization-error-on-ios.277989/) had the same problem as I was, and there is a fix that did it for me, that&#8217;s on [Unity Answers here](http://answers.unity3d.com/questions/30930/why-did-my-binaryserialzer-stop-working.html) with a pretty good explanation. 

So, yup, my solution was to add that same piece of code on the file where I am invoking the code. 

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">void Awake( )
    {
    #if UNITY_IOS
        // Forces a different code path in the BinaryFormatter that doesn't rely on run-time code generation (which would break on iOS).
        Environment.SetEnvironmentVariable("MONO_REFLECTION_SERIALIZER", "yes");
    #endif
        // ...
        LoadData();
    }</pre>

So just in case, I&#8217;ll leave this here for future reference. ;)