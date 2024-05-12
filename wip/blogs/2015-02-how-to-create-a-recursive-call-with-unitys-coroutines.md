---
id: 271
title: How to create a recursive call with Unity's Coroutines
pubDate: 2015-02-19T22:26:39+00:00

categories:
  - snippet
tags:
  - codeproject
  - gamedev
  - unity3d
---
During the development of [Super Stems](http://mikeadev.net/2015/02/super-stems-post-mortem/ "Super Stems Post Mortem") I've had to deal with chain reaction. I started a battle with one tile, and if they win, the captured tile would start a battle, and this would happen recursively. For some reason, I have this battle method call on a different thread, in Unity's terms, a Coroutine.

Now comes the question. How do I handle recursion with Coroutines? After looking around the doc and experimenting, I found a solution.

Here's a sample code on how to make it work.

```cpp
public void StartBattle( )
{
	StartCoroutine(BattleRecursive(0));
}

public IEnumerator BattleRecursive( int depth )
{
	// Start Coroutine"
	
	yield return new WaitForSeconds(2f);

	if( depth == 0 )
		yield return StartCoroutine( BattleRecursive(depth+1) );

	if( depth == 1 )
		yield return StartCoroutine( BattleRecursive(depth+1) );
	
	Debug.Log( "MyCoroutine is now finished at depth " + depth );
}
```

After calling the entry point to your recursive method **StartBattle**, inside, you have yield return a new Coroutine call to the recursive method. This way, the execution order will be correct. Try it out and see for yourself.

Output should be.

```cpp
MyCoroutine is now finished at depth 2
MyCoroutine is now finished at depth 1
MyCoroutine is now finished at depth 0
```

Enjoy