(function (ns){

  ns.accentMap = {
    'á': 'a', 'à': 'a', 'â': 'a',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'ç': 'c',
    'î': 'i', 'ï': 'i',
    'ô': 'o', 'ö': 'o',
    'ù': 'u', 'û': 'u', 'ü': 'u'
  };
  ns.clean_accents = function(term){
    var ret = '';
    for (var i = 0; i < term.length; i++)
      ret += ns.accentMap[term.charAt(i)] || term.charAt(i);
    return ret;
  };

  ns.datize = function(date_str){
    date_str = date_str.trim()
      .replace(/^(\d+)\/(\d+)\/(\d+)$/, '$3-$2-$1');
    return new Date(date_str);
  };

  ns.deputes = {};
  ns.downloadDeputes = function(){
    $.getJSON('http://www.nosdeputes.fr/deputes/enmandat/json', function(data){
      data.deputes.forEach(function(dep){
        var d = dep.depute;
        d.display = d.prenom + ' ' + d.nom_de_famille + ' (' + d.groupe_sigle + ')';
        if (ns.deputes[d.id] == undefined)
          ns.deputes[d.id] = d;
        else for (var key in d)
          ns.deputes[d.id][key] = d[key];
      });
      ns.deputesAr = Object.keys(ns.deputes).map(function(d){
        return ns.deputes[d];
      });
      ns.dep = ns.deputesAr[parseInt(Math.random() * ns.deputesAr.length)];
      ns.buildSelectMenu();
    });
  };

  ns.buildSelectMenu = function(){
    $('#deputes').autocomplete({
      source: function(request, response){
        var matcher = new RegExp($.ui.autocomplete.escapeRegex(ns.clean_accents(request.term)), 'i');
        response($.grep(
          ns.deputesAr.sort(function(a, b){
            return (a.nom_de_famille > b.nom_de_famille ? 1 : -1)
          }).map(function(d){
            return {
              label: d.display,
              value: d.display,
              dep: d
            };
          }),
          function(d){
            return matcher.test(ns.clean_accents(d.label));
          }
        ));
      },
      select: function(event, ui){
        event.preventDefault();
        ns.dep = ui.item.dep;
        ns.displayMP();
      }
    });

    $('#loader').hide();
    $('#content').show();
    ns.displayMP();
  };

  ns.annees = function(date){
    var now = new Date();
    var age = now.getFullYear() - (date instanceof Date ? date : new Date(date)).getFullYear();
    return age + ' an' + (age > 1 ? 's' : '');
  };

  ns.displayMP = function(){
    var sexe = 'Député' + (ns.dep.sexe === 'F' ? 'e' : ''),
      twitter = (ns.dep.twitter ? '@' + ns.dep.twitter : ''),
      plural = (ns.dep.nb_mandats > 2 ? 's' : ''),
      extra_mandats = '<h2>A' + (ns.dep.nb_mandats > 1 ? '' : 'ucun a') + 'utre' + plural + ' mandat' + plural + (ns.dep.nb_mandats > 1 ? ' :</h2><ul>' : '</h2>');

    ns.dep.autres_mandats.forEach(function(m){
      m = m["mandat"].split(' / ');
      var fonction = (/^(pr[eé]sid|maire)/i.test(m[2]) ? '<b>' + m[2] + '</b>' :  m[2]);
      extra_mandats += '<li>' + m[0] + ' &mdash; ' + m[1] + ' (' + fonction + ')</li>';
    });
    if (ns.dep.nb_mandats > 1) extra_mandats += '</ul>'

    if (!ns.dep.debut_mandat) {
      ns.dep.debut_mandat = ns.datize(ns.dep.mandat_debut);
      ns.dep.anciens_mandats.filter(function(a){
        return a['mandat'].indexOf(' /  / ') === -1;
      }).map(function(a){
        return a['mandat']
          .split(' / ')
          .splice(0, 2)
          .map(function(da){
            return ns.datize(da.trim());
          });
      }).sort(function(a, b){
        return (a[0] < b[0] ? 1 : -1);
      }).forEach(function(a){
        if ((ns.dep.debut_mandat - a[1])/86400000 < 65)
          ns.dep.debut_mandat = a[0];
      });
    }

    $('#name').text(ns.dep.nom);
    $('#descr').text(sexe + ' de TODO ' + ns.dep.nom_circo);
    $('#details').html(ns.annees(ns.dep.date_naissance) + ' - ' + sexe.toLowerCase() + ' depuis ' + ns.annees(ns.dep.debut_mandat) + '<br>' + ns.dep.profession.replace('declare', 'déclaré'));
    $('#extra').html(twitter);
    $('#logo img').attr('src', 'logos/AN/' + ns.dep.groupe_sigle.toUpperCase() + '.png');
    $('#widget').attr('src', 'http://www.nosdeputes.fr/widget14/' + ns.dep.slug + '?iframe=true&width=950');
    $('#autres').html(extra_mandats);
  };

  ns.setResponsive = function(){
    $('#right').width($(window).width() - $('#incrust').width() - $('#right').css('padding-left').replace('px', '') - 1);
    $('#autres').height($(window).height() - $('#top').height() - 1);
  };

  $(document).ready(function(){
    ns.setResponsive();
    ns.downloadDeputes();
  });
  $(window).resize(ns.setResponsive);

})(window.directparl = window.directparl || {});
