---
id: 750
title: 'Exploring Multi-Threading in C++: Loading Textures'
date: 2019-11-13T00:46:06+00:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=750
permalink: /2019/11/exploring-multi-threading-in-c-loading-textures/
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
  * [**Part 3: Exploring Multi-Threading in C++: Loading Textures**](http://mikeadev.net/2019/11/exploring-multi-threading-in-c-loading-textures/)
  * [Part 4: Exploring Multi-Threading in C++: Parallelizing Ray Tracing](http://mikeadev.net/2019/11/parallelizing-ray-tracing/)

## Problem Overview

Let's say we have a game engine that uses OpenGL and we need to load textures asynchronously so that we don't block the main thread, and we can load the editor or game much faster.

Now as previously demonstrated, I could launch a new set of threads and have them load up the textures ( I'm using [stb_image](https://github.com/nothings/stb) for that ) and generate textures with _glGenTextures_. The main issue here is that OpenGL context is only availabe in the main thread so if we want to take advantage of multi-threading texture loading we need to split the loading and generating for textures.

Loading is going to be done in worker threads, and generating textures will be done in the main thread. The following diagram shows a simplified workflow of what we'll achieve.

<figure class="wp-block-image size-large">

<img src="http://mikeadev.net/content/img/image-4.png" alt="" /> <figcaption>Simplified execution of loading textures in worker threads, and processing them in the main thread.</figcaption></figure> 

In our main thread we have a method that will check our processing textures queue for a job. If it finds one, Generates the OpengGL texture and assigns it back to the material.

```cpp
void AssetManager::Update()
{
	if (!m_processingTexturesQueue.Empty())
	{
		TextureLoadJob assetJob;
		if (m_processingTexturesQueue.TryPop(assetJob))
		{
			// Generate OpenGL texture
			Texture outputTexture = GenerateTexture(assetJob.loadedData, assetJob.textureType);
			// Update Material
			assetJob.materialOwner->AddTexture(outputTexture);
		}
	}
}
```

The loader thread will continuously run and check the loading textures queue for jobs. In this case, I load the texture from a file path and assigning the result into the loaded data.

```cpp
void AssetManager::LoaderThread()
{
	while (m_loadingThreadActive)
	{
		if (!m_loadingTexturesQueue.Empty())
		{
			TextureLoadJob assetJob;
			if (m_loadingTexturesQueue.TryPop(assetJob))
			{
				// Load texture data into asset job
				assetJob.loadedData = LoadTextureData(assetJob.texturePath);
				// push job into processing queue
				m_processingTexturesQueue.Push(assetJob);
			}
		}
		// ....
	}
}
```

<div class="wp-block-image">
  <figure class="aligncenter size-large is-resized"><img src="http://mikeadev.net/content/img/image-5.png" alt="" /><figcaption>In game sponza scene.</figcaption></figure>
</div>

This architecture allows me to load textures while the game is running without blocking the main thread. Its a bit pointless to compare times here since I'm using my own sandbox instead of a sample program to test only this matter. See [Part 1](http://mikeadev.net/2019/10/exploring-multi-threading-in-c/) and [Part 2](http://mikeadev.net/2019/10/exploring-multi-threading-in-c-part-2/) for more info and code you can follow along.

Full source code can be found on [GitHub](https://github.com/Mikea15/EngineSandbox) ( [commit](https://github.com/Mikea15/EngineSandbox/commit/3d8651a029ee851b1de322c664b328654aff2ea8) )

In the next part, we'll parallelize a toy Ray Tracer. This a different problem on its own where we need to use the resulting values of multiple threads or jobs to build a final image.

## Continue Reading

  * [Part 1: Exploring Multi-Threading in C++](http://mikeadev.net/2019/10/exploring-multi-threading-in-c/)
  * [Part 2: Exploring Multi-Threading in C++ Cont.](http://mikeadev.net/2019/10/exploring-multi-threading-in-c-part-2/)
  * [**Part 3: Exploring Multi-Threading in C++: Loading Textures**](http://mikeadev.net/2019/11/exploring-multi-threading-in-c-loading-textures/)
  * [Part 4: Exploring Multi-Threading in C++: Parallelizing Ray Tracing](http://mikeadev.net/2019/11/parallelizing-ray-tracing/) 

<a href="https://www.codeproject.com/script/Articles/BlogArticleList.aspx?amid=7793424" rel="tag" style="display:none">CodeProject</a>