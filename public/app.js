import {API_KEY} from './env.js'

const prefectures_url = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';
const population_url = 'https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=';

let chart = Highcharts.chart('graph', {
    title: {
        text: ''
    },
    xAxis: {
        title:{
            text: '年度'
        },
        categories: [1960, 1965, 1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040, 2045]
    },
    yAxis: {
        title: {
            text: '人口数'
        }
    },
    series: []
});

async function get_prefectures(){
    const res = await fetch(prefectures_url, {headers: {"x-api-key": API_KEY}});
    const res_json = await res.json();
    const prefectures = res_json.result;
    for(let i = 0; i < prefectures.length; i++){
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('prefCode', prefectures[i].prefCode);
        checkbox.setAttribute('prefName', prefectures[i].prefName);
        checkbox.onclick = function(){
            check_checkbox(checkbox, prefectures[i].prefCode, prefectures[i].prefName);
        }
        let label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(prefectures[i].prefName));
        document.getElementById('prefectures').appendChild(label);
    }
}

function check_checkbox(checkbox, prefCode, prefName){
    if(checkbox.checked){
        add_graph(prefCode, prefName);
    }else{
        delete_graph(prefName);
    }
}

async function add_graph(prefCode, prefName){
    const res = await fetch(population_url + prefCode, {headers: {"x-api-key": API_KEY}});
    const res_json = await res.json();
    const population = res_json.result;
    let population_data = []
    for(let i = 0; i < population.data[0].data.length; i++){
        population_data.push(population.data[0].data[i].value);
    }
    chart.addSeries({
        name: prefName,
        data: population_data
    });
}

function delete_graph(prefName){
    for(let i = 0; i < chart.series.length; i++){
        if(chart.series[i].name == prefName){
            chart.series[i].remove();
        }
    }
}

window.onload = get_prefectures();