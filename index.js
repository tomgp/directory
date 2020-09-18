const dsv = require('d3-dsv');
const nunjucks = require('nunjucks');
const fs = require('fs');

const icons = {
    thinking:"💭",
    games:"🎲",
    people:"😀",
    mechanics:"⚙️",
    music:"🎶",
    tech:"🖥",
    design:"🎨",
    transport:"🚞",
    data:"🔢",
    films:"📽",
    commerce:"🛍",
    books:"📚",
    craft:"🖌",
    fiction:"🐉",
    words:"🆒",
}

const data = dsv.csvParse(fs.readFileSync('data.csv','utf-8'));
const template = fs.readFileSync('./template.html.nj','utf-8');
function starSort(a,b){
    if(a.star == b.star){ return 0; }
    if(a.star == true){ return -1; }
    return 1;
}
data.map(d=>{
    d.icons = d.category.split(',').map(d=>icons[d]).join('&nbsp;');
    return d;
});

const useful = data.filter((d) => (d.useful=='true' && d.interesting!='true')).sort(starSort);
const interesting = data.filter((d) => (d.useful!='true' && d.interesting=='true')).sort(starSort);
const both = data.filter((d) => (d.useful=='true' && d.interesting=='true')).sort(starSort);
console.log(both.length);
const html = nunjucks.renderString(template, {both,interesting,useful});

fs.writeFileSync('./index.html',html);