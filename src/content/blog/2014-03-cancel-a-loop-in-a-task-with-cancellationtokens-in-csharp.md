---
title: Cancel a Loop in a Task with CancellationTokens in C#
pubDate: 2014-03-01T11:40:47+00:00
heroImage: '/blog-placeholder-2.jpg'
published: true
categories:
  - snippet
tags:
  - codeproject
  - csharp
  - dotnet
  - parallel
  - programming
  - snippet
  - tpl
---
This post explains the use of Cancellation Token in C# using Tasks, which are available since .Net Framework 4.

Say you've created a asynchronous Task. The method you're running inside your task contains a loop ( infinite or not ), and you want to break out of it peacefully. You would need to create a **CancellationTokenSource** and pass a&nbsp;**Cancellation Token** to the **Task** so it can be accessed in the main loop.

<!--more-->

A [CancellationTokenSource](http://msdn.microsoft.com/en-us/library/system.threading.cancellationtokensource(v=vs.110).aspx) provides a way of signaling its Cancellation Token that it has been cancelled. A [CancellationToken](http://msdn.microsoft.com/en-us/library/system.threading.cancellationtoken(v=vs.110).aspx) notifies the operation that it should be cancelled.

I am creating a new Task using the Factory property of the Task class. I could have created it in a different way, [check here for Task Constructors](http://msdn.microsoft.com/en-us/library/system.threading.tasks.task.task(v=vs.110).aspx). I am also using the parameters [TaskCreationOption.LongRunningTask](http://msdn.microsoft.com/en-us/library/system.threading.tasks.taskcreationoptions(v=vs.110).aspx) and [TaskScheduler.Default](http://msdn.microsoft.com/en-us/library/system.threading.tasks.taskscheduler(v=vs.110).aspx).

**TaskCreationOption.LongRunningTask**

<blockquote class="wp-block-quote">
  <p>
    Specifies that a task will be a long-running, coarse-grained operation involving fewer, larger components than fine-grained systems. It provides a hint to the TaskScheduler that oversubscription may be warranted. Oversubscription lets you create more threads than the available number of hardware threads.
  </p>
</blockquote>

**TaskScheduler.Default**

<blockquote class="wp-block-quote">
  <p>
    Gets the default TaskScheduler instance that is provided by the .NET Framework.
  </p>
</blockquote>

Here is a simple example on how to achieve this. You can run this code on [LinqPad](https://www.linqpad.net/) or create a new console project. Just remember to include the _System.Threading.Tasks_ namespace.

```cpp
void Main()
{
	CancellationTokenSource cts = new CancellationTokenSource();
	var token = cts.Token;
	
	Task t = Task.Factory.StartNew( 
		() => {
		MainLoop(token);
		}, 
		token, 
		TaskCreationOptions.LongRunning, 
		TaskScheduler.Default
	);
	
	
	Console.ReadLine();
	
	cts.Cancel();
	
	try 
	{
		t.Wait();
	}
	catch( AggregateException ae )
	{
		// catch inner exception 
	}
	catch( Exception crap )
	{
		// catch something else
	}
}

void MainLoop( CancellationToken token )
{
	while( true )
	{
		// Poll on this property if you have to do 
		// other cleanup before throwing. 
		if (token.IsCancellationRequested)
		{
			// Clean up here, then...
			"cleanup".Dump();
			token.ThrowIfCancellationRequested();
		}

                // do something here.
		Console.Write(".");
		Thread.Sleep(100);
	}
}
```

After creating the Task, it will start automatically. All you have to do is to wait for the result, int this case there won't be any variable returned, but you have to do this so you can recover if you get an _AggretatedException_.

To cancel the Task, just call the method _Cancel_ from the **CancellationTokenSource**. Inside your method, the **IsCancellationRequested** property from the token will be true, giving you time to do some cleanup before throwing the cancellation request. You can put the if condition wherever you please. I prefer to put it on top of the loop, so no other procedures start before cancelling.

That's pretty much it.

Get More info about : [C# Tasks](http://msdn.microsoft.com/en-us/library/system.threading.tasks.task(v=vs.110).aspx) and the [Task Parallelism Library](http://msdn.microsoft.com/en-us/library/dd537609(v=vs.110).aspx).

I hope you enjoyed this little explanation. Tasks are way much more than this little code snippet, so If you're interested, check back once in a while, I'll put up more snippets.