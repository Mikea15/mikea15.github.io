---
id: 320
title: Change font weight by code in Swift
date: 2015-06-04T12:30:41+01:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=320
permalink: /2015/06/change-font-weight-by-code-in-swift/
dsq_thread_id:
  - "3820225869"
mixpanel_event_label:
  - ""
categories:
  - Snippet
tags:
  - iOS
  - Swift
---
<pre class="EnlighterJSRAW" data-enlighter-language="c" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">let currentFont = label.font
let fontName = currentFont.fontName.componentsSeparatedByString("-").first
let newFont = UIFont(name: "\(fontName!)-Light", size: currentFont.pointSize)
label.font = newFont</pre>

This snippet changes the current font of a label to a Light version of it ( in case it exists ). Font names are ( in this case, it was &#8216;.HelveticaNeue-Regular' ) appended with their weight. So I get the font name, split it by &#8216;-&#8216;, and take the first part of the split, ending with &#8216;.HelveticaNeue'. Now I just create a new font with the light appended to it, with the same size.

Lastly, I switch the font, and there you go.