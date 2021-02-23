---
id: 3
title: 'Multi-Threaded TCP Server in C#'
date: 2012-07-26T03:16:25+01:00
author: Michael Adaixo
layout: post
guid: http://mikeadev.net/?p=3
permalink: /2012/07/multi-threaded-tcp-server-in-csharp/
dsq_thread_id:
  - "2067648359"
categories:
  - Tutorials
tags:
  - client
  - CodeProject
  - csharp
  - dotnet
  - programming
  - server
  - tcp
  - threads
---
This tutorial introduces the concept of using threads to handle multiple clients in a TCP server. A TCP server is created and set to listen to a specific port. When a client is connected, a new thread is created that will handle the client&#8217;s communication.

<!--more-->

**The Client Class**.

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">class ClientDemo
{
    private TcpClient _client;

    private StreamReader _sReader;
    private StreamWriter _sWriter;

    private Boolean _isConnected;

    public ClientDemo(String ipAddress, int portNum)
    {
        _client = new TcpClient();
        _client.Connect(ipAddress, portNum);

        HandleCommunication();
    }

    public void HandleCommunication()
    {
        _sReader = new StreamReader(_client.GetStream(), Encoding.ASCII);
        _sWriter = new StreamWriter(_client.GetStream(), Encoding.ASCII);

        _isConnected = true;
        String sData = null;
        while (_isConnected)
        {
            Console.Write("> ");
            sData = Console.ReadLine();

            // write data and make sure to flush, or the buffer will continue to 
            // grow, and your data might not be sent when you want it, and will
            // only be sent once the buffer is filled.
            _sWriter.WriteLine(sData);
            _sWriter.Flush();

            // if you want to receive anything
            // String sDataIncomming = _sReader.ReadLine();
        }
    }
}</pre>

In this class we&#8217;re going to need to a instantiate a [TcpClient](http://msdn.microsoft.com/en-us/library/system.net.sockets.tcpclient.aspx "TcpClient MSDN") so we can have a connection with the server.

To handle communication _to_ and _from_ the server, a [StreamReader](http://msdn.microsoft.com/en-us/library/system.io.streamreader.aspx "StreamReader MSDN") and [StreamWriter](http://msdn.microsoft.com/en-us/library/system.io.streamwriter.aspx "StreamWriter MSDN") are used so we can easily write and read data. We could use a [NetworkStream](http://msdn.microsoft.com/en-us/library/System.Net.Sockets.NetworkStream.aspx "NetworkStream MSDN") but you can&#8217;t force _flush_ so I find it better to use the _StreamReader/Writer_.

To instantiate them you just have to feed them the _stream_ from the client&#8217;s connection.

After that, I just ask for input and send it to the server. From there you can do anything you want. Process the data you receive from the server to close the client or do other fun stuff.

**The Server Class**

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">class TcpServer
{
    private TcpListener _server;
    private Boolean _isRunning;

    public TcpServer(int port)
    {
        _server = new TcpListener(IPAddress.Any, port);
        _server.Start();

        _isRunning = true;

        LoopClients();
    }

    public void LoopClients()
    {
        while (_isRunning)
        {
            // wait for client connection
            TcpClient newClient = _server.AcceptTcpClient();

            // client found.
            // create a thread to handle communication
            Thread t = new Thread(new ParameterizedThreadStart(HandleClient));
            t.Start(newClient);
        }
    }

    public void HandleClient(object obj)
    {
        // retrieve client from parameter passed to thread
        TcpClient client = (TcpClient)obj;

        // sets two streams
        StreamWriter sWriter = new StreamWriter(client.GetStream(), Encoding.ASCII);
        StreamReader sReader = new StreamReader(client.GetStream(), Encoding.ASCII);
        // you could use the NetworkStream to read and write, 
        // but there is no forcing flush, even when requested

        Boolean bClientConnected = true;
        String sData = null;

        while (bClientConnected)
        {
            // reads from stream
            sData = sReader.ReadLine();

            // shows content on the console.
            Console.WriteLine("Client > " + sData);

            // to write something back.
            // sWriter.WriteLine("Meaningfull things here");
            // sWriter.Flush();
        }
    }
}</pre>

In this class, you&#8217;ll have to have a [TcpListener](http://msdn.microsoft.com/en-us/library/system.net.sockets.tcplistener.aspx "TcpListener MSDN") Class. When you start your Server class, you&#8217;ll be opening a port on the machine and will be waiting for clients to connect.

Once a client connects, a thread is fired and the client who got connected is passed to the thread as a parameter, so we don&#8217;t loose the connection.

The thread starts a function that will handle communication with clients. First, we recover the client from the object passed in the thread as parameter.&nbsp;Then we create our streams to write and read from the client&#8217;s stream. Each client has a two private streams, that is why they are created inside _HandleClient(object obj)_ method, so they don&#8217;t share the same streams.

After that, you can do what you want, send and receive data :)

**Client Main Class**

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="git" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">namespace Client
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Multi-Threaded TCP Server Demo");
            Console.WriteLine("Provide IP:");
            String ip = Console.ReadLine();

            Console.WriteLine("Provide Port:");
            int port = Int32.Parse(Console.ReadLine());

            ClientDemo client = new ClientDemo(ip, port);
        }
    }
}</pre>

**Server Main Class**

<pre class="EnlighterJSRAW" data-enlighter-language="csharp" data-enlighter-theme="" data-enlighter-highlight="" data-enlighter-linenumbers="" data-enlighter-lineoffset="" data-enlighter-title="" data-enlighter-group="">namespace Multi_Threaded_TCP
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Multi-Threaded TCP Server Demo");
            TcpServer server = new TcpServer(5555);
        }
    }
}</pre>

_Note: Just change the &#8220;5555&#8221; to whatever you want. That&#8217;s the port the server will be listening to. Or even better, ask for it when launching the application or store it in a configuration file. ;)_

**Note:** This is far from a optimal solution and shouldn&#8217;t be used in real life applications. This tutorial only introduces some concepts, namely, Threads, TCP listeners and TCP Clients. You should know that each thread created will use 1Mb of memory, so its easy to see where this approach is not good. If lots of client connections come in, you&#8217;ll quickly see the memory ramp up. A better way to manage this would be to create a limited amount of threads, and set the clients on queues, re-using threads as the jobs finish, and so on. A new, better way of creating a Multi-Threaded Server would be using Task, from the Task Parallel Library, but I&#8217;ll talk more on that later. :)