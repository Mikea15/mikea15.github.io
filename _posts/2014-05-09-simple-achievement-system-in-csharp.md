---
id: 199
title: 'Simple Achievement System in C#'
date: 2014-05-09T00:12:07+01:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=199
permalink: /2014/05/simple-achievement-system-in-csharp/
dsq_thread_id:
  - "2671068182"
mixpanel_event_label:
  - ""
categories:
  - tutorial
tags:
  - codeproject
  - csharp
  - development
  - gamedev
  - programming
  - tutorial
  - unity3d
---
Achievements are becoming more and more usual in games. They provide the player a sense of accomplishment and progress by rewarding them with badges that proves their skill and experience. Some achievements are simple and other require a combination of particular actions to unlock. In this article I show you how to make a simple Achievement System using C# and will demonstrate it using Unity3D, but this should be easy enough for you to port it to whatever language you're more familiar with for your games.

<!--more-->

The main idea behind this achievement system is to count how many occurrences a player has done a particular action and keep track of it in a _AchievementManager_ class. When the **AchievementManager** counts an action a specific number of times (e.g, deaths, new games, trades, etc..), or, depending on the event type, counts a higher number than a particular amount (e.g, score, or damage), an event is fired to unlock the achievement, reward is given, i.e, medal, score bonus, coin, a message, etc.

I'm going to create a simple data structure to hold the **achievement data**:

```cpp
public class Achievement
{
    public int countToUnlock { get; set; }
    public bool isUnlocked { get; set; }
    public string Message { get; set; }
}
```

For the sake of simplicity, I'm not declaring private variables, nor constructors. This will do just fine for the purpose of this article. Might as well have declared that as a structure. Oh well.

I'll have an **achievement type** enumerator and a **achievement argument** for the events.

```cpp
public enum AchievementType
{
    Tap,
    Score,
    Die,
    Start
};
```

This is not the most elegant way to creating Achievement Types. I could have set them dynamically as Strings, but then I would have to search the dictionary against strings which is less efficient as this. For the simplicity of this system, I'll be using "hard coded" achievement types.

```cpp
public class AchievementEventArg : EventArgs
{
	public Achievement Data;
	public AchievementEventArg( Achievement e )
	{
		Data = e;
	}
}
```

With this, we can start to think about our **AchievementManager** class. But first, how do we want to handle the actions made by the user. I think one easy enough method would be to call the **AchivementManager** class, and **Register** a particular action occurrence, as such:

```cpp
_achievementManager.RegisterEvent(AchievementType.Die);
```

So whenever my player dies, I'll call the _RegisterEvent_ on **AchievementManager** and chose the _Die_ **achievement type**.

The code behind **RegisterEvent** would look like this:

```cpp
public void RegisterEvent( AchievementType type )
{
	if( !_achievementKeeper.ContainsKey(type) )
	    return;

	switch(type)
	{
	case AchievementType.Tap:
		_achievementKeeper[type]++;
		break;
	case AchievementType.Start:
		_achievementKeeper[type]++;
		break;
	case AchievementType.Score:
		_achievementKeeper[type]++;
		break;
	case AchievementType.Die:
		_achievementKeeper[type]++;
		break;
	}
	ParseAchievements(type);
}
```

**RegisterEvent** will check the **achievement type** and increment it on the __achievementkeeper_ data structure. This __achievementkeeper_&nbsp; is a simple Dictionary declared as such:

```cpp
private Dictionary<AchievementType> _achievementKeeper;
```

Since our achievement keeper is a dictionary with the key being the Achievement type, we just have to increment the dictionary's value at that key.&nbsp;As you can see, I switch over&nbsp;all Achievement types, and increment the occurrences of the achievements. I also check whether the achievement type is present in the dictionary. Should the dictionary have to key, it would return a exception, which I am not handling in a try catch, again for the sake of simplicity.

At the end of the **RegisterEvent** method, I call **ParseAchievements** of that same type. **ParseAchievements** will go through all achievements that are on the dictionary of the given type. As there may be more than one achievement per type, I loop through all achievements of that type and select only the ones that are still locked. After that, I differentiate the **Score** achievement type from all the others. If the achievement keeper for **Score** is _Greater than or equal_ to the current iteration of the achievement, then, I'll raise the event to unlock that achievement. For the other types of achievements, I just compare for equality. I am differentiating this because scores can change rapidly, and I think of it like comparing two floats for equality, you might get it or not, so better safe than sorry.

Here's the code for **ParseAchievement**:

```cpp
public void ParseAchievements( AchievementType type )
{
	foreach( var kvp in _achievements.Where( a =&gt; a.Key == type ) ) // use System.Linq.
	{
		foreach( var ach in kvp.Value.Where( a =&gt; a.isUnlocked == false ) ) 
		{
			if( type == AchievementType.Score ) {
				if( _achievementKeeper[type] &gt;= ach.countToUnlock )
					RaiseAchievementUnlocked(ach);
			}
			else if( _achievementKeeper[type] == ach.countToUnlock ) 
			{
				RaiseAchievementUnlocked(ach);
			}
		}
	}
}
```

As mentioned, the second loop will go through all the achievements of that type.&nbsp;They are stored in another dictionary declared as such:

```cpp
private Dictionary<AchievementType, List<Achievement>> _achievements;
```

As you can see, I have all achievements per type linked to lists of achievements of that type. You could do it in other ways, but I found this one to work pretty nicely. This is how I load all achievements:

