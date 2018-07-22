//

main();

function main() {
   genPartsTable();
}

function genPartsTable() {
   var head = dividePartsByType(parts.HEAD, 'KE,CE,TE'.split(','));
   var core = dividePartsByType(parts.CORE, 'KE,CE,TE'.split(','));
   var arms = dividePartsByType(parts.ARMS, 'KE,CE,TE'.split(','));
   var legs = dividePartsByType(parts.LEGS, '軽二,中二,重二,軽逆,重逆,四脚,タンク'.split(','));

   document.querySelector('#head').innerHTML = genTableDivided(head);
   document.querySelector('#core').innerHTML = genTableDivided(core);
   document.querySelector('#arms').innerHTML = genTableDivided(arms);
   document.querySelector('#legs').innerHTML = genTableDivided(legs);
}

function dividePartsByType(parts, types) {
   var result = [];
   var map = {};
   var i, n;
   var type, idx;

   for (i = 0, n = types.length; i < n; i++) {
      result.push({
         label: types[i],
         data: []
      });
      map[types[i]] = i;
   }

   for (i = 0, n = parts.length; i < n; i++) {
      type = parts[i].TYPE;
      idx = map[type];
      result[idx].data.push(parts[i]);
   }

   return result;
}

// genTable の派生、タイプ別にテーブルを出力
// データ形式は divideLegsByType などで加工したもの
function genTableDivided(data) {
   var html = '';

   for (var i = 0, n = data.length; i < n; i++) {
      html += '<h4>' + data[i].label + '</h4>';
      html += '<div style="overflow-x: scroll;">';
      html += genTable(data[i].data);
      html += '</div>';
   }

   return html;
}

function genTable(data) {
   var html = '';

   var keys = [];
   for (var key in data[0]) {
      keys.push(key);
   }

   html += '<table>';
   // thead
   html += '<thead><tr>';
   for (var i = 0, n = keys.length; i < n; i++) {
      html += '<th>' + keys[i] + '</th>';
   }
   html += '</tr></thead>';

   // tbody
   html += '<tbody>'
   for (var j = 0, m = data.length; j < m; j++) {
      html += '<tr>';
      for (var i = 0, n = keys.length; i < n; i++) {
         html += '<td>' + data[j][keys[i]] + '</td>';
      }
      html += '</tr>';
   }
   html += '</tbody>';

   html += '</table>';

   return html;
}
