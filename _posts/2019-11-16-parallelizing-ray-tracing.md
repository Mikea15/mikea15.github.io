---
id: 766
title: Parallelizing Ray Tracing
date: 2019-11-16T22:57:31+00:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=766
permalink: /2019/11/parallelizing-ray-tracing/
categories:
  - General
tags:
  - CodeProject
  - concurrency
  - cpp
  - load
  - multithreading
  - parallel
  - programming
  - texture
  - threading
---
 

## Index

  * [Part 1: Exploring Multi-Threading in C++](http://mikeadev.net/2019/10/exploring-multi-threading-in-c/)
  * [Part 2: Exploring Multi-Threading in C++ Cont.](http://mikeadev.net/2019/10/exploring-multi-threading-in-c-part-2/)
  * [Part 3: Exploring Multi-Threading in C++: Loading Textures](http://mikeadev.net/2019/11/exploring-multi-threading-in-c-loading-textures/)
  * [**Part 4: Exploring Multi-Threading in C++: Parallelizing Ray Tracing**](http://mikeadev.net/2019/11/parallelizing-ray-tracing/)

## Setup

I&#8217;m going to use Ray Tracing in one weekend as a basis for this article. I&#8217;ve implemented a [ray tracer](https://github.com/Mikea15/PathTracerSandbox) based on [these books by Peter Shirley](http://in1weekend.blogspot.com/2016/01/ray-tracing-in-one-weekend.html), but the [books have since been updated](https://raytracing.github.io/) and moved into a [new repository](https://github.com/RayTracing/raytracing.github.io). So this is a nice and clean entry point if you want to follow along.

## Single Threaded

You can fork my version of RayTracingOneWeekend, I&#8217;ve added a CMakeFile and edited the project so it writes the resulting image into a file. I made a [baseline branch](https://github.com/Mikea15/raytracing.github.io/tree/baseline/src/InOneWeekend) for the default result for creating a 1200&#215;800 image with 10 samples per pixel.

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="1024" height="683" src="http://mikeadev.net/wp-content/uploads/image-6-1024x683.png" alt="" class="wp-image-767" srcset="http://mikeadev.net/wp-content/uploads/image-6-1024x683.png 1024w, http://mikeadev.net/wp-content/uploads/image-6-300x200.png 300w, http://mikeadev.net/wp-content/uploads/image-6-768x512.png 768w, http://mikeadev.net/wp-content/uploads/image-6.png 1200w" sizes="(max-width: 767px) 89vw, (max-width: 1000px) 54vw, (max-width: 1071px) 543px, 580px" /><figcaption>Singlethreaded, 1200&#215;800, 10spp, 88 seconds.</figcaption></figure>
</div>

On my CPU this takes around 88 seconds, and overall uses only 13Mb of memory during runtime.

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="607" height="279" src="http://mikeadev.net/wp-content/uploads/image-7.png" alt="" class="wp-image-768" srcset="http://mikeadev.net/wp-content/uploads/image-7.png 607w, http://mikeadev.net/wp-content/uploads/image-7-300x138.png 300w" sizes="(max-width: 607px) 100vw, 607px" /></figure>
</div>

## Naive Jobification

In order to have an idea of different approaches to make this run faster, I decided to start by using std::async, and create one job per pixel. I assumed from the beginning that this would bring &#8220;some&#8221; speed gains, but some caveats.

Once again, I&#8217;ve made a new branch for the Jobs version of the Ray Tracer, feel free to download that and experiment with it. The main changes include creating a std::async job for each pixel, saving the std::future<ResultJob> in a vector, and using a std::condition_variable to wait until all jobs are complete.

<pre class="EnlighterJSRAW" data-enlighter-language="cpp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">std::mutex mutex;
std::condition_variable cvResults;
std::vector&lt;std::future&lt;RayResult>> m_futures;

for (int j = 0; j &lt; ny; ++j) {
	for (int i = 0; i &lt; nx; ++i) {
		auto future = std::async(std::launch::async | std::launch::deferred, 
		[&cam, &world, &ns, i, j, nx, ny, &cvResults]() -> RayResult {
			const unsigned int index = j * nx + i;
			vec3 col(0, 0, 0);
			for (int s = 0; s &lt; ns; ++s) {
				float u = float(i + random_double()) / float(nx);
				float v = float(j + random_double()) / float(ny);

				ray r = cam.get_ray(u, v);
				col += color(r, world, 0);
			}
			col /= float(ns);

			RayResult result;
			result.index = index;
			result.col = vec3(sqrt(col[0]), sqrt(col[1]), sqrt(col[2]));
			return result;
		});

		{
			std::lock_guard&lt;std::mutex> lock(mutex);
			m_futures.push_back(std::move(future));
		}
	}
}</pre>

This is what the main loop now looks like. RayResult is a simple struct containing the image index and resulting color value. After this, I wait for `m_futures` to be the same value as the number of pixels in the image, and then build the image before writing it to a file.

<pre class="EnlighterJSRAW" data-enlighter-language="cpp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">// launched jobs. need to build image.
// wait for number of jobs = pixel count
{
	std::unique_lock&lt;std::mutex> lock(mutex);
	cvResults.wait(lock, [&m_futures, &pixelCount] {
		return m_futures.size() == pixelCount;
	});
}

// reconstruct image.
for (std::future&lt;RayResult>& rr : m_futures)
{
	RayResult result = rr.get();
	image[result.index] = result.col;
}</pre>

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="1024" height="683" src="http://mikeadev.net/wp-content/uploads/image-8-1024x683.png" alt="" class="wp-image-769" srcset="http://mikeadev.net/wp-content/uploads/image-8-1024x683.png 1024w, http://mikeadev.net/wp-content/uploads/image-8-300x200.png 300w, http://mikeadev.net/wp-content/uploads/image-8-768x512.png 768w, http://mikeadev.net/wp-content/uploads/image-8.png 1200w" sizes="(max-width: 767px) 89vw, (max-width: 1000px) 54vw, (max-width: 1071px) 543px, 580px" /><figcaption> <em>1 Job per Pixel, 1200&#215;800, 10spp, 23 seconds.</em> </figcaption></figure>
</div>

The resulting image is the same. As expected this reduced execution time to around 23 seconds, 3.8x improvement. But not everything is looking good, on the contrary, we now started to use a lot more memory!

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="497" height="270" src="http://mikeadev.net/wp-content/uploads/image-9.png" alt="" class="wp-image-770" srcset="http://mikeadev.net/wp-content/uploads/image-9.png 497w, http://mikeadev.net/wp-content/uploads/image-9-300x163.png 300w" sizes="(max-width: 497px) 100vw, 497px" /></figure>
</div>

Now this took almost 1 Gb of memory while running, compared to the 13Mb for the single threaded version! CPU usage is almost 100% across all the execution, meaning most cores where used, but that memory usage is way too high. I think we can do better!

## Threads and Blocks

The next implementation involves creating N-Threads, the number of threads my CPU can run concurrently, and splitting the image into N blocks of image rows. I&#8217;ll be using a std::condition_variable to determine if each thread has finished as well, and we&#8217;ll see if this improves our program.

<div class="wp-block-image">
  <figure class="aligncenter size-large"><img loading="lazy" width="515" height="273" src="http://mikeadev.net/wp-content/uploads/image-10.png" alt="" class="wp-image-775" srcset="http://mikeadev.net/wp-content/uploads/image-10.png 515w, http://mikeadev.net/wp-content/uploads/image-10-300x159.png 300w" sizes="(max-width: 515px) 100vw, 515px" /></figure>
</div>

We do get around the same speed benefit and a small enough increase in memory consumption from the baseline test. std::async jobs still performs faster, but I suspect that is it because some of the blocks had less work to do than other, and therefor, finished first. This will make some of our CPU cores idle while the threads finish their blocks ( we can see that from the decrease CPU usage in the screenshot above ). The image is less computationally intensive in some areas than others, think about diffuse spheres versus refractive ones.

Now, I also think that if we used std::async, and split work equally in blocks, we would also reduce memory consumption and calculate the image slower. I think we need to find a nice balance between jobs sizes, obviously one job per pixel is too little and a too big block might cause idle time if the jobs is performed too fast ( assuming that thread doesn&#8217;t have another job to perform )

You can grab the [source code on GitHub](https://github.com/Mikea15/raytracing.github.io/tree/threads/src/InOneWeekend)

## Fine Tuning Job Sizes

If we have less jobs than CPU cores, some of them become idle and have no more jobs to take on. I&#8217;ve created new tests to try out different job sizes. You can check out the code for the image block version using [threads](https://github.com/Mikea15/raytracing.github.io/tree/threads-jobq) and using [std::async](https://github.com/Mikea15/raytracing.github.io/tree/jobify-blocksizes). 

In both branches, you can edit `nRowsPerJob` to test different job sizes.

<pre class="EnlighterJSRAW" data-enlighter-language="cpp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">const int nThreads = std::thread::hardware_concurrency();
int nRowsPerJob = 10; // play with amount of rows for each job
int nJobs = ny / nRowsPerJob;
int leftOver = ny % nThreads;</pre>

I managed to get the same results on both methods. I no longer get a gigantic 1Gb memory usage with _std::async_, but now using a reasonable amount of pixels to generate, instead of one. There is no visible benefit in terms of performance from _threads_ vs _std::async_ that I could see. On both versions, with various block sizes, I had the same results: around 24 seconds per image and 30Mb of memory usage. By keeping the number of images rows per block low, more jobs will be created and this is ideal to split jobs evenly across CPU cores.

## Take away

I set out to expand and consolidate my knowledge on multi threading paradigms and concepts using c++, using some older and some newer c++ features, and I had a lot of fun doing so. 

I&#8217;m sure there&#8217;s lot of room for improvement and provably made lots of mistakes, if I did, let me know. In any case I hope you can take your own conclusions and maybe learn something too.

<a href="https://www.codeproject.com/script/Articles/BlogArticleList.aspx?amid=7793424" rel="tag" style="display:none">CodeProject</a>