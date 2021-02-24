---
id: 156
title: 'Non Blocking C# Task Cancelling'
date: 2014-05-08T21:26:57+01:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=156
permalink: /2014/05/non-blocking-c-task-cancelling/
dsq_thread_id:
  - "2670799003"
mixpanel_event_label:
  - ""
categories:
  - Snippet
  - Tutorials
tags:
  - CodeProject
  - csharp
  - dotnet
  - parallel
  - snippet
  - tpl
---
In our previous sample snippet, [Cancel a Loop in a Task with CancellationTokens in c#](http://mikeadev.net/2014/03/cancel-a-loop-in-a-task-with-cancellationtokens-in-csharp/ "Cancel a Loop in a Task with CancellationTokens in C#")&nbsp;, I try to explain how we can get out of a looping c# task, but a problem may arise from that situation. If we were to wait for any result out of that Task, we would be blocking the calling thread until the task returned, which is not good if we are on the main thread. We would locking our UI and might crash our application.

So I've been testing different ways to&nbsp;get out of that loop without causing any trouble, and you can achieve what we want many different ways.

So, to begin with, I think I would correctly assume that it is only necessary to wait for a task to complete if that task will return something. If there is no return value, why would we want to call wait on it? We can just break out of it, correct me if I'm wrong. If we have a return value, then it is necessary to surround the **wait** call on the **task** with try/catch to receive its result. But then again, we can avoid the locking here with a **continuation task**, which will create and start the task after the first one completes, giving us the result from the previous task to work with.

<!--more-->

If by any chance we want to wait for any result, then we must use the wait method, locking the calling thread. This will lead to the same problem, blocking that thread and if this thread is the main thread that holds our UI, its bad for the user experience and might lead to crashing our application.

First solution, to correct this.  
Have a Task, create the Working Task, and Wait for it to finish. So you'll have two tasks in the end and you won't be locking the UI thread. But, say you have a UI Button to start these chaining tasks. You'll be creating as many tasks as you click that button. Unless you implement a way to only have one running at any time. You could do that, by sending a cancellation token, in which you kill the task before re-creating a new one. But this could loop back to our blocking problem.

Another way of doing this is going Async/Await on the methods.

For a method that don't return any value. We just have to change our code to break out of our loop when the cancellation is requested, instead of calling ThrowIfCancelledRequired(), we just check if the Cancellation is requested and just break out. As we're not waiting for any result, we just let the task finish.&nbsp;Using this idea, we could even remove the need of the cancellation token. We could use a volatile bool variable to control our cancellation for us. But I find it more &#8216;good practice' to use the cancellation token. I don't really know how the volatile access performs between multiple tasks, so I'm keeping the Cancellation Token. Here's a sample code:

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">CancellationTokenSource _cts;
volatile bool _run = true;

public void Start( )
{
    // do something
    _cts = new CancellationTokenSource();
    var token = _cts.Token;
 
    var t = Task.Factory.StartNew(() =&gt;
    {
        Console.WriteLine("Start");
        while (true)
        {
            if (token.IsCancellationRequested)
            {
                Console.WriteLine("Break");
                break;
            }
 			
	    Console.WriteLine("."); // just to show progress from task.
            Thread.Sleep(1000);
        }
    }, token);
}

public void Cancel( )
{
    Console.WriteLine("Cancel");
    //_run = false;
 
    // stop that.
    if( _cts != null )
        _cts.Cancel();
}

void Main( )
{
    Start( );
	Console.ReadLine();
	Cancel();
}
</pre>

This will output something like this after pressing Enter after 4 seconds:

<pre class="wp-block-preformatted lang:c# decode:true">Start
.
.
.
.
Cancel
Break</pre>

Note that __cts_ is a member variable of the class where **Start** is being called so it can be accessed in the **Cancel** method. Back to our first solution, if we were to declare a _volatile bool _run_ variable as commented on the **Cancel** method, we would have to, firstly, uncomment that line to change the value to _false_, and change the&nbsp;_true&nbsp;_on the Start's method while loop.

Remember that I only break out of the loop with break because the method does not return any value to the calling thread. Otherwise I would have to try/catch that value.

I hoped you enjoyed this and if you've learned something today, my work is done. Please leave a comment or suggestion. :)