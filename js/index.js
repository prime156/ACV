//

main();

function main() {
   loadCondition();

   document.querySelector('#btn_submit').addEventListener('click', function() {
      search();
   });
}

function readCondition() {
   var result = {};

   result.legs_type = document.querySelector('#legs_type').value;

   var keys = 'ap,ke,ce,te,en,weight_cap,stab,legs_move,legs_stab,legs_turn,head_stab,head_cam,head_scan,arms_stab,arms_cap,core_supp'.split(',');

   var int = function(str) {
      return parseInt(str, 10);
   };

   var val = function(id) {
      return document.querySelector('#' + id).value;
   };

   for (var i = 0, n = keys.length; i < n; i++) {
      result[keys[i] + '_min'] = val(keys[i] + '_min') === '' ? 0 : int(val(keys[i] + '_min'));
      result[keys[i] + '_max'] = val(keys[i] + '_max') === '' ? 99999 : int(val(keys[i] + '_max'));
   }

   return result;
}

function saveCondition() {
   if (!localStorage) return;

   var condition = readCondition();

   var db = localStorage;
   db.setItem('condition', JSON.stringify(condition));
};

function loadCondition() {
   if (!localStorage) return;

   var condition = JSON.parse(localStorage.getItem('condition'));

   if (!(condition != null)) return;

   var set = function(id, value) {
      return document.querySelector('#' + id).value = value;
   };

   var legsTypes = {
      '軽二': 0,
      '中二': 1,
      '重二': 2,
      '軽逆': 3,
      '重逆': 4,
      '四脚': 5,
      'タンク': 6
   };

   if (condition.legs_type != null) {
      document.querySelector('#legs_type').selectedIndex = legsTypes[condition.legs_type] | 0;
      toggleDatalist(condition.legs_type);
   };

   var keys = 'ap,ke,ce,te,en,weight_cap,stab,legs_move,legs_stab,legs_turn,head_stab,head_cam,head_scan,arms_stab,arms_cap,core_supp'.split(',');

   for (var i = 0, n = keys.length; i < n; i++) {
      if (condition[keys[i] + '_min'] != null) {
         condition[keys[i] + '_min'] === 0 ? set(keys[i] + '_min', '') : set(keys[i] + '_min', condition[keys[i] + '_min']);
      }

      if (condition[keys[i] + '_max'] != null) {
         condition[keys[i] + '_max'] === 99999 ? set(keys[i] + '_max', '') : set(keys[i] + '_max', condition[keys[i] + '_max']);
      }
   }
};

function search() {
   saveCondition()

   var condition = readCondition();

   var int = function(str) {
      return parseInt(str, 10);
   };

   var sum = function(head, core, arms, legs, param) {
      return int(head[param]) + int(core[param]) + int(arms[param]) + int(legs[param]);
   };

   var calcStab = function(head, legs) {
      // (352 * 安定演算/1000 * 姿勢制御/1000 + 320) * (1 + 総重量/20000)
      var h = head['安定演算性能'] / 1000;
      var l = legs['姿勢制御'] / 1000;
      var w = 1 + (int(legs['重量']) + int(legs['積載量'])) / 20000;

      return Math.round((352 * h * l + 320) * w);
   };

   var label = 'HEAD,CORE,ARMS,LEGS,AP,KE防御,CE防御,TE防御,消費EN,重量,余剰積載,対反上限,射撃安定,格納,移動制御,姿勢制御,旋回性能,安定演算,カメラ,スキャン,EN伝達'.split(',');
   var frame = [];

   for (var ih = 0, nh = parts.HEAD.length; ih < nh; ih++) {
      var h = parts.HEAD[ih];

      if (h['安定演算性能'] < condition.head_stab_min || condition.head_stab_max < h['安定演算性能']) continue;
      if (h['カメラ性能'] < condition.head_cam_min || condition.head_cam_max < h['カメラ性能']) continue;
      if (h['スキャン性能'] < condition.head_scan_min || condition.head_scan_max < h['スキャン性能']) continue;

      for (var ic = 0, nc = parts.CORE.length; ic < nc; ic++) {
         var c = parts.CORE[ic];

         if (c['EN伝達'] < condition.core_supp_min || condition.core_supp_max < c['EN伝達']) continue;

         for (var ia = 0, na = parts.ARMS.length; ia < na; ia++) {
            var a = parts.ARMS[ia];

            if (a['射撃安定性能'] < condition.arms_stab_min || condition.arms_stab_max < a['射撃安定性能']) continue;
            if (a['格納数'] < condition.arms_cap_min || condition.arms_cap_max < a['格納数']) continue;

            for (var il = 0, nl = parts.LEGS.length, _tmp; il < nl; il++) {
               var l = parts.LEGS[il];

               if (l['TYPE'] !== condition.legs_type) continue;
               if (l['移動制御'] < condition.legs_move_min || condition.legs_move_max < l['移動制御']) continue;
               if (l['姿勢制御'] < condition.legs_stab_min || condition.legs_stab_max < l['姿勢制御']) continue;
               if (l['旋回性能'] < condition.legs_turn_min || condition.legs_turn_max < l['旋回性能']) continue;

               var stab = calcStab(h, l);
               if (stab < condition.stab_min || condition.stab_max < stab) continue;

               _tmp = [
                  h['名称'], c['名称'], a['名称'], l['名称'],
                  sum(h, c, a, l, 'AP'),
                  sum(h, c, a, l, 'KE防御'),
                  sum(h, c, a, l, 'CE防御'),
                  sum(h, c, a, l, 'TE防御'),
                  sum(h, c, a, l, '消費EN'),
                  sum(h, c, a, l, '重量'),
                  l['積載量'] - sum(h, c, a, {
                     '重量': 0
                  }, '重量'),
                  stab,
                  a['射撃安定性能'],
                  a['格納数'],
                  l['移動制御'],
                  l['姿勢制御'],
                  l['旋回性能'],
                  h['安定演算性能'],
                  h['カメラ性能'],
                  h['スキャン性能'],
                  c['EN伝達']
               ];

               if (_tmp[4] < condition.ap_min || condition.ap_max < _tmp[4]) continue;
               if (_tmp[5] < condition.ke_min || condition.ke_max < _tmp[5]) continue;
               if (_tmp[6] < condition.ce_min || condition.ce_max < _tmp[6]) continue;
               if (_tmp[7] < condition.te_min || condition.te_max < _tmp[7]) continue;
               if (_tmp[8] < condition.en_min || condition.en_max < _tmp[8]) continue;
               if (_tmp[10] < condition.weight_cap_min || condition.weight_cap_max < _tmp[10]) continue;

               frame.push(_tmp);
            }
         }
      }
   }

   genTable(label, frame);
}

function genTable(label, data) {

   var MAX = 1000;

   if (MAX < data.length) {
      document.querySelector('#sysMessage').value = data.length + '件ヒット。上限値(' + MAX + '件)を超えています。';
   } else {
      document.querySelector('#sysMessage').value = data.length + '件ヒット。';
   }

   var html = '';

   html += '<table><thead>';
   html += '<tr>';
   for (var i = 0, n = label.length; i < n; i++) {
      html += '<th>' + label[i] + '</th>';
   }
   html += '</tr></thead>';

   html += '<tbody>';
   for (var j = 0, m = Math.min(MAX, data.length); j < m; j++) {
      html += '<tr>';
      for (var i = 0, n = label.length; i < n; i++) {
         html += '<td>' + data[j][i] + '</td>';
      }
      html += '</tr>';
   }
   html += '</tbody>';

   document.querySelector('#table').innerHTML = html;
}

function toggleDatalist(type) {
   var map = {
      '軽二': '2LEGS-L',
      '中二': '2LEGS-M',
      '重二': '2LEGS-H',
      '軽逆': 'REVERSE-JOIN-L',
      '重逆': 'REVERSE-JOIN-H',
      '四脚': '4LEGS',
      'タンク': 'TANK'
   };

   var keys = 'legs_move,legs_stab,legs_turn'.split(',');

   for (var i = 0, n = keys.length; i < n; i++) {
      document.querySelector('#' + keys[i] + '_min').setAttribute('list', 'list-' + keys[i] + '-' + map[type]);
      document.querySelector('#' + keys[i] + '_max').setAttribute('list', 'list-' + keys[i] + '-' + map[type]);
   }
};
