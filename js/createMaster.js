//

function createMaster(parts) {

   var frame = [];
   var label = 'HEAD,CORE,ARMS,LEGS,AP,KE防御,CE防御,TE防御,消費EN,重量,余剰積載'.split(',');

   var int = function(str) {
      return parseInt(str, 10);
   };

   var sum = function(head, core, arms, legs, param) {
      return int(head[param]) + int(core[param]) + int(arms[param]) + int(legs[param]);
   };

   for (var ih = 0, nh = parts.HEAD.length; ih < nh; ih++) {
      for (var ic = 0, nc = parts.CORE.length; ic < nc; ic++) {
         for (var ia = 0, na = parts.ARMS.length; ia < na; ia++) {
            for (var il = 0, nl = parts.LEGS.length; il < nl; il++) {

               var h = parts.HEAD[ih];
               var c = parts.CORE[ic];
               var a = parts.ARMS[ia];
               var l = parts.LEGS[il];

               frame.push([
                  ih, ic, ia, il,
                  sum(h, c, a, l, 'AP'),
                  sum(h, c, a, l, 'KE防御'),
                  sum(h, c, a, l, 'CE防御'),
                  sum(h, c, a, l, 'TE防御'),
                  sum(h, c, a, l, '消費EN'),
                  sum(h, c, a, l, '重量'),
                  l['積載量'] - sum(h, c, a, {
                     '重量': 0
                  }, '重量')
               ]);
            }
         }
      }
   }

   var master = {
      label: label,
      frame: frame
   }

   return master;
}
