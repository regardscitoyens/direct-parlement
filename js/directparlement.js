/* TODO
 - improve logos
 - ministres ?
*/
(function (ns){

  ns.accentMap = {
    'á': 'a', 'à': 'a', 'â': 'a',
    'À': 'a', 'Â': 'a',
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'É': 'e', 'È': 'e', 'Ê': 'e', 'Ë': 'e',
    'ç': 'c', 'Ç': 'c',
    'î': 'i', 'ï': 'i',
    'Î': 'i', 'Ï': 'i',
    'ô': 'o', 'ö': 'o',
    'Ô': 'o', 'Ö': 'o',
    'ù': 'u', 'û': 'u', 'ü': 'u',
    'Ù': 'u', 'Û': 'u', 'Ü': 'u'
  };
  ns.clean_accents = function(term){
    var ret = '';
    for (var i = 0; i < term.length; i++)
      ret += ns.accentMap[term.charAt(i)] || term.charAt(i);
    return ret;
  };

  ns.departements = {
     "Ain": "de l'",
     "Aisne": "de l'",
     "Allier": "de l'",
     "Alpes-de-Haute-Provence": "des ",
     "Alpes-Maritimes": "des ",
     "Ardèche": "de l'",
     "Ardennes": "des ",
     "Ariège": "d'",
     "Aube": "de l'",
     "Aude": "de l'",
     "Aveyron": "de l'",
     "Bas-Rhin": "du ",
     "Bouches-du-Rhône": "des ",
     "Calvados": "du ",
     "Cantal": "du ",
     "Charente": "de ",
     "Charente-Maritime": "de ",
     "Cher": "du ",
     "Corrèze": "de ",
     "Corse-du-Sud": "de ",
     "Côte-d'Or": "de ",
     "Côtes-d'Armor": "des ",
     "Creuse": "de la ",
     "Deux-Sèvres": "des ",
     "Dordogne": "de la ",
     "Doubs": "du ",
     "Drôme": "de la ",
     "Essonne": "de l'",
     "Eure": "de l'",
     "Eure-et-Loir": "d'",
     "Finistère": "du ",
     "Français établis hors de France": "des ",
     "Gard": "du ",
     "Gers": "du ",
     "Gironde": "de la ",
     "Guadeloupe": "de ",
     "Guyane": "de ",
     "Haut-Rhin": "du ",
     "Haute-Corse": "de ",
     "Haute-Garonne": "de la ",
     "Haute-Loire": "de la ",
     "Haute-Marne": "de la ",
     "Haute-Saône": "de la ",
     "Haute-Savoie": "de ",
     "Haute-Vienne": "de la ",
     "Hautes-Alpes": "des ",
     "Hautes-Pyrénées": "des ",
     "Hauts-de-Seine": "des ",
     "Hérault": "de l'",
     "Ille-et-Vilaine": "d'",
     "Indre": "de l'",
     "Indre-et-Loire": "de l'",
     "Isère": "de l'",
     "Jura": "du ",
     "Landes": "des ",
     "Loir-et-Cher": "du ",
     "Loire": "de la ",
     "Loire-Atlantique": "de ",
     "Loiret": "du ",
     "Lot": "du ",
     "Lot-et-Garonne": "du ",
     "Lozère": "de la ",
     "Maine-et-Loire": "du ",
     "Manche": "de la ",
     "Marne": "de la ",
     "Martinique": "de ",
     "Mayenne": "de la ",
     "Mayotte": "de ",
     "Meurthe-et-Moselle": "de ",
     "Meuse": "de la ",
     "Morbihan": "du ",
     "Moselle": "de la ",
     "Nièvre": "de la ",
     "Nord": "du ",
     "Nouvelle-Calédonie": "de la ",
     "Oise": "de l'",
     "Orne": "de l'",
     "Paris": "de ",
     "Pas-de-Calais": "du ",
     "Polynésie Française": "de la ",
     "Puy-de-Dôme": "du ",
     "Pyrénées-Atlantiques": "des ",
     "Pyrénées-Orientales": "des ",
     "Réunion": "de la ",
     "Rhône": "du ",
     "Saint-Pierre-et-Miquelon": "de ",
     "Saint-Barthélemy et Saint-Martin": "de ",
     "Saône-et-Loire": "de ",
     "Sarthe": "de la ",
     "Savoie": "de ",
     "Seine-et-Marne": "de ",
     "Seine-Maritime": "de ",
     "Seine-Saint-Denis": "de ",
     "Somme": "de la ",
     "Tarn": "du ",
     "Tarn-et-Garonne": "du ",
     "Territoire-de-Belfort": "du ",
     "Territoire de Belfort": "du ",
     "Val-d'Oise": "du ",
     "Val-de-Marne": "du ",
     "Var": "du ",
     "Vaucluse": "du ",
     "Vendée": "de ",
     "Vienne": "de la ",
     "Vosges": "des ",
     "Wallis-et-Futuna": "de ",
     "Yonne": "de l'",
     "Yvelines": "des"
  };

  ns.datize = function(date_str){
    date_str = date_str.trim()
      .replace(/^(\d+)\/(\d+)\/(\d+)$/, '$3-$2-$1');
    return new Date(date_str);
  };

  ns.deputes = {};
  ns.deputesAr = [];
  ns.matchDeputes = function(request, response){
    var matcher = new RegExp($.ui.autocomplete.escapeRegex(ns.clean_accents(request.term || request)), 'i');
    var res = $.grep(
      ns.deputesAr.sort(function(a, b){
        return (a.nom_de_famille > b.nom_de_famille ? 1 : -1)
      }).map(function(d){
        return {
          label: d.display,
          value: d.display,
          depid: d.id
        };
      }),
      function(d){
        return matcher.test(ns.clean_accents(d.label));
      }
    );
    if (response) response(res);
    else return res;
  };

  ns.downloadDeputes = function(){
    $.getJSON('http://www.nosdeputes.fr/deputes/enmandat/json', function(data){
      data.deputes.forEach(function(dep){
        var d = dep.depute;
        d.display = d.prenom + ' ' + d.nom_de_famille + ' (' + d.groupe_sigle + ')';
        if (!ns.deputes[d.id]) ns.deputes[d.id] = d;
        else for (var key in d) ns.deputes[d.id][key] = d[key];
      });
      ns.deputesAr = Object.keys(ns.deputes).map(function(d){
        return ns.deputes[d];
      });
      $('#listdeputes').autocomplete({
        source: ns.matchDeputes,
        select: function(event, ui){
          event.preventDefault();
          ns.displayMP(ui.item.depid);
        }
      });
  
      $('#loader').hide();
      $('#content').show();
      ns.randomMP();
    });
  };

  ns.annees = function(date){
    var now = new Date();
    var age = now.getFullYear() - (date instanceof Date ? date : new Date(date)).getFullYear();
    return age + ' an' + (age > 1 ? 's' : '');
  };

  ns.displayMP = function(depid){
    if (ns.dep && depid === ns.dep.id) return;
    ns.dep = ns.deputes[depid];
    var sexe = 'Député' + (ns.dep.sexe === 'F' ? 'e' : ''),
      twitter = (ns.dep.twitter ? '@' + ns.dep.twitter : ''),
      plural = (ns.dep.nb_mandats > 2 ? 's' : ''),
      extra_mandats = '<h2>A' + (ns.dep.nb_mandats > 1 ? '' : 'ucun a') + 'utre' + plural + ' mandat' + plural + (ns.dep.nb_mandats > 1 ? ' :</h2><ul>' : '</h2>');

    ns.dep.autres_mandats.forEach(function(m){
      m = m['mandat'].split(' / ');
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
    ns.dep.profession = (ns.dep.profession ? ns.dep.profession.replace('declare', 'déclaré').replace(/,.*$/, '') : 'Sans profession déclarée');

    $('#name').text(ns.dep.nom);
    $('#descr').text(sexe + ' ' + ns.departements[ns.dep.nom_circo] + ns.dep.nom_circo);
    $('#details').html(ns.annees(ns.dep.date_naissance) + ' - ' + sexe.toLowerCase() + ' depuis ' + ns.annees(ns.dep.debut_mandat) + '<br>' + ns.dep.profession);
    $('#extra').html(twitter);
    $('#groupe img').attr('src', 'logos/AN/' + ns.dep.groupe_sigle.toUpperCase() + '.png');
    $('#widget').attr('src', 'http://www.nosdeputes.fr/widget14/' + ns.dep.slug + '?iframe=true&width=950');
    $('#autres').html(extra_mandats);
  };

  ns.randomMP = function(){
    ns.displayMP(Object.keys(ns.deputes)[parseInt(Math.random() * ns.deputesAr.length)]);
  };

  ns.getPDFPages = function(pageN){
    pageN = pageN || 1;
    ns.pdf.getPage(pageN).then(function(page){
      page.getTextContent().then(function(textPDF){
        ns.pdfText += ' ' + textPDF.items.map(function(i){
          return i.str;
        }).join('');
        if (pageN < ns.pdf.numPages)
          ns.getPDFPages(pageN + 1);
        else {
          var date = ns.pdfText.match(/LA SÉANCE (\S+ \d+ \S+ \d+ Séance de \d+ HEURES( \d+)?)/)[1],
            current = null,
            odd = false,
            texte = '',
            readtexte = false,
            readcontext = false,
            context = '',
            inscrit = '',
            FJ = '';
          ns.pdfText.replace(/((S?\/?Adt n° \d+ (\([\w. ]+\) )?d[eu] )?(Gouvernement|M[.me]+) |TITRE|ARTICLE|AVANT|APRÈS|[\- ] |I[nN][sS][cC][rR][iI][tT])/g, '\n$1')
            .replace(/(\d+’)/g, '$1\n')
            .split('\n').forEach(function(l){
              l = l.trim();
              if (!l) return;
              parl = l.match(/((S?\/?Adt n° (\d+) (\([\w. ]+\) )?)d[eu] )?(Gouvernement|M[.me]+ (.*?([A-ZÀÂÉÈÊËÎÏÔÖÙÛÜÇ\-]{3,} ?)+))(, (\D*))?( *(\d+’))?/);
              if (l === 'GOUVERNEMENT')
                parl = [,,,,,,'Gouvernement']
              if (parl){
                var pid = '',
                  name = parl[6] || parl[5],
                  parls = ns.matchDeputes(name);
                if (!parls.length) console.log('WARNING: could not find MP', parl);
                else if (parls.length > 1) {
                  var good = parls.filter(function(p){
                    return ~(ns.clean_accents(p.label.toLowerCase()).indexOf(' ' + ns.clean_accents(name.toLowerCase())));
                  });
                  if (good && good.length === 1) {
                    name = good[0].label;
                    pid = good[0].depid;
                  } else console.log('WARNING: multiple parls found for MP', parl, parls);
                } else {
                  name = parls[0].label;
                  pid = parls[0].depid;
                }
                if (pid != current) {
                  current = pid;
                  odd = !odd;
                }
                if (readtexte) {
                  readtexte = false;
                  FJ += '<tr class="title"><td colspan="4">' + texte + '</td></tr>';
                }
                if (inscrit && parl[2]) inscrit = '';
                var meta = inscrit || parl[2] || (parl[9] ? parl[9].replace('cion', 'com') : '');
                FJ += '<tr' + (odd ? ' class="odd"' : '') + 
                              (pid ? ' style="cursor:pointer" onClick="directparl.displayMP(' + pid + ')"' : '' ) + '>' +
                        '<td>' + name + '</td>' +
                        '<td' + (context ? '>' + context + '</td><td' : ' colspan="2"') + '>' + meta + '</td>' +
                        '<td>' + (parl[11] || '') + '</td>' +
                      '</tr>';
              } else if (l.match(/^(A(PR[EÈ]S|VANT|RTICLE)|TITRE)/)){
                l = l.toLowerCase().replace(/article/, 'art.');
                if (readcontext){
                  readcontext = false;
                  context += l;
                } else{
                  context = l;
                  if (~l.indexOf("l'")) readcontext = true;
                }
              } else if (l.match(/^inscrit/i)){
                inscrit = "inscrit";
              } else if (l.match(/^- [A-ZÀÂÉÈÊËÎÏÔÖÙÛÜÇ]{3,}/) || (readtexte && l.match(/^([A-ZÀÂÉÈÊËÎÏÔÖÙÛÜÇ\- :,']+|\(.*\))$/))){
                context = '';
                inscrit = false;
                readcontext = false;
                if (!l.indexOf('- ')) {
                  readtexte = true;
                  texte = l.replace(/^- /, '');
                } else texte += ' ' + l;
              } else {
                //console.log(l);
              }
            });
          $('#FJ h3').text(date);
          $('#FJ table').html(FJ);
          $('#loaderFJ').hide();
          $('#FJloaded').show();
        }
      });
    });
  };

  ns.loadFJ = function(){
    $('#FJloaded').hide();
    $('#loaderFJ').show();
    PDFJS.getDocument('http://www.nosdeputes.fr/feuille-jaune/last.pdf')
    .then(function(pdf){
      ns.pdf = pdf;
      ns.pdfText = '';
      ns.getPDFPages();
    });
  };
 
  ns.setResponsive = function(){
    $('#right').width($(window).width() - $('#incrust').width() - $('#right').css('padding-left').replace('px', '') - 3);
    $('#bottom').height($(window).height() - $('#top').height() - 3);
  };

  $(window).resize(ns.setResponsive);

  $(document).ready(function(){
    ns.setResponsive();
    ns.downloadDeputes();
    ns.loadFJ();
  });

})(window.directparl = window.directparl || {});
