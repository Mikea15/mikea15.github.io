---
id: 172
title: Measure Method Time Performance
date: 2014-03-05T11:18:18+00:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=172
permalink: /2014/03/measure-method-time-performance/
dsq_thread_id:
  - "2363762458"
mixpanel_event_label:
  - ""
categories:
  - Snippet
tags:
  - csharp
  - development
  - dotnet
  - performance
  - programming
  - snippet
---
Quick snippet to let you check the time used by any method you have.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">public static void CalculateTime( Action method )
{
    Stopwatch chrono = new Stopwatch();
    chrono.Start();

    method.Invoke();
            
    chrono.Stop();
    Console.WriteLine("Method : " + method.Method.Name + ", Time: " + chrono.ElapsedMilliseconds + " (ms)");
}</pre>

This will write to the console the time spent on the method.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">DiagnosticStaticClass.CalculateTime( MyExpensiveMethod );</pre>

Just remember to use _System.Diagnostics_.  
More info on <a title="MSDN Stopwatch" href="http://msdn.microsoft.com/en-us/library/system.diagnostics.stopwatch(v=vs.110).aspx" target="_blank" rel="noopener noreferrer">Stopwatch</a>.

That&#8217;s it. Enjoy.