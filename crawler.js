//v1

var request = require('request');
var cheerio = require('cheerio');//teste2
var fs = require('fs');

var filename = new Date().getTime() + '.json';

getUfs();

function getCidades(uf){

    request('http://www.cidades.ibge.gov.br' + '/xtras/uf.php?coduf=' + uf.id, function (err, res, body){

        if (err){ 
            console.log('Erro: ' + err);
        }
        else{
            var $ = cheerio.load(body);

            $('#lista_municipios li').each(function(){
                var id = $(this).attr('id').match(/\d+/).toString();

                var cidade = {
                    id: parseInt(id.substring(0, id.length - 2)),
                    nome: $(this).text().trim()
                };

            //node V7
                //if (cidade.nome.indexOf('capital')){         
                    fs.appendFile('execs/' + filename, uf.id + ' - ' + uf.nome + ' (' + uf.sigla + ') - ' + cidade.id + ' - ' + cidade.nome + '\n', (err) => {
                         if (err) throw err;  
                    });
                //}
            });
        }
    });
}

function getUfs(){

    request('http://www.cidades.ibge.gov.br/xtras/home.php', function (err, res, body){

        if (err){ 
            console.log('Erro: ' + err);
        }
        else{
            var $ = cheerio.load(body);

            $('#menu_ufs a').each(function(){        
                
                var uf = { 
                    id: parseInt($(this).attr('href').match(/\d+/)),
                    sigla: $(this).html().trim(),
                    nome: $(this).attr('title').trim() 
                    };

                getCidades(uf);
            });
        }
    });
}