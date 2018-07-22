//

const fs = require('fs');


eval(fs.readFileSync('../parts.js', 'utf8'));
eval(fs.readFileSync('../createMaster.js', 'utf8'));

const master = createMaster(parts);

console.log(master.label);
console.log(master.frame[0]);

// HEAD,CORE,ARMS,LEGS,AP,KE防御,CE防御,TE防御,消費EN,重量,余剰積載
console.log('AP', 1203 + 7012 + 2598 + 13842);
console.log('余剰積載', 4431 - 190 - 722 - 522);

fs.writeFileSync('./master.json', JSON.stringify(master), 'utf8');

/*

head: {
   "No": "0",
   "名称": "D/UHD-10",
   "TYPE": "KE",
   "AP": "1203",
   "重量": "190",
   "消費EN": "979",
   "KE防御": "81",
   "CE防御": "5",
   "TE防御": "13",
   "安定演算性能": "768"
}

core: {
   "No": "0",
   "名称": "D/UCR-10",
   "TYPE": "KE",
   "AP": "7012",
   "重量": "722",
   "消費EN": "805",
   "KE防御": "654",
   "CE防御": "120",
   "TE防御": "125"
}

arms: {
   "No": "0",
   "名称": "D/UAM-10",
   "TYPE": "KE",
   "AP": "2598",
   "重量": "522",
   "消費EN": "1101",
   "KE防御": "254",
   "CE防御": "43",
   "TE防御": "56",
   "射撃安定性能": "125",
   "格納数": "-"
}

legs: {
   "No": "0",
   "名称": "ULG-10/L",
   "TYPE": "軽二",
   "AP": "13842",
   "重量": "1297",
   "消費EN": "682",
   "KE防御": "725",
   "CE防御": "149",
   "TE防御": "284",
   "積載量": "4431",
   "移動制御": "6532",
   "姿勢制御": "836",
   "旋回性能": "9136"
}
*/