```cpp
var listStart = new List();
listStart.Add(new Achievement() { countToUnlock = 1, isUnlocked = false, Message = "First Time Playing!" });
listStart.Add(new Achievement() { countToUnlock = 5, isUnlocked = false, Message = "Fifth Time is the Charm?" });
listStart.Add(new Achievement() { countToUnlock = 19, isUnlocked = false, Message = "Hello and Welcome Back!" });
listStart.Add(new Achievement() { countToUnlock = 25, isUnlocked = false, Message = "Tapping Time!!" });
listStart.Add(new Achievement() { countToUnlock = 50, isUnlocked = false, Message = "Perseverance Lvl 1!" });

_achievements.Add(AchievementType.Start, listStart );
```

First, I create a list of **Achievements**, where I manually create them ( they should be loaded from a file or database ). Then, I add them into the __achievements_ dictionary and set all the achievements in the list of type **Start** ( to be used when the player starts the game ).

And finally the **RaiseAchievementUnlocked** _event handler_ and _event raiser_:

```cpp
public event EventHandler AchievementUnlocked;
protected virtual void RaiseAchievementUnlocked( Achievement ach )
{
    // unlock the event
    ach.isUnlocked = true;

    var del = AchievementUnlocked as EventHandler;
    if( del != null )
    {
        del( this, new AchievementEventArg(ach) );
    }
}
```

The **EventHandler** only declares a public event, so another class, say the **GameManager** class, can register this event, and when a event is fired, get the info on the achievement. The **RaiseAchievementUnlocked** method accepts the **Achievement** as parameter to be sent through the delegate, wrapped in a **AchievementEventArgs** class, only after setting the **Achievement** as unlocked. &nbsp;When the **GameManager** class, received the event, it will get the data available from the **Achievement**, namely, _countToUnlock_, _isUnlocked_, and in this case, the only useful one for the player, _Message_. Then its up to the **GameManager** to show a message to the user letting him know he/she has unlocked the **Achievement**.

Here's the full code for the AchievementManager.cs class:

```cpp
public class AchievementsManager
{
    private Dictionary<AchievementType, List<Achievement>> _achievements;
    private Dictionary<AchievementType> _achievementKeeper;

	public event EventHandler AchievementUnlocked;
	protected virtual void RaiseAchievementUnlocked( Achievement ach )
	{
		// unlock the event
		ach.isUnlocked = true;

		var del = AchievementUnlocked as EventHandler;
		if( del != null )
		{
			del( this, new AchievementEventArg(ach) );
		}
	}

    public AchievementsManager( )
    {
		_achievementKeeper = new Dictionary<AchievementType>();
		// ideally, load here previous, saved values.
		// tap = 0
		// die = 1
		// start = 12
		// score = 1231

		_achievements = new Dictionary<AchievementType>();

		var listStart = new List();
		listStart.Add(new Achievement() { countToUnlock = 3, isUnlocked = false, Message = "First Time Playing!" });
		listStart.Add(new Achievement() { countToUnlock = 8, isUnlocked = false, Message = "Fifth Time is the Charm?" });
		listStart.Add(new Achievement() { countToUnlock = 10, isUnlocked = false, Message = "Hello and Welcome Back!" });
		listStart.Add(new Achievement() { countToUnlock = 16, isUnlocked = false, Message = "Tapping Time!!" });
		listStart.Add(new Achievement() { countToUnlock = 50, isUnlocked = false, Message = "Perseverance Lvl 1!" });

		_achievements.Add(AchievementType.Start, listStart );
    }

	public void RegisterEvent( AchievementType type )
	{
		if( !_achievementKeeper.ContainsKey(type) )
			return;

		switch(type)
		{
		case AchievementType.Tap:
			_achievementKeeper[type]++;
			break;
		case AchievementType.Start:
			_achievementKeeper[type]++;
			break;
		case AchievementType.Score:
			_achievementKeeper[type]++;
			break;
		case AchievementType.Die:
			_achievementKeeper[type]++;
			break;
		}

		ParseAchievements(type);
	}

	public void ParseAchievements( AchievementType type )
	{
		foreach( var kvp in _achievements.Where( a => a.Key == type ) )
		{
			foreach( var ach in kvp.Value.Where( a => a.isUnlocked == false ) ) 
			{
				if( type == AchievementType.Score ) {
					if( _achievementKeeper[type] >= ach.countToUnlock )
						RaiseAchievementUnlocked(ach);
				}
				else if( _achievementKeeper[type] == ach.countToUnlock ) 
				{
					RaiseAchievementUnlocked(ach);
				}
			}
		}
	}
}
```

Here is an example usage of the **AchievementManager** class. Declaration is trivial:

```cpp
private AchievementsManager _achievementManager;
```

In the constructor or initialization method for the **GameManager** class, I instantiate the **AchievementManager**, register to the **AchievementUnlocked event** and specify I want to call a method to show the achievement, which is defined as a lambda expression ( That I will talk about in the second part of this tutorial ). Finally, as I am starting the game, I call the register event method on the **AchievementManager** and register a _Start_ **Achievement Type**.

```cpp
_achievementManager = new AchievementsManager();
_achievementManager.AchievementUnlocked += (sender, e) =&gt;
{ 
	ShowAchievement(e.Data); 
};
_achievementManager.RegisterEvent(AchievementType.Start);

```

That pretty much covers this simple achievement system that can be used in any game. I hoped you enjoyed this tutorial, feel free to use this, add to it, comment and give suggestions. Part 2 will cover how to effectively use this in Unity3D engine. To make your life easier, <a title="AchievementManager.cs Gist" href="https://gist.github.com/Mikea15/deff4f794e4963b07ae2" target="_blank" rel="noopener noreferrer">here the gist of the whole file</a>. Enjoy.