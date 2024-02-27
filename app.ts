import events from 'events';
import fs from 'fs';
import readline from 'readline';

interface SeqObj {
    start: number;
    length: number;
};

function calcMedian(sortedArr: number[]) {
    const len = sortedArr.length;
    if (len % 2 !== 0) {
        return sortedArr[(len - 1) / 2];
    } else {
        return ((sortedArr[(len - 2) / 2] + sortedArr[len / 2]) / 2);
    }
};

async function processingNumberFile(path: string) {
    let array = [];
    let sum = 0;
    let count = 0;
    let ascSeq: SeqObj = { start: 0, length: 0 };
    let maxAscSeq: SeqObj = { start: 0, length: 0 };

    let descSeq: SeqObj = { start: 0, length: 0 };
    let maxDescSeq: SeqObj = { start: 0, length: 0 };

    let isAsc = false;
    let isDesc = false;
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(path),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            let number = parseFloat(line.replace(',', '.'));
            if (count > 0) {
                //The longest ascending sequence
                if (number >= array[count - 1]) {
                    if (isAsc) {
                        ascSeq.length += 1;
                    } else {
                        isAsc = true;
                        ascSeq.start = count - 1;
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
                if (number <= array[count - 1]) {
                    if (isDesc) {
                        descSeq.length += 1;
                    } else {
                        isDesc = true;
                        descSeq.start = count - 1;
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
            array.push(number);
            sum += number;
            count += 1;
        });

        await events.once(rl, 'close');

        console.log('maxAscSeq: ', maxAscSeq);
        console.log('The longest ascending sequence: ', array.slice(maxAscSeq.start, maxAscSeq.start + maxAscSeq.length));
        console.log('maxDescSeq: ', maxDescSeq);
        console.log('The longest descending sequence: ', array.slice(maxDescSeq.start, maxDescSeq.start + maxDescSeq.length));

        const average = sum / (count);
        array.sort((a, b) => a - b);
        const min = array[0];
        const max = array[count - 1];
        const median = calcMedian(array);

        console.log('count: ', count);
        console.log('mean: ', average);
        console.log('median :', median);
        console.log('minimum :', min);
        console.log('maximum :', max);

    } catch (err) {
        console.error(err);
    }
};

processingNumberFile('./../10m.txt');
