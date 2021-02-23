---
id: 60
title: Generic Method
date: 2013-06-21T12:15:13+01:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=60
permalink: /2013/06/generic-method/
mixpanel_event_label:
  - ""
categories:
  - Snippet
  - Tutorials
tags:
  - csharp
  - dotnet
  - generics
  - programming
  - snippet
---
I&#8217;ve come up with a pretty neat solution to this:  
If you don&#8217;t want to write the same method for different data types, you can use generics.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">///
/// Math Class that helps
/// 
public static class MathHelper
{
    ///
    /// Clamps value within desired range
    /// 
    ///Value to be clamped
    ///Min range
    ///Max range
    /// Clamped value within range
    public static int Clamp(int value, int min, int max)
    {
        if (value > max)
            return max;
        if (value &lt; min)
            return min;
        return value;
    }

    ///
    /// Clamps value within desired range
    /// 
    ///Value to be clamped
    ///Min range
    ///Max range
    /// Clamped value within range
    public static float Clamp(float value, float min, float max)
    {
        if (value > max)
            return max;
        if (value &lt; min)
            return min;
        return value;
    }

    ///
    /// Clamps value within desired range
    /// 
    ///Value to be clamped
    ///Min range
    ///Max range
    /// Clamped value within range
    public static double Clamp(double value, double min, double max)
    {
        if (value > max)
            return max;
        if (value &lt; min)
            return min;
        return value;
    }
}</pre>

It&#8217;s pretty easy once you know what to look for :) Just search Generics c# and you&#8217;ll find a bunch of questions and answers on StackOverflow, msdn and CodeProject :)  
Here&#8217;s the solution:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">///
/// Math Class that helps
/// 
public static class MathHelper
{
    ///
    /// Clamps value within desired range
    /// This is a generic. So use any type you want
    /// 
    ///Value to be clamped
    ///Min range
    ///Max range
    /// Clamped value within range
    public static T Clamp(T value, T min, T max) 
        where T : IComparable
    {
        T result = value;
        if (result.CompareTo(max) > 0)
            result = max;
        if (result.CompareTo(min) &lt; 0)
            result = min;

        return result;
    }
}</pre>

Pretty Cool eh!? :)

Now instead of having multiple methods to make the same operation, you have one that works for many types.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">int val = MathHelper.Clamp(-1, 0, 2);              // for ints
float val = MathHelper.Clamp(-1.0f, 0.0f, 2.0f);   // for floats
double val = MathHelper.Clamp(-1.0d, 0.0d, 2.0d);  // for doubles</pre>