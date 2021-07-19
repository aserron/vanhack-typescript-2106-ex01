import chai from "chai";
// const chai = require("chai")
const assert = chai.assert;
chai.config.truncateThreshold = 0;

// cant make it work with the js extension.
import balanced from "../src/lib/balanced/balanced.mjs";



describe("Example Test Cases", () => {
    it("should work on provided examples", () => {
        assert.isTrue(balanced("a"), `Test failed for "a"`);
        assert.isTrue(balanced("ab"), `Test failed for "ab"`);
        assert.isTrue(balanced("abc"), `Test failed for "abc"`);
        assert.isFalse(balanced("abcb"), `Test failed for "abcb"`);
        assert.isFalse(balanced("Aaa"), `Test failed for "Aaa"`);
        assert.isFalse(balanced("abcb*"), `Test failed for "abcb*"`);
        assert.isTrue(balanced("abcb**"), `Test failed for "abcb**"`);
        assert.isTrue(
            balanced("***********"), `Test failed for "***********"`
        );
        assert.isTrue(balanced(""), `Test failed for ""`);
    });
});

describe("Advanced Test Cases", () => {
    it("should detect various valid wildcard arrangements", () => {
        assert.isTrue(balanced("*"), `Test failed for "*"`);
        assert.isTrue(balanced("ab*"), `Test failed for "ab*"`);
        assert.isTrue(balanced("a*"), `Test failed for "a*"`);
        assert.isTrue(balanced("*a*"), `Test failed for "*a*"`);
        assert.isTrue(balanced("accb**"), `Test failed for "accb**"`);
        assert.isTrue(balanced("*xx*y*"), `Test failed for "*xx*y*"`);
        assert.isTrue(
            balanced("abd*xdx*yba*"), `Test failed for "abd*xdx*yba*"`
        );
        assert.isTrue(balanced("a*ccbb"), `Test failed for "a*ccbb"`);
        assert.isTrue(
            balanced("aabbc***"), `Test failed for "aabbc***"`
        );
        assert.isTrue(
            balanced("aabbc****"), `Test failed for "aabbc****"`
        );
        assert.isTrue(
            balanced("abbc****"), `Test failed for "abbc****"`
        );
        assert.isTrue(
            balanced("abbbc****"), `Test failed for "abbbc****"`
        );
    });

    it("should detect various invalid wildcard arrangements", () => {
        assert.isFalse(balanced("*abbb"), `Test failed for "*abbb"`);
        assert.isFalse(
            balanced("aabb***"), `Test failed for "aabb***"`
        );
        assert.isFalse(
            balanced("a*aabc*****"), `Test failed for "a*aabc*****"`
        );
        assert.isFalse(
            balanced("a*aa**z**z*"), `Test failed for "a*aa**z**z*"`
        );
        assert.isFalse(
            balanced("a*abz*d"), `Test failed for "a*abz*d"`
        );
        assert.isFalse(
            balanced("*a*abz*de"), `Test failed for "*a*abz*de"`
        );
        assert.isFalse(
            balanced("*a*xabz***de*"), `Test failed for "*a*xabz***de*"`
        );
        assert.isFalse(
            balanced("*a*xabz**de*z"), `Test failed for "*a*xabz**de*z"`
        );
    });

    it("should work on long strings", () => {
        let test = new Array(500000)
            .fill().map((e, i) => "abcde"[i%5]).join``
        ;

        if (!balanced(test)) {
            assert.isTrue(false, `Test failed for "${test}"`);
        }

        test = new Array(499999)
            .fill().map((e, i) => "abcde"[i%5]).join``
        ;

        if (balanced(test)) {
            assert.isFalse(true, `Test failed for "${test}"`);
        }
    });

    it("should handle edge cases", () => {
        // No more character to use
        assert.isFalse(
                balanced("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ*"),
            `Test failed for "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ*"`
        );

        // balanced by adding used characters evenly
        const edge52 = [
            "abcdefghijklmnopqrstuvwxyz",
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            "**************************",
            "**************************"
        ].join("");
        assert.isTrue(balanced(edge52), `Test failed for "${edge52}"`);

        // ***
        // C**
        // D**
        // F**
        // H**
        // RR*
        // SS*
        // U**
        // Y**
        assert.isTrue(
            balanced("*C***F***R*US*R**D***YS***H"),
            `Test failed for "*C***F***R*US*R**D***YS***H"`
        );

        // needs to use wildcards for both existing
        // characters and new characters to balance
        // C**
        // LL*
        // N**
        // Q**
        // SS*
        // ***
        // ***
        assert.isTrue(
            balanced("*C***S*L**L****S**QN*"),
            `Test failed for "*C***S*L**L****S**QN*"`
        );
    });


    it("should work on small random tests", () => {
        for (let i = 0; i < 10000; i++) {
            const test = generateRandomString(rand());
            const expected = balancedRef(test);
            const actual = balanced(test);

            if (expected !== actual) {
                assert.equal(actual, expected, `Test failed for "${test}"`);
            }
        }
    });

    it("should work on huge random tests", () => {
        for (let i = 0; i < 10; i++) {
            const test = generateRandomString(50000);
            const expected = balancedRef(test);
            const actual = balanced(test);

            if (expected !== actual) {
                assert.equal(actual, expected, `Test failed for "${test}"`);
            }
        }
    });

    const rand = (n=26) => ~~(Math.random() * n);
    const generateRandomString = n =>
        new Array(rand() + n)
            .fill()
            .map(e => rand(3) ? String.fromCharCode(rand(26) + 65) : "*")
            .join``
    ;
});

const balancedRef = string => {
    let counts = string.split``
        .reduce((a, e) => {
            if (!(e in a)) {
                a[e] = 0;
            }

            a[e]++;
            return a;
        }, {})
    ;

    if ("*" in counts) {
        let wildcards = counts["*"];
        delete counts["*"];
        counts = Object.values(counts);

        if (!counts.length) {
            return true;
        }

        let maxCount = Math.max(...counts);

        for (let i = 0; i < counts.length; i++) {
            wildcards -= maxCount - counts[i];
            counts[i] = maxCount;

            if (wildcards < 0) {
                return false;
            }
        }

        if (wildcards) {
            while (wildcards > 0) {
                if (wildcards % counts.length === 0 ||
                    wildcards % maxCount === 0 &&
                    wildcards / maxCount + counts.length < 53) {
                    return true;
                }

                maxCount++;
                wildcards -= counts.length;
            }

            return false;
        }
    }
    else {
        counts = Object.values(counts);
    }

    return !counts.length ||
        counts.every(e => e === counts[0])
        ;
}