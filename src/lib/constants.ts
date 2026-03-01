import type { Language } from '@/types';

export const LANGUAGES: { id: Language; label: string; icon: string; color: string }[] = [
  { id: 'javascript', label: 'JavaScript', icon: 'JS', color: '#f7df1e' },
  { id: 'python', label: 'Python', icon: 'PY', color: '#3776ab' },
  { id: 'c', label: 'C', icon: 'C', color: '#a8b9cc' },
  { id: 'cpp', label: 'C++', icon: 'C+', color: '#00599c' },
  { id: 'java', label: 'Java', icon: 'JA', color: '#ed8b00' },
];

export const DEFAULT_CODE: Record<Language, string> = {
  javascript: `// JavaScript Event Loop Demo
console.log("1: Start");

setTimeout(() => {
  console.log("2: setTimeout callback");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("3: Promise.then (microtask)");
  })
  .then(() => {
    console.log("4: Chained Promise.then");
  });

console.log("5: End");

// Expected output order: 1, 5, 3, 4, 2
// Sync code runs first, then microtasks, then macrotasks
`,

  python: `# Python - Recursive Fibonacci with Memoization
def fibonacci(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    memo[n] = result
    return result

# Calculate first 10 Fibonacci numbers
for i in range(10):
    result = fibonacci(i)
    print(f"fib({i}) = {result}")

print("Done!")
`,

  c: `// C - Memory Management & Pointers
#include <stdio.h>
#include <stdlib.h>

int main() {
    // Stack allocation
    int x = 42;
    int y = 100;
    
    // Pointer to stack variable
    int *ptr = &x;
    printf("x = %d, *ptr = %d\\n", x, *ptr);
    
    // Heap allocation
    int *arr = (int*)malloc(5 * sizeof(int));
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 10;
    }
    
    printf("arr[2] = %d\\n", arr[2]);
    
    // Free heap memory
    free(arr);
    
    // Pointer arithmetic
    int nums[] = {10, 20, 30, 40, 50};
    int *p = nums;
    printf("*(p+2) = %d\\n", *(p + 2));
    
    return 0;
}
`,

  cpp: `// C++ - Smart Pointers & RAII
#include <iostream>
#include <memory>
#include <vector>

class Resource {
    std::string name;
public:
    Resource(std::string n) : name(n) {
        std::cout << "Created: " << name << std::endl;
    }
    ~Resource() {
        std::cout << "Destroyed: " << name << std::endl;
    }
    void use() {
        std::cout << "Using: " << name << std::endl;
    }
};

int main() {
    // unique_ptr - exclusive ownership
    auto unique = std::make_unique<Resource>("UniqueRes");
    unique->use();
    
    // shared_ptr - shared ownership
    auto shared1 = std::make_shared<Resource>("SharedRes");
    {
        auto shared2 = shared1; // ref count = 2
        shared2->use();
        std::cout << "Ref count: " << shared1.use_count() << std::endl;
    } // shared2 destroyed, ref count = 1
    
    std::cout << "Ref count: " << shared1.use_count() << std::endl;
    
    // Vector with dynamic allocation
    std::vector<int> vec = {10, 20, 30};
    vec.push_back(40);
    
    for (int v : vec) {
        std::cout << v << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
`,

  java: `// Java - OOP, Inheritance & Garbage Collection
import java.util.ArrayList;

class Animal {
    String name;
    int age;
    
    Animal(String name, int age) {
        this.name = name;
        this.age = age;
        System.out.println("Created: " + name);
    }
    
    void speak() {
        System.out.println(name + " makes a sound");
    }
}

class Dog extends Animal {
    String breed;
    
    Dog(String name, int age, String breed) {
        super(name, age);
        this.breed = breed;
    }
    
    @Override
    void speak() {
        System.out.println(name + " barks!");
    }
}

public class Main {
    public static void main(String[] args) {
        // Object creation on heap
        ArrayList<Animal> animals = new ArrayList<>();
        
        animals.add(new Dog("Rex", 5, "German Shepherd"));
        animals.add(new Dog("Buddy", 3, "Golden Retriever"));
        animals.add(new Animal("Cat", 2));
        
        // Polymorphism
        for (Animal a : animals) {
            a.speak();
        }
        
        // Object becomes eligible for GC
        animals.remove(2);
        System.out.println("Removed one animal");
        
        System.out.println("Total animals: " + animals.size());
    }
}
`,
};

export const MONACO_LANGUAGE_MAP: Record<Language, string> = {
  javascript: 'javascript',
  python: 'python',
  c: 'c',
  cpp: 'cpp',
  java: 'java',
};

export const EXECUTION_SPEEDS = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '2x', value: 2 },
  { label: '4x', value: 4 },
];

export const KEYBOARD_SHORTCUTS = {
  run: 'Ctrl+Enter',
  step: 'F10',
  stepInto: 'F11',
  stepOut: 'Shift+F11',
  reset: 'Ctrl+Shift+R',
  toggleTheme: 'Ctrl+Shift+T',
};
