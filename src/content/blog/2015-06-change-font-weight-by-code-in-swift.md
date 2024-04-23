---
title: Change font weight by code in swift
pubDate: 2015-06-04T12:30:41+01:00
heroImage: '/blog-placeholder-2.jpg'
published: true
categories:
  - snippet
tags:
  - iOS
  - swift
---



This snippet changes the current font of a label to a Light version of it ( in case it exists ). Font names are ( in this case, it was '.HelveticaNeue-Regular' ) appended with their weight. So I get the font name, split it by '-', and take the first part of the split, ending with '.HelveticaNeue'. Now I just create a new font with the light appended to it, with the same size.

```switf
let currentFont = label.font
let fontName = currentFont.fontName.componentsSeparatedByString("-").first
let newFont = UIFont(name: "\(fontName!)-Light", size: currentFont.pointSize)
label.font = newFont
```

Lastly, I switch the font, and there you go.