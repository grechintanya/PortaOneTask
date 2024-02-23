import events from 'events';
import fs from 'fs';
import readline from 'readline';

interface SeqObj {
    start: number;
    length: number;
};

async function processLineByLine(path: string) {
    let array = [];
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(path),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            array.push(parseFloat(line.replace(',', '.')));
        });

        await events.once(rl, 'close');
        return array;

    } catch (err) {
        console.error(err);
    }
};

function calcMedian(arr: number[]) {
    if (arr.length % 2 !== 0) {
        return arr[(arr.length - 1) / 2];
    } else {
        return ((arr[(arr.length - 2) / 2] + arr[arr.length / 2]) / 2);
    }
};


processLineByLine('./../10m.txt').then((numberArr) => {
    let sum = numberArr[0];
    let ascSeq: SeqObj = { start: 0, length: 0 };
    let maxAscSeq: SeqObj = { start: 0, length: 0 };

    let descSeq: SeqObj = { start: 0, length: 0 };
    let maxDescSeq: SeqObj = { start: 0, length: 0 };

    let isAsc = false;
    let isDesc = false;

    for (let i = 1; i < numberArr.length; i++) {
        sum += numberArr[i];
        //The longest ascending sequence
        if (numberArr[i] >= numberArr[i - 1]) {
            if (isAsc) {
                ascSeq.length += 1;
            } else {
                isAsc = true;
                ascSeq.start = i - 1;
                ascSeq.length = 2;
            }
        } else {
            isAsc = false;
            if (ascSeq.length > maxAscSeq.length) {
                maxAscSeq = { start: ascSeq.start, length: ascSeq.length };
            }
            ascSeq = { start: 0, length: 0 };
        }
        //The longest descending sequence
        if (numberArr[i] <= numberArr[i - 1]) {
            if (isDesc) {
                descSeq.length += 1;
            } else {
                isDesc = true;
                descSeq.start = i - 1;
                descSeq.length = 2;
            }
        } else {
            isDesc = false;
            if (descSeq.length > maxDescSeq.length) {
                maxDescSeq = { start: descSeq.start, length: descSeq.length };
            }
            descSeq = { start: 0, length: 0 };
        }

    };

    console.log('maxAscSeq: ', maxAscSeq);
    console.log('The longest ascending sequence: ', numberArr.slice(maxAscSeq.start, maxAscSeq.start + maxAscSeq.length));
    console.log('maxDescSeq: ', maxDescSeq);
    console.log('The longest descending sequence: ', numberArr.slice(maxDescSeq.start, maxDescSeq.start + maxDescSeq.length));

    const average = sum / numberArr.length;
    numberArr.sort((a, b) => a - b);
    const min = numberArr[0];
    const max = numberArr[numberArr.length - 1];
    const median = calcMedian(numberArr);

    console.log('count: ', numberArr.length);
    console.log('mean: ', average);
    console.log('median :', median);
    console.log('minimum :', min);
    console.log('maximum :', max);
});
