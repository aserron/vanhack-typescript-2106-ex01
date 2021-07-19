# Task
A balanced string is one in which every character in the string appears an equal number of times as every other character.

For example, "ab", "aaabbb" and "ababaabb" are balanced, but "abb" and "abbbaa" are not.

Additionally, strings may also include a wildcard character, `"*"`. This wildcard character can represent any other character you wish. Furthermore, wildcards must represent another character; they cannot be left unused. A wild balanced string is a string in which all wildcards can be transformed into characters in such a way to produce a simple balanced string.

This challenge involves writing a function balanced(s) to check whether s is balanced.

Input is restricted to strings containing upper and lowercase alphabetical characters and the "*" wildcard character. The input string will match the regular expression

```regex
^[A-Za-z\*]*$
```
Note that upper- and lower-cased characters such as "A" and "a" are treated as distinct for the purposes of balance.

Sting input size is `0 <= n <= 500000`.

### Examples
```javascript   
balanced("a") ⟹ true
balanced("ab") ⟹ true
balanced("abc") ⟹ true
balanced("abcb") ⟹ false
balanced("Aaa") ⟹ false
```

The prior five examples illustrate simple string balancing characteristics.


`balanced("abcb*") ⟹ false`  
In the above example, one "*" was transformed into an "a", but without any further wildcards remaining, the "c" character cannot be balanced.


`balanced("abcb**") ⟹ true`  
In the previous example, one "*" was transformed into a "c" and one "*" was transformed into an "a", balancing the string (i.e., either "abcbca" or "abcbac").


`balanced("***********") ⟹ true`  
Above, the "*" characters can be made into any character, for example, "a", producing a balanced string.


`balanced("") ⟹ true`  
The empty string is balanced.