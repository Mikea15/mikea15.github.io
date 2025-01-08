---
title: 'Cpp Refresher'
date: '2024 10 30'
draft: true
---

This post is about refreshing my memory about a few Cpp language features.

## Smart Pointers

| Smart Pointer | Description |
| -- | -- |
| `std::unique_ptr<>` |  std::unique_ptr is a smart pointer that owns (is responsible for) and manages another object via a pointer and subsequently disposes of that object when the unique_ptr goes out of scope. [reference](https://en.cppreference.com/w/cpp/memory/unique_ptr) |
| `std::shared_ptr<>` | std::shared_ptr is a smart pointer that retains shared ownership of an object through a pointer. Several shared_ptr objects may own the same object. [reference](https://en.cppreference.com/w/cpp/memory/shared_ptr) |
| `std::weak_ptr<>` | std::weak_ptr is a smart pointer that holds a non-owning ("weak") reference to an object that is managed by std::shared_ptr. It must be converted to std::shared_ptr in order to access the referenced object. [reference](https://en.cppreference.com/w/cpp/memory/weak_ptr) |

Examples:

```cpp
// create unique pointer.
std::unique_ptr<int> a = std::make_unique<int>(1); 
// moves ownership to b. a becomes null.
std::unique_ptr<int> b = std::move(a);

std::shared_ptr<int> sA = std::make_shared<int>(2); // makes shared object.
std::shared_ptr<int> sB = sA;
// both sA and sB own a reference to the same object. 
// lifetime is preserved while either has a reference to it.

std::weak_ptr<int> wA = sA; // get weak ref to sA.
if(std::shared_ptr<int> vA = wA.lock()) {
    // use vA here.
}
```