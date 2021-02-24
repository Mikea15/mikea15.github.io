---
id: 714
title: Exploring Multi-Threading in C++ Cont
date: 2019-10-22T00:24:29+01:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=714
permalink: /2019/10/exploring-multi-threading-in-c-part-2/
spay_email:
  - ""
categories:
  - General
tags:
  - CodeProject
  - concurrency
  - cpp
  - multithreading
  - parallel
  - programming
  - threading
---
## Index

  * [Part 1: Exploring Multi-Threading in C++](http://mikeadev.net/2019/10/exploring-multi-threading-in-c/)
  * **[Part 2: Exploring Multi-Threading in C++ Cont.](http://mikeadev.net/2019/10/exploring-multi-threading-in-c-part-2/)**
  * [Part 3: Exploring Multi-Threading in C++: Loading Textures](http://mikeadev.net/2019/11/exploring-multi-threading-in-c-loading-textures/)
  * [Part 4: Exploring Multi-Threading in C++: Parallelizing Ray Tracing](http://mikeadev.net/2019/11/parallelizing-ray-tracing/) 

## Specific Worker Threads for Specific Jobs 

My next test case is to have different worker thread to run different kinds of tasks. The idea is to have a couple of threads for important jobs, others for less important jobs. I've split the tasks into different Job queues for simplicity. 

<pre class="EnlighterJSRAW" data-enlighter-language="cpp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">static std::mutex g_mutexLowJobQ;
static std::mutex g_mutexMediumJobQ;
static std::mutex g_mutexHighJobQ;

std::queue&lt;CalcPiJob*> GetJobsOfType(int count, int iterations)
{
	std::queue&lt;CalcPiJob*> jobQ;
	for (int i = 0; i &lt; count; ++i)
	{
		jobQ.emplace(new CalcPiJob(iterations));
	}
	return jobQ;
}

void RunThreadedPriority()
{
	int nHighThreads = 3;
	int nMediumThreads = 2;
	int nLowThreads = 2;
	
	std::queue&lt;CalcPiJob*> lowJobQ = GetJobsOfType(Settings::JobCountLow, Settings::IterationCountLow);
	std::queue&lt;CalcPiJob*> mediumJobQ = GetJobsOfType(Settings::JobCountMedium, Settings::IterationCountMedium);
	std::queue&lt;CalcPiJob*> highJobQ = GetJobsOfType(Settings::JobCountHigh, Settings::IterationCountHigh);

	std::vector&lt;std::thread> threads;

	std::atomic&lt;bool> hasHighJobsLeft = true;
	for (int i = 0; i &lt; nHighThreads; ++i)
	{
		std::thread t([&]() {
			ExecuteJobsQ(hasHighJobsLeft, highJobQ, g_mutexHighJobQ);
		});
		threads.push_back(std::move(t));
	}

	std::atomic&lt;bool> hasMediumJobsLeft = true;
	for (int i = 0; i &lt; nMediumThreads; ++i)
	{
		std::thread t([&]() {
			ExecuteJobsQ(hasMediumJobsLeft, mediumJobQ, g_mutexMediumJobQ);
		});
		threads.push_back(std::move(t));
	}

	std::atomic&lt;bool> hasLowJobsLeft = true;
	for (int i = 0; i &lt; nLowThreads; ++i)
	{
		std::thread t([&]() {
			ExecuteJobsQ(hasLowJobsLeft, lowJobQ, g_mutexLowJobQ);
		});
		threads.push_back(std::move(t));
	}

	// main thread
	while (hasHighJobsLeft || hasMediumJobsLeft || hasLowJobsLeft)
	{
		if (hasHighJobsLeft) 
		{
			ExecuteJobsQ(hasHighJobsLeft, highJobQ, g_mutexHighJobQ);
		}
		else
		{
			// wait for other threads to complete.
			std::this_thread::sleep_for(std::chrono::milliseconds(10));
		}
	}

	const int threadCount = threads.size();
	for (int i = 0; i &lt; threadCount; ++i)
	{
		threads[i].join();
	}
}</pre>

Run time with 8 threads: 6059 ms. ( 4 High Job threads, 2 medium and 2 low threads. )<figure class="wp-block-image size-large">

[<img src="http://mikeadev.net/wp-content/uploads/threads_p.jpg" alt="" />](http://mikeadev.net/wp-content/uploads/threads_p.jpg)<figcaption>( click to expand )</figcaption></figure> 

The profile image show the 4 threads handling only big jobs, 2 threads handling medium jobs and the other 2 threads handling smaller jobs. As we can see, this won't win us much time, since when some thread finish their work, they stand idle, not contributing to the bigger picture.

We can try to fix that by implementing some kind of work stealing. When a thread has no more jobs meant for them, they can steal jobs from other thread queues.

## Specific Threads with Work Stealing 

This next test is just that. Each thread type was setup to grab a job of less priority from their main one, once they run out of jobs. Hopefully we will prevent threads from going idle.

<pre class="EnlighterJSRAW" data-enlighter-language="cpp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">void RunThreadedPriorityWorkStealing()
{
	int nHighThreads = 5;
	int nMediumThreads = 1;
	int nLowThreads = 1;

	std::queue&lt;CalcPiJob*> lowJobQ = GetJobsOfType(Settings::JobCountLow, Settings::IterationCountLow);
	std::queue&lt;CalcPiJob*> mediumJobQ = GetJobsOfType(Settings::JobCountMedium, Settings::IterationCountMedium);
	std::queue&lt;CalcPiJob*> highJobQ = GetJobsOfType(Settings::JobCountHigh, Settings::IterationCountHigh);

	std::vector&lt;std::thread> threads;

	std::atomic&lt;bool> isHighPriorityThreadsActive = true;
	for (int i = 0; i &lt; nHighThreads; ++i)
	{
		std::thread t([&]() {
			
			while (isHighPriorityThreadsActive)
			{
				CalcPiJob* currentJob = GetAndPopJob(highJobQ, g_mutexHighJobQ);

				// if no more High Jobs, take on Medium ones.
				if (!currentJob)
				{
					currentJob = GetAndPopJob(mediumJobQ, g_mutexMediumJobQ);
				}

				// if no more Medium Jobs, take on Small ones.
				if (!currentJob)
				{
					currentJob = GetAndPopJob(lowJobQ, g_mutexLowJobQ);
				}

				if (currentJob)
				{
					currentJob->DoWork();
					delete currentJob;
				}
				else
				{
					isHighPriorityThreadsActive = false;
				}
			}
		});
		threads.push_back(std::move(t));
	}

	std::atomic&lt;bool> isMediumThreadsActive = true;
	for (int i = 0; i &lt; nMediumThreads; ++i)
	{
		std::thread t([&]() {
			while (isMediumThreadsActive)
			{
				CalcPiJob* currentJob = GetAndPopJob(mediumJobQ, g_mutexMediumJobQ);

				// if no more Medium Jobs, take on Small ones.
				if (!currentJob)
				{
					currentJob = GetAndPopJob(lowJobQ, g_mutexLowJobQ);
				}

				if (currentJob)
				{
					currentJob->DoWork();
					delete currentJob;
				}
				else
				{
					isMediumThreadsActive = false;
				}
			}
		});
		threads.push_back(std::move(t));
	}

	std::atomic&lt;bool> isLowThreadsActive = true;
	for (int i = 0; i &lt; nLowThreads; ++i)
	{
		std::thread t([&]() {
			while (isLowThreadsActive)
			{
				CalcPiJob* currentJob = GetAndPopJob(lowJobQ, g_mutexLowJobQ);

				if (currentJob)
				{
					currentJob->DoWork();
					delete currentJob;
				}
				else
				{
					isLowThreadsActive = false;
				}
			}
			});
		threads.push_back(std::move(t));
	}

	// main thread
	while (isLowThreadsActive || isMediumThreadsActive || isHighPriorityThreadsActive)
	{
		if (isHighPriorityThreadsActive)
		{
			CalcPiJob* currentJob = GetAndPopJob(highJobQ, g_mutexHighJobQ);

			// if no more High Jobs, take on Medium ones.
			if (!currentJob)
			{
				currentJob = GetAndPopJob(mediumJobQ, g_mutexMediumJobQ);
			}

			// if no more Medium Jobs, take on Small ones.
			if (!currentJob)
			{
				currentJob = GetAndPopJob(lowJobQ, g_mutexLowJobQ);
			}

			if (currentJob)
			{
				currentJob->DoWork();
				delete currentJob;
			}
			else
			{
				isHighPriorityThreadsActive = false;
			}
		}
		else
		{
			// wait for other threads to complete.
			std::this_thread::sleep_for(std::chrono::milliseconds(10));
		}
	}

	const int threadCount = threads.size();
	for (int i = 0; i &lt; threadCount; ++i)
	{
		threads[i].join();
	}
}</pre>

Run time with 8 threads: 2625 ms.<figure class="wp-block-image size-large">

[<img src="http://mikeadev.net/wp-content/uploads/threads_ws-1-1024x136.jpg" alt="" />](http://mikeadev.net/wp-content/uploads/threads_ws-1.jpg)<figcaption> (click to expand) </figcaption></figure> 

Now we can see that the high priority worker threads started to take on medium sized jobs as soon as the higher ones depleted, and then the small jobs followed. 

## Synchronizing Threads

Now lets say I'm processing data and I need to start Jobs in sync in between multiple threads, or maybe I'm building a game engine and my main update loop needs to start at the same time as the physics loop in some other thread. Whichever the case, I tough looking up synchronization mechanisms was worth doing as well. 

<pre class="EnlighterJSRAW" data-enlighter-language="cpp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">std::mutex g_syncMutex;
std::condition_variable g_conditionVariable;

void RunSynchronizedThreads()
{
	int nThreads = std::thread::hardware_concurrency() - 1;
	std::vector&lt;std::thread> threads;

	std::queue&lt;CalcPiJob*> jobQ = GetJobsQ();

	std::atomic&lt;bool> signal = false;
	std::atomic&lt;bool> threadsActive = true;
	for (int i = 0; i &lt; nThreads; ++i)
	{
		std::thread t([&]() {
			while (threadsActive)
			{
				// Tell main thread, worker is available for work
				{
					std::unique_lock&lt;std::mutex> lk(g_syncMutex);
					g_conditionVariable.wait(lk, [&] { return signal == true; });
				}

				CalcPiJob* currentJob = GetAndPopJob(jobQ, g_mutexJobQ);

				if (currentJob)
				{
					currentJob->DoWork();
					delete currentJob;
				}
				else
				{
					threadsActive = false;
				}
			}
		});
		threads.push_back(std::move(t));
	}

	// main thread
	std::atomic&lt;bool> mainThreadActive = true;
	while (mainThreadActive && threadsActive)
	{
		// send signal to worker threads, they can start work.
		{
			std::lock_guard&lt;std::mutex> lk(g_syncMutex);
			signal = true;
		}
		g_conditionVariable.notify_all();

		// send signal to worker threads, so they have to wait for their next update.
		std::this_thread::sleep_for(std::chrono::milliseconds(1));
		{
			std::lock_guard&lt;std::mutex> lk(g_syncMutex);
			signal = false;
		}
		g_conditionVariable.notify_all();

		// main thread work.
		CalcPiJob* currentJob = GetAndPopJob(jobQ, g_mutexJobQ);

		if (currentJob)
		{
			currentJob->DoWork();
			delete currentJob;
		}
		else
		{
			mainThreadActive = false;
		}
	}

	for (int i = 0; i &lt; nThreads; ++i)
	{
		threads[i].join();
	}
}</pre>

Run time: 2674 ms<figure class="wp-block-image size-large">

[<img src="http://mikeadev.net/wp-content/uploads/threads_sync.jpg" alt="" />](http://mikeadev.net/wp-content/uploads/threads_sync.jpg)<figcaption>(click to expand)</figcaption></figure> 

I've setup this one up so worker thread only start at the same frequency of the main thread. The goal here was to use condition variables to synchronize the threads, and hopefully confirm it with the profiler., which we can look at in the image above.<figure class="wp-block-table">

<table class="">
  <tr>
    <td>
      <strong>Test Run</strong>
    </td>
    
    <td>
      <strong>Time</strong> (ms)
    </td>
    
    <td>
      <strong>Improvement</strong>
    </td>
  </tr>
  
  <tr>
    <td>
      One Thread
    </td>
    
    <td>
      10396
    </td>
    
    <td>
      1.99x
    </td>
  </tr>
  
  <tr>
    <td>
      Threaded
    </td>
    
    <td>
      2625
    </td>
    
    <td>
      7.88x
    </td>
  </tr>
  
  <tr>
    <td>
      Threaded with Priority
    </td>
    
    <td>
      6059
    </td>
    
    <td>
      3.4x
    </td>
  </tr>
  
  <tr>
    <td>
      Threaded with Work Stealing
    </td>
    
    <td>
      2625
    </td>
    
    <td>
      7.8x
    </td>
  </tr>
  
  <tr>
    <td>
      Synchronized Threads
    </td>
    
    <td>
      2674
    </td>
    
    <td>
      7.7x
    </td>
  </tr>
</table></figure> 

[Download code from GitHub](https://gist.github.com/Mikea15/aca94cfd4aacd1ee0e120ab03b99d1b7) 

## Continue Reading

  * [Part 1: Exploring Multi-Threading in C++](http://mikeadev.net/2019/10/exploring-multi-threading-in-c/)
  * **[Part 2: Exploring Multi-Threading in C++ Cont.](http://mikeadev.net/2019/10/exploring-multi-threading-in-c-part-2/)**
  * [Part 3: Exploring Multi-Threading in C++: Loading Textures](http://mikeadev.net/2019/11/exploring-multi-threading-in-c-loading-textures/)
  * [Part 4: Exploring Multi-Threading in C++: Parallelizing Ray Tracing](http://mikeadev.net/2019/11/parallelizing-ray-tracing/) 

<a href="https://www.codeproject.com/script/Articles/BlogArticleList.aspx?amid=7793424" rel="tag" style="display:none">CodeProject</a>