// noinspection JSUnusedLocalSymbols UnusedLocal UnusedGlobal

// @ts-ignore
const VALID_AZ_LC: string = 'abcdefghijklmnopqrstuvwxyz'
// @ts-ignore
const VALID_AZ_UC: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const VALID_COUNT: number = 52

export type InputString = string & { _: 'InputString' };
// @ts-ignore
const validateInputString = (input: string) => {

    const rx = /[a-z]|[A-Z]|\*]/g

    if (!rx.test(input)) {
        throw new Error("Invalid input, only [a-z][A-Z] and * allowd");
    }
    return input as InputString;
};

/**
 * Sorts an array of [char,count] by count in decreasing order.
 * @param a [char,count] pair array.
 * @param b [char,count] pair array.
 * @returns {number} Comparing count, 0 when equal, 1 if smaller, -1 if grater.
 */
const sortMaxToMin = (a: [string, number], b: [string, number]) => {

    if (a[1] < b[1]) {
        return 1;
    }
    if (a[1] > b[1]) {
        return -1;
    }
    // a must be equal to b
    return 0;
}


type CharsMap = Map<string, number>;

interface ProcessedInput {
    wildcards   : number,
    chars       : CharsMap,
    arranged    : [string, number][]
}

const processInput = (s: InputString): ProcessedInput =>
{
    let chars: Map<string, number>;
    let wildcards: number;

    chars = new Map();
    // count chars and wildcars
    wildcards = 0;
    for (let i = 0; i < s.length; i++) {

        let currChar:string = s[i];

        if (currChar === '*') {
            wildcards++;
            continue;
        }


        if (!chars.has(currChar)) chars.set(currChar, 0)

        let curr:number = chars.get(currChar) || 0;
        chars.set(currChar, curr + 1);
    }

    // sorting the map
    let arranged: [string, number][];
    arranged = [...chars.entries()].sort(sortMaxToMin);


    return {
        wildcards,
        chars,
        arranged
    };
}


interface CanFitParams {
    wildcards: any;
    lastCount: any;
    count: number;
}
/**
 * Test if I can create sets of new chars
 * in a way that:
 * - matches the length of max count of previous char set.
 * - resulting wildcard count===0
 *
 * @param wildcards
 * @param lastCount
 * @param {string[]} arranged
 * @returns {boolean}
 */
const canFit = ({wildcards, lastCount, count}: CanFitParams) => {

    const ARRANGED_COUNT = count;

    // we can
    let isStillRoom = (wildcards / lastCount) + ARRANGED_COUNT < 53

    return (
        (wildcards > 0)
        && ((wildcards % lastCount) === 0)
        && (isStillRoom)
    )
}

/**
 * A balanced string is one in which every character
 * in the string appears an equal number of times as
 * every other character.
 *
 * @param {InputString} s
 * @return {boolean}
 */
const balanced = (s: InputString|string): boolean => {

    let input:ProcessedInput;

    // simple base cases
    if (s.length === 0) return true
    if (s.length === 1) return true
    if (s.length === 2) return true

    // regular algorithm
    input = processInput(<InputString> s);

    // [EDGE] string populated only with wildcards
    if (input.chars.size === 0) return true;

    // previously we check there is at least 1 element.
    let initCount: number;
    let lastCount: number;

    initCount = input.arranged[0][1]; // keep first count
    lastCount = initCount;

    let wildcards   : number;

    wildcards = input.wildcards;

    // try make all char set count equal to the max one, usign wildcards
    for (let i = 0; i < input.arranged.length; i++) {

        let val         : [string, number];
        // @ts-ignore
        let currChar    : string;
        let currCount   : number;



        val       = input.arranged[i];
        currChar  = val[0];
        currCount = val[1];

        // comply then continue with next
        if (currCount === initCount) continue;

        // we know current is smaller, then we get the diff.
        let diff = initCount - currCount;


        if(diff > wildcards){
            // console.log(`char=${currChar}  diff=${diff} wild=${wildcards}`)
            // console.log(`index=${i} array`,arranged)
            return false;
        }
        else {
            // console.log(`diff=${diff} wild=${wildcards} char=${currChar}`)

            // while we have wildcards we use them
            wildcards = wildcards - diff;
            lastCount = currCount + diff;
        }
    }

    const count = input.arranged.length
    const DIVIDE: number = Math.floor(wildcards / input.arranged.length)

    if(canFit({wildcards, lastCount, count})) return true;

    // proceed to deal with remaining wildcards

    // count how many we can add a wildcard to the end of all char sets.
    let increaseWholeTimes:number = 0

    const ARRANGED_COUNT = input.arranged.length;
    for (let i = DIVIDE; i > 0; i--) {

        let div = DIVIDE;

        increaseWholeTimes++;

        console.log(`increaseWholeTimes ${increaseWholeTimes} n=${ARRANGED_COUNT}`,div)

        // we increased the length of the char set & update wildcard available
        lastCount = lastCount + 1;
        wildcards = wildcards - (ARRANGED_COUNT);


        // edge : create tuples from wildcards [**] => [xx]

        // let charsLeft: number = VALID_COUNT - ARRANGED_COUNT

        // we can
        if(canFit({wildcards, lastCount,count})) return true;

    }

    // status
    // console.log(`wildcards=${wildcards} lastCount=${lastCount}`)

    // suppose 1 is left but more chars to add that wildcard
    if(input.arranged.length === VALID_COUNT){
        return (wildcards === 0)
    }

    // standar condition
    return (wildcards===0)
        || (wildcards === lastCount)
        || (wildcards === count)
};

// balanced(<string & { _: "InputString" }>'aaa');

export default balanced;