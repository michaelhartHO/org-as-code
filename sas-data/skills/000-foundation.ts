// 000-foundation.ts presents the foundational skills

import { RegistrarInterface } from "../../src/registrar.ts";

export function register(registrar: RegistrarInterface) {
  registrar
    .on("3 Dec 2008")
    .addSkill({
      tag: "Python 3.0",
      description: "Python 3.0 development",
      reference: "https://docs.python.org/3/whatsnew/3.0.html",
    })
    .on("20 May 2009")
    .addSkill({
      tag: "C# 4.0",
      description: "C# 4.0 development",
      reference: "https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-4",
    })
    .on("25 June 2010")
    .addSkill({
      tag: "Ruby 1.9.2",
      description: "Ruby 1.9.2 development",
      reference: "https://www.ruby-lang.org/en/news/2010/08/18/ruby-1-9-2-released/",
    })
    .on("6 December 2011")
    .addSkill({
      tag: "Node.js 0.6.6",
      description: "Node.js 0.6.6 development",
      reference: "https://nodejs.org/en/blog/release/v0.6.6/",
    })
    .on("28 August 2012")
    .addSkill({
      tag: "Go 1.0.2",
      description: "Go 1.0.2 development",
      reference: "https://golang.org/doc/go1.0",
    })
    .on("15 March 2013")
    .addSkill({
      tag: "Dart 1.0",
      description: "Dart 1.0 development",
      reference: "https://news.dartlang.org/2013/11/dart-10-stable-release.html",
    })
    .on("17 June 2014")
    .addSkill({
      tag: "Swift 1.0",
      description: "Swift 1.0 development",
      reference: "https://developer.apple.com/swift/",
    })
    .on("27 April 2015")
    .addSkill({
      tag: "Rust 1.0",
      description: "Rust 1.0 development",
      reference: "https://blog.rust-lang.org/2015/05/15/Rust-1.0.html",
    })
    .on("14 September 2016")
    .addSkill({
      tag: "Kotlin 1.0",
      description: "Kotlin 1.0 development",
      reference: "https://blog.jetbrains.com/kotlin/2016/02/kotlin-1-0-released-pragmatic-language-for-jvm-and-android/",
    })
    .on("19 October 2017")
    .addSkill({
      tag: "Python 3.6",
      description: "Python 3.6 development",
      reference: "https://docs.python.org/3/whatsnew/3.6.html",
    })
    .on("26 June 2018")
    .addSkill({
      tag: "TypeScript 3.0",
      description: "TypeScript 3.0 development",
      reference: "https://devblogs.microsoft.com/typescript/announcing-typescript-3-0/",
    })
    .on("Dec 3, 2015")
    .addSkill({
      tag: "PHP 7.0",
      description: "PHP 7.0 development",
      reference: "https://www.php.net/ChangeLog-7.php#PHP_7_0",
    })
    .on("1 Sept 2018")
    .addSkill({
      tag: "java11",
      description: "Java v11 development",
      reference: "https://docs.oracle.com/en/java/javase/11/",
    })
    .on("26-11-2020")
    .addSkill({
      tag: "PHP 8.0",
      description: "PHP 8.0 development",
      reference: "https://www.php.net/releases/8.0/en.php",
    })
    .on("22/11/2024")
    .addSkill({
      tag: "TypeScript 5",
      description: "TypeScript 5 development",
      reference:
        "https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/",
    })
    .on("23-11-2024")
    .addSkill({
      tag: "PHP 8.4",
      description: "PHP 8.4 development",
      reference: "https://www.php.net/releases/8.4/en.php",
    });
}
