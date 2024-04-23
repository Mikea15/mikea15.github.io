---
title: Variable Jump Height in Unity
pubDate: 2015-08-04T10:07:02+01:00
heroImage: '/blog-placeholder-2.jpg'
published: true
categories:
  - tutorial
tags:
  - codeproject
  - gamedev
  - unity3d
---
In numerous games, characters have variable jump height. What this means is that the more your press the jump button, the more the character will remain in the air, or even jump a little higher ( think super mario games ). In this tutorial, I'll show you a simple way to implement this kind of jumping in your games.

You can begin by making a new project, or create a new scene from a project you have in Unity. Add a cube to the scene to act as the ground, so you might want to scale it forward (z) and sideways (x), and finally add another cube to act as our player. By default, both of these will have [BoxCollider Components](http://docs.unity3d.com/ScriptReference/BoxCollider.html) attached to them, which is good, but our player will also need a [Rigidbody Component](http://docs.unity3d.com/ScriptReference/Rigidbody.html), so we can use Unity's physics engine. Note that if you add a Rigidbody component to the ground, make sure you have [IsKinematic](http://docs.unity3d.com/ScriptReference/Rigidbody-isKinematic.html) enabled and [Gravity](http://docs.unity3d.com/ScriptReference/Rigidbody-useGravity.html) disabled, so it does not fall. On the contrary, make sure the player has **Gravity** enabled and **IsKinematic** disabled ( those should be set by default ). You should now have something pretty simple such as:  


<img class="img-fluid rounded-5 m-1" src="{{ 'content/img/Screen-Shot-2015-07-23-at-21.29.55.png' | relative_url }}" alt="Screen Shot 2015-07-23 at 21.29.55" />

So, using Unity's physics engine, how can we make our player jump? By looking at the [Rigidbody's documentation](http://docs.unity3d.com/ScriptReference/Rigidbody.html), we can see that we have many methods to add force, and we'll use the normal [AddForce](http://docs.unity3d.com/ScriptReference/Rigidbody.AddForce.html), which takes a directional vector and a force mode. As far as direction goes, we'll want the player to jump up, so we can use the local up vector from the [player's transform](http://docs.unity3d.com/ScriptReference/Transform.html). For the [ForceMode](http://docs.unity3d.com/ScriptReference/ForceMode.html), we have Force, Acceleration, Impulse, and VelocityChange, and I will use VelocityChange for now.

In order to control how much I want my player to jump I need to setup some variables first, namely, I will need a _jumpVelocityChange_ and _isJumping_ variable. I will also store the reference to the rigidbody, that I will get in the Awake method.

```cpp
[SerializeField] private float _jumpVelocityChange;
[SerializeField] private bool _isJumping;

private Rigidbody _rigidBody;
```

```cpp
void Awake( )
{
	_rigidBody = this.GetComponent();
}
```

**Quick Tip:** _[[SerializeField](http://docs.unity3d.com/ScriptReference/SerializeField.html)]_ is used in unity, not only but also, to expose _private_ variables in the Inspector. Why don't I just make it public you ask? Because I don't want other classes to access those variables, they are meant to be private.

So now that I have those setup, I'll set them on the Inspector. I chose to set __jumpVelocityChange_ to 50 to begin with and __isJumping_ variable to false. Now since we're using the physics engine, we should apply our changes in the FixedUpdate and not in the Update method by default. Meaning that we will not need to multiply our force values by _Time.deltaTime_, since [FixedUpdate](http://docs.unity3d.com/ScriptReference/MonoBehaviour.FixedUpdate.html) always ticks at the same rate.

Now, to make the actual jump. In our Update function, I'm going to check if I click the left mouse button. If the left mouse button is pressed and I am not currently jumping, I'll set the _isJumping variable to true, and add a vertical force to the _player's rigidbody_.

```cpp
if ( Input.GetMouseButtonDown(0) && !_isJumping ) {
	_isJumping = true;
	_rigidBody.AddForce(this.transform.up * _jumpVelocityChange, ForceMode.VelocityChange);
}
```

This only will make the player jump when you click the left mouse button. But now when it falls down, you can't jump again. Care to guess why? Because we haven't set our _isJumping variable to false. So when should we do that? I'm going to go pretty simple with this, since both the ground and the player have colliders and rigidbodies, I can call the OnCollisionEnter method from my player, and when it's called, switch the variable to false. I'm not going to add anything else now, and leave it like this, but ideally, you'll want to check with whom the collision was made, if indeed it was the floor, for instance.

```cpp
void OnCollisionEnter( Collision collision )
{
	_isJumping = false;
}
```

Now everything seems to work fine. You can jump, fall down, and then jump again. But what about the SuperMario style jump? You know, the more you press, the longer you remain in the air? For this, I need to setup three new variables, \_startJumpTime, \_maxJumpTime and _jumpAcceleration, so I can control air time and the acceleration force added during the jump.

```cpp
[SerializeField] private float _startJumpTime;
[SerializeField] private float _maxJumpTime;
[SerializeField] private float _jumpAcceleration;
```

I've changed the update method to include the "hold-to-jump-higher-and-for-more-time" behaviour, and updated the first impulse to add the start jump time. So your FixedUpdate method should look something like this:

```cpp
if ( Input.GetMouseButtonDown(0) && !_isJumping ) {
	_isJumping = true;
    _startJumpTime = Time.time;
	_maxJumpTime = _startJumpTime + _airJumpTime;
	_rigidBody.AddForce(this.transform.up * _jumpVelocityChange, ForceMode.VelocityChange);
}
else if ( Input.GetMouseButton(0) && _isJumping && ( _startJumpTime + _maxJumpTime > Time.time ) ) 
{
	_rigidBody.AddForce(Vector3.up * _jumpAcceleration, ForceMode.Acceleration);
}
```

This checks for a different Input method, _GetMouseButton_ instead of _GetMouseButtonDown_. The first one is called whenever the button is down, and the later is called once, when the button was pressed. So we capture the long button press, check if we are indeed already jumping, and check the amount of time we have to allow this long jump. If all those conditions are met, we keep on jumping, giving a continuous acceleration. This time we use an acceleration instead of velocity change, so the effects is a lot smaller.

So now you should be able to have your awesome "Super Mario style Jump":

```cpp
[RequireComponent (typeof(Rigidbody))]
public class Character : MonoBehaviour 
{
	[SerializeField] private float _jumpVelocityChange;
	[SerializeField] private float _jumpAcceleration;
 
	[SerializeField] private float _startJumpTime;
	[SerializeField] private float _maxJumpTime;
	
	[SerializeField] private bool _isJumping;
 
	private Rigidbody _rigidBody;
 
	void Awake( )
	{
		_rigidBody = this.GetComponent();
	}
	
	void FixedUpdate() 
	{
		if ( Input.GetMouseButtonDown(0) && !_isJumping ) {
			_isJumping = true;
			_startJumpTime = Time.time;
            _maxJumpTime = _startJumpTime + _airJumpTime;
			_rigidBody.AddForce(this.transform.up * _jumpVelocityChange, ForceMode.VelocityChange);
		}
		else if ( Input.GetMouseButton(0) && _isJumping && ( _startJumpTime + _maxJumpTime > Time.time ) ) 
		{
			_rigidBody.AddForce(Vector3.up * _jumpAcceleration, ForceMode.Acceleration);
		}
	}
 
	void OnCollisionEnter( Collision collision )
	{
		_isJumping = false;
	}
}
```

**Quick Tip:** Notice the [[RequireComponent](http://docs.unity3d.com/ScriptReference/RequireComponent.html) (typeof(RigidBody))] on the top of the class. What this does is automatically add the RigidBody component to the object you are adding this class to. So if there is no rigidbody, it will automatically add it. This makes sure that whenever I call the component in the Awake method, I always get a rigidbody, thus avoiding future errors.

