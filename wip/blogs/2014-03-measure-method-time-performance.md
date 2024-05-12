---
id: 172
title: Measure Method Time Performance
pubDate: 2014-03-05T11:18:18+00:00
categories:
  - snippet
tags:
  - csharp
  - development
  - dotnet
  - performance
  - programming
  - snippet
---
Quick snippet to let you check the time used by any method you have.

```cpp
public static void CalculateTime( Action method )
{
    Stopwatch chrono = new Stopwatch();
    chrono.Start();

    method.Invoke();
            
    chrono.Stop();
    Console.WriteLine("Method : " + method.Method.Name + ", Time: " + chrono.ElapsedMilliseconds + " (ms)");
}
```

This will write to the console the time spent on the method.

```cpp
DiagnosticStaticClass.CalculateTime( MyExpensiveMethod );
```

Just remember to use _System.Diagnostics_.  
More info on <a title="MSDN Stopwatch" href="http://msdn.microsoft.com/en-us/library/system.diagnostics.stopwatch(v=vs.110).aspx" target="_blank" rel="noopener noreferrer">Stopwatch</a>.

That's it. Enjoy.