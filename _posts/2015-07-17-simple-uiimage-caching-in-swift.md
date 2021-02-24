---
id: 332
title: Simple UIImage Caching in Swift
date: 2015-07-17T09:32:05+01:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=332
permalink: /2015/07/simple-uiimage-caching-in-swift/
dsq_thread_id:
  - "3942633425"
mixpanel_event_label:
  - ""
categories:
  - Snippet
tags:
  - development
  - iOS
  - Swift
---
This is a snippet of code that will cache images downloaded from an online source, and provide them when needed. I still have some work to do on it, but right now it works pretty fine.

<pre class="EnlighterJSRAW" data-enlighter-language="c" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">//
//  ImageCache.swift
//
//  Created by Michael Adaixo on 16/07/15.
//

import UIKit

// TODO:
// - Implement LRU Algorithm ( Least-Recently-Used ) to clear unused images from memory
// - Try to make some sort of PriorityQueue out of this..
// - Be awesome. ( Check )

class ImageCache {
    static let sharedInstance = ImageCache()
    
    private var _cache: [String : UIImage]!
    
    init()  {
        _cache = [String : UIImage]()
    }
    
    func find( imageUrl: String ) -&gt; UIImage? {
        if isCached( imageUrl ) {
            let key = stringToBase64( imageUrl )
            return _cache[key!]
        }
        return nil
    }
    
    func cacheImage( imageUrl: String ) {
        if !isCached(imageUrl) {
            UIImage().loadAsyncFromUrl(imageUrl, complete: { (resultingImage) -&gt; Void in
                if let image = resultingImage {
                    self.addNewImage(imageUrl, image: image)
                }
            })
        }
    }
    
    func findOrLoadAsync( imageUrl: String, completionHandler: ( image: UIImage! ) -&gt; Void ) {
        if let image = find( imageUrl ) {
            completionHandler( image: image )
        }
        else
        {
            UIImage().loadAsyncFromUrl(imageUrl, complete: { (resultingImage) -&gt; Void in
                if let image = resultingImage {
                    self.addNewImage(imageUrl, image: image)
                    completionHandler( image: image )
                }
            })
        }
    }
    
    private func addNewImage( imageUrl: String, image: UIImage ) {
        if !isCached( imageUrl ) {
            let key = stringToBase64( imageUrl )
            _cache[key!] = image
        }
    }
    
    private func isCached( imageUrl: String ) -&gt; Bool {
        if let key = stringToBase64( imageUrl ) {
            if _cache[key] != nil {
                return true
            }
        }
        return false
    }
    
    private func stringToBase64( string: String ) -&gt; String? {
        let imageData = string.dataUsingEncoding(NSUTF8StringEncoding, allowLossyConversion: false)
        return imageData?.base64EncodedStringWithOptions(NSDataBase64EncodingOptions.allZeros)
    }
}</pre>

I'm using a dictionary to keep track of the images, with their Base64 encoded urls as keys.

Example usage goes like:

<pre class="EnlighterJSRAW" data-enlighter-language="c" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">ImageCache.sharedInstance.findOrLoadAsync(imageUrl, completionHandler: { (image) -> Void in
// do something with image (UIImage)
})</pre>

PS: Also, that UIImage().loadAsync is an UIImage Extension method I have lying around :)

<pre class="EnlighterJSRAW" data-enlighter-language="c" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">// Will asynchronously download an image from the path(url)
// that you provide, and return you the UIImage on the main queue
func loadAsyncFromUrl( path: String, complete: (resultingImage: UIImage?) -> Void ) {
    // example fetch photo
   
    UIApplication.sharedApplication().networkActivityIndicatorVisible = true

    let url = NSURL(string: path)
    var request: NSURLRequest = NSURLRequest(URL: url!)

    NSURLConnection.sendAsynchronousRequest(request,
        queue: NSOperationQueue.mainQueue(),
        completionHandler: { (response: NSURLResponse!, data: NSData!, error: NSError!) -> Void in
            UIApplication.sharedApplication().networkActivityIndicatorVisible = false
            if error != nil {
                println("[UIImage.loadAsyncFromURL] Error: \(error)")
            }
            else
            {
                var image = UIImage(data: data)
                complete(resultingImage: image)
            }
    })
}</pre>