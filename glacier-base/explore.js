const svg = d3.select("#scene");
const $ = id => document.getElementById(id);
const river = [[-32,10,5],[3,4,13],[34,1,44],[68,-2,36],[95,-4,62],[125,-6,80],[176,-9,69],[214,-12,97]];
const ridge = [[-220,69,-55],[-170,63,-42],[-130,48,-63],[-100,32,-41],[-75,26,-15],[-52,21,-16],river[0]];
const widths = [10,25,33,34,32,24,5];
const actors = [
  {id:"station",name:"Blatten bei Naters",point:[75,39,-64],anchor:river[3],title:"Massa gauging station",body:"FOEN station 2161 measures discharge in the Massa. Its readings describe water passing the gauge from across the catchment.",link:"River monitoring",connection:"The gauge records flow in the Massa at Blatten bei Naters."},
  {id:"power",name:"Electra-Massa",point:[134,27,146],anchor:river[6],title:"Electra-Massa",body:"This storage power plant uses water held behind the Gebidem dam. Select the relationship to trace its water supply.",link:"Reservoir supply",connection:"The dam impounds the Massa. Stored water supplies the Electra-Massa hydropower plant."}
];
let yaw=-0.2, pitch=0.52, zoom=1, selected="glacier", period=1, month=6;
const project=([x,y,z])=>{
  const side=x*Math.cos(yaw)-z*Math.sin(yaw), depth=x*Math.sin(yaw)+z*Math.cos(yaw);
  return [377+side*1.35*zoom,222+(depth*Math.sin(pitch)-y*Math.cos(pitch))*1.35*zoom];
};
const curve=d3.line().curve(d3.curveCatmullRom.alpha(.5));
const path=points=>curve(points.map(project));
function group(id,label){
  const g=svg.append("g").attr("class","item").attr("role","button").attr("tabindex",0).attr("aria-label",label);
  const choose=()=>{selected=id;if(id==="river") $("metric").selectedIndex=1;if(id==="glacier") $("metric").selectedIndex=0;render();svg.selectAll(".item").filter(function(){return this.getAttribute("aria-label")===label}).node()?.focus({preventScroll:true})};
  g.on("click",choose).on("keydown",()=>{if(["Enter"," "].includes(d3.event.key)){d3.event.preventDefault();choose()}});
  return g;
}
function line(g,points,color,width,dash){
  return g.append("path").attr("d",path(points)).attr("fill","none").attr("stroke",color).attr("stroke-width",width).attr("stroke-linecap","round").attr("stroke-dasharray",dash||null);
}
function label(g,point,title,dy){
  const [x,y]=project(point);g.append("text").attr("x",x).attr("y",y+dy).attr("text-anchor","middle").text(title);
}
function draw(){
  svg.selectAll("*").remove();
  const grid=svg.append("g").attr("opacity",.37);
  for(let i=-200;i<=200;i+=40){
    line(grid,[[i,-30,-125],[i,-30,165]],"#a8bdb0",.8);
    line(grid,[[-225,-30,i],[230,-30,i]],"#a8bdb0",.8);
  }
  const stream=group("river","Massa river");
  line(stream,river,"transparent",22);
  line(stream,river,selected==="river"?"#134d69":"#287f92",($("metric").selectedIndex?3+Math.sqrt(flow[month]):6)*zoom);
  label(stream,river[5],"Massa river",25);
  const glacier=group("glacier","Grosser Aletschgletscher");
  const edge=(p,i,factor)=>[p[0],p[1]+(1-Math.abs(factor))*widths[i]*.43,p[2]+factor*widths[i]];
  for(let i=0;i<ridge.length-1;i++){
    for(let j=0;j<4;j++){
      const f=-1+j*.5, quad=[edge(ridge[i],i,f),edge(ridge[i+1],i+1,f),edge(ridge[i+1],i+1,f+.5),edge(ridge[i],i,f+.5)];
      glacier.append("polygon").attr("points",quad.map(p=>project(p).join(",")).join(" ")).attr("fill",["#94c5cc","#c6e9e8","#effcfa","#afd7df"][j]).attr("stroke","#588d96").attr("stroke-width",.7);
    }
  }
  label(glacier,ridge[2],"Great Aletsch Glacier",-22);
  if($("actors").checked) actors.forEach(a=>{
    if($("links").checked){
      const id=a.id+"-link", link=group(id,a.link);
      line(link,[a.anchor,a.point],"transparent",17);
      line(link,[a.anchor,a.point],selected===id?"#99401b":"#ab6437",3,"5 4");
    }
    const g=group(a.id,a.name),[x,y]=project(a.point);
    g.append("circle").attr("cx",x).attr("cy",y).attr("r",selected===a.id?10:8).attr("fill","#b96c3e").attr("stroke","#fff5dc").attr("stroke-width",3);
    label(g,a.point,a.name,-14);
  });
}
function details(){
  const row=ice[period];let title,body,source,credit;
  if(selected==="glacier"){
    title="Great Aletsch Glacier";body=row.start+" – "+row.end+". The glacier-wide mass balance was "+row.value.toFixed(3)+" m water equivalent. A negative balance means a net loss of snow and ice over the measurement period.";
    source="https://doi.glamos.ch/pubs/annualrep/annualrep_"+row.year+".pdf";credit="GLAMOS annual report";
  }else if(selected==="river"){
    title="Massa river";body=months[month]+" · "+flow[month]+" m³/s. Average discharge for this month over 1931–2025 at Blatten bei Naters. It includes water from the whole catchment.";
    source=sources.station;credit="FOEN station 2161";
  }else{
    const a=actors.find(a=>selected.startsWith(a.id)),isLink=selected.endsWith("-link");
    title=isLink?a.link:a.title;body=isLink?a.connection:a.body;source=sources[a.id];credit=a.id==="power"?"Alpiq":"FOEN station 2161";
  }
  $("info").replaceChildren();
  const info=d3.select("#info");info.append("h3").text(title);info.append("p").text(body);info.append("a").attr("href",source).attr("target","_blank").attr("rel","noopener").text(credit+" ↗");
}
function timeline(){
  const water=$("metric").selectedIndex===1, labels=water?months:ice.map(r=>r.period);
  const buttons=d3.select("#periods").selectAll("button").data(labels);
  buttons.exit().remove();buttons.enter().append("button").merge(buttons).text(d=>d).attr("aria-pressed",(d,i)=>i===(water?month:period)).on("click",(d,i)=>{if(water)month=i;else period=i;selected=water?"river":"glacier";render()});
  $("result").textContent=water?months[month]+" · "+flow[month]+" m³/s   |   Monthly mean, 1931–2025. River stroke width indicates discharge.":ice[period].period+" · "+ice[period].value.toFixed(3)+" m water equivalent   |   Annual glacier-wide balance. Geometry is schematic.";
}
function render(){draw();details();timeline()}
$("actors").onchange=()=>{if(!$("actors").checked && !["river","glacier"].includes(selected))selected="glacier";render()};
$("links").onchange=()=>{if($("links").checked)$("actors").checked=true;else if(selected.endsWith("-link"))selected="river";render()};
$("metric").onchange=()=>{selected=$("metric").selectedIndex?"river":"glacier";render()};
$("reset").onclick=()=>{yaw=-.2;pitch=.52;zoom=1;draw()};
svg.call(d3.drag().clickDistance(4).on("drag",()=>{yaw+=d3.event.dx*.009;pitch=Math.max(.15,Math.min(1.32,pitch+d3.event.dy*.008));draw()}));
svg.node().addEventListener("wheel",e=>{e.preventDefault();zoom=Math.max(.65,Math.min(1.7,zoom*Math.exp(-e.deltaY*.001)));draw()},{passive:false});
render();
