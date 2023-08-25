import { reactive } from 'vue';

const mdValue = `# Fake Project

Welcome to the Fake Project! This is a completely fictional project created for the sole purpose of demonstrating code snippets in various programming languages.

## Table of Contents

-   [Introduction](#introduction)
-   [Languages](#languages)
    -   [Python](#python)
    -   [JavaScript](#javascript)
    -   [Java](#java)
    -   [C++](#cpp)

## Introduction

The Fake Project is an imaginary initiative that showcases snippets of code in different programming languages. It has no real-world functionality or purpose other than providing examples of code in action. Feel free to explore the snippets below!

## Languages

### Python

\`\`\`python
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

print(factorial(5))  # Output: 120
\`\`\`

### JavaScript

\`\`\`javascript
function fibonacci(n) {
    if (n <= 1) {
        return n;
    } else {
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}

console.log(fibonacci(6)); // Output: 8
\`\`\`

### Java

\`\`\`java
public class FakeProject {
    public static void main(String[] args) {
        String message = "Hello, Java!";
        System.out.println(message);
    }
}
\`\`\`

### C++

\`\`\`cpp
#include <iostream>
using namespace std;

int main() {
    int num = 42;
    cout << "The answer to life, the universe, and everything: " << num << endl;
    return 0;
}
\`\`\`
`;

export const repoFormStore = reactive({
    markdownContent: '',
    repoUrl: '',
    isProcessing: false,
    processRequest() {
        this.isProcessing = true;
        setTimeout(() => {
            this.setMarkdownContent(mdValue);
            this.isProcessing = false;
        }, 5000);
    },
    setRepoUrl(repoUrl: string) {
        this.repoUrl = repoUrl;
    },
    setMarkdownContent(markdownContent: string) {
        this.markdownContent = markdownContent;
    },
});
