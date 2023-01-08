const express = require('express');
const http = require('http');
const cors = require('cors')
const app = express();
const PORT = 3001;

const barracktocapmap={
	level1: "20",
	level2: "50",
	level3: "100",
	level4: "150",
	level5: "200",
	level6: "250",
	level7: "300",
	level8: "350",
	level9: "400",
	level10: "450",
	level11: "500",
	level12: "550",
	level13: "600",
	level14: "650",
	level15: "700",
	level16: "750",
	level17: "800",
	level18: "850",
	level19: "900",
	level20: "950",
	level21: "1000",
	level22: "1100",
	level23: "1200",
	level24: "1300",
	level25: "1400",
	level26: "1500",
	level27: "1600",
	level28: "1800",
	level29: "2000",
	level30: "2500",
	level31: "3000",
	level32: "3250",
	level33: "3500",
	level34: "3750",
	level35: "4000"
};
const royalbarrackcap={
	"1": "100",
	"2": "200",
	"3": "300",
	"4": "400",
	"5": "500",
	"6": "600",
	"7": "700",
	"8": "800",
	"9": "900",
	"10": "1000",
	"11": "1200",
	"12": "1500",
	"13": "2000",
	"14": "2500",
	"15": "3000",
	"16": "4000",
	"17": "5000",
	"18": "7000",
	"19": "9000",
	"20": "11000",
	"21": "13000",
	"22": "15000",
	"23": "18000",
	"24": "21000",
	"25": "24000",
	"26": "27000",
	"27": "30000",
	"28": "34000",
	"29": "38000",
	"30": "45000",
	"31": "55000",
	"32": "60000",
	"33": "65000",
	"34": "70000",
	"35": "75000"
};
const corsOptions ={
   origin:'*', 
   credentials:true,
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use(express.json());
app.post('/calculate', (req, res)=>{ 
    var result=calculate(req.body);
    res.send(result);
})
app.post('/optimize',(req,res)=>{
    var result=optimize(req.body);
    res.send(result);
})

function optimize(data){
    const{selectedOptimizeTroop,selectedOptimizeSpeedup,misc,...rest}=data;
    var capacity=0;
    var facflag=false;
    Object.keys(rest).forEach(key=>{
        if(key.indexOf("level")>=0){
        var numberofbar=Number(rest[key]);
        var cap=Number(barracktocapmap[key]);
        capacity=capacity+numberofbar*cap;
        }
        if(key==="royalbarrack"){
            capacity=Number(royalbarrackcap[rest[key]]);
        }
    });
    var cappercent=Number(rest.tcapacity);
    var speed=Number(rest.trainspeed);
    var time=0;
    switch(selectedOptimizeTroop){
        case 't1melee':
            time = 10;
            break;
        case 't1range':
            time = 9;
            break;
        case 't1siege':
            time = 22;
            break;
        case 't5melee':
            time = 82;
            break;
        case 't5range':
            time = 74;
            break;
        case 't5siege':
            time = 180;
            break;
        case 't6melee':
            time = 115;
            speed=0;
            break;
        case 't6range':
            time = 111;
            speed=0;
            break;
        case 't6siege':
            time = 252;
            speed=0;
            break;
        case 'f1fac':
            time=270;
            facflag=true;
            break;
        case 'f2fac':
            time=300;
            facflag=true;
            break;
        default:
            break;
    }
    if(facflag){
        cappercent=(cappercent*100/capacity)-100;
    }
    var speeduptime=Number(selectedOptimizeSpeedup)*60*60;
    var speedup=capacity*(100+cappercent)*time/((100+speed)*speeduptime);
    var speedup1=Math.ceil(speedup);
    var speedup2=Math.floor(speedup);
    var speed1=(capacity*(100+cappercent)*time/(speeduptime*speedup1))-100;
    var speed2=(capacity*(100+cappercent)*time/(speeduptime*speedup2))-100;
    var cappercent1=((speeduptime*speedup1*(100+speed))/(capacity*time))-100;
    var cappercent2=((speeduptime*speedup2*(100+speed))/(capacity*time))-100;
    speed2=Math.ceil(speed2);
    cappercent1=Math.floor(cappercent1);
    cappercent2=Math.floor(cappercent2);
    var msg="For better results, ";
    if(selectedOptimizeTroop.indexOf('t6')>=0){
        speed2=0;
    }else{
        msg=msg+"either INCREASE your training speed to ATLEAST "+speed2+"% or";
    }
    if((speedup1-speedup)<0.5){
    if(facflag){
        cappercent1=cappercent1-cappercent;
        msg=msg+" INCREASE your training capacity by ATMOST "+cappercent1+"% or";
    }
    else{
    msg=msg+" INCREASE your training capacity to ATMOST "+cappercent1+"% or";
    }
    }
    if(facflag){
        cappercent2=cappercent-cappercent2;
        msg=msg+" DECREASE your training capacity by ATLEAST "+cappercent2+"%.";
    }
    else{
    msg=msg+" DECREASE your training capacity to ATLEAST "+cappercent2+"%.";
    }
    misc.optimizeMsg=msg;
    return {misc};

}
function calculate(data){ 
    const {error,rss,misc,...rest} = data;
    var food=0,wood=0,stone=0,iron=0,silver=0,steel=0,time=0,ftime=0,rtime=0,score=0,might=0,tspeed=0,fspeed=0;
    Object.keys(rest).forEach(key=>{
        var amount=rest[key];
        switch (key) {
            case 't1sword':
                food = food + amount * 16;
                wood = wood + amount * 5;
                stone = stone + amount * 0;
                iron = iron + amount * 35;
                silver = silver + amount * 2;
                time = time + amount * 10;
                score = score + amount * 1;
                might = might + amount * 5;
                break;
            case 't1spear': food = food + amount * 16;
                wood = wood + amount * 24;
                stone = stone + amount * 6;
                iron = iron + amount * 0;
                silver = silver + amount * 3;
                time = time + amount * 10;
                score = score + amount * 1;
                might = might + amount * 5;
                break;
            case 't1cav': food = food + amount * 27;
                wood = wood + amount * 0;
                stone = stone + amount * 17;
                iron = iron + amount * 7;
                silver = silver + amount * 3;
                time = time + amount * 10;
                score = score + amount * 1;
                might = might + amount * 5;
                break;
            case 't1range': food = food + amount * 8;
                wood = wood + amount * 25;
                stone = stone + amount * 5;
                iron = iron + amount * 9;
                silver = silver + amount * 3;
                time = time + amount * 9;
                score = score + amount * 1;
                might = might + amount * 5;
                break;
            case 't1siege': food = food + amount * 6;
                wood = wood + amount * 13;
                stone = stone + amount * 33;
                iron = iron + amount * 2;
                silver = silver + amount * 3;
                time = time + amount * 22;
                score = score + amount * 1;
                might = might + amount * 15;
                break;
            case 't5sword': food = food + amount * 590;
                wood = wood + amount * 160;
                stone = stone + amount * 0;
                iron = iron + amount * 1060;
                silver = silver + amount * 45;
                time = time + amount * 82;
                score = score + amount * 5;
                might = might + amount * 25;
                break;
            case 't5spear': food = food + amount * 615;
                wood = wood + amount * 1165;
                stone = stone + amount * 175;
                iron = iron + amount * 0;
                silver = silver + amount * 60;
                time = time + amount * 82;
                score = score + amount * 5;
                might = might + amount * 25;
                break;
            case 't5cav': food = food + amount * 1290;
                wood = wood + amount * 0;
                stone = stone + amount * 590;
                iron = iron + amount * 150;
                silver = silver + amount * 60;
                time = time + amount * 82;
                score = score + amount * 5;
                might = might + amount * 25;
                break;
            case 't5range': food = food + amount * 220;
                wood = wood + amount * 1115;
                stone = stone + amount * 135;
                iron = iron + amount * 225;
                silver = silver + amount * 30;
                time = time + amount * 74;
                score = score + amount * 5;
                might = might + amount * 45;
                break;
            case 't5siege': food = food + amount * 170;
                wood = wood + amount * 480;
                stone = stone + amount * 1290;
                iron = iron + amount * 45;
                silver = silver + amount * 50;
                time = time + amount * 180;
                score = score + amount * 5;
                might = might + amount * 55;
                break;
            case 't6sword': food = food + amount * 855;
                wood = wood + amount * 224;
                stone = stone + amount * 0;
                iron = iron + amount * 1490;
                silver = silver + amount * 65;
                steel = steel + amount * 13;
                rtime = rtime + amount * 115;
                score = score + amount * 10;
                might = might + amount * 32; 
                break;
            case 't6spear': food = food + amount * 922;
                wood = wood + amount * 1625;
                stone = stone + amount * 248;
                iron = iron + amount * 0;
                silver = silver + amount * 97;
                steel = steel + amount * 12;
                rtime = rtime + amount * 115;
                score = score + amount * 10;
                might = might + amount * 32; 
                break;
            case 't6cav': food = food + amount * 2179;
                wood = wood + amount * 0;
                stone = stone + amount * 761;
                iron = iron + amount * 194;
                silver = silver + amount * 96;
                steel = steel + amount * 10;
                rtime = rtime + amount * 115;
                score = score + amount * 10;
                might = might + amount * 32; 
                break;
            case 't6range': food = food + amount * 285;
                wood = wood + amount * 1613;
                stone = stone + amount * 188;
                iron = iron + amount * 291;
                silver = silver + amount * 35;
                steel = steel + amount * 14;
                rtime = rtime + amount * 111;
                score = score + amount * 10;
                might = might + amount * 58; 
                break;
            case 't6siege': food = food + amount * 214;
                wood = wood + amount * 670;
                stone = stone + amount * 1805;
                iron = iron + amount * 56;
                silver = silver + amount * 70;
                steel = steel + amount * 9;
                rtime = rtime + amount * 252;
                score = score + amount * 10;
                might = might + amount * 70; 
                break;
            case 'faction1': food = food + amount * 1288.7;
                wood = wood + amount * 887.09;
                stone = stone + amount * 808;
                iron = iron + amount * 683.87;
                silver = silver + amount * 67.74;
                ftime = ftime + amount * 270;
                score = score + amount * 20;
                might = might + amount * 75;
                break;
            case 'faction2': food = food + amount * 838.7;
                wood = wood + amount * 1048.39;
                stone = stone + amount * 1014.52;
                iron = iron + amount * 816.13;
                silver = silver + amount * 94.03;
                ftime = ftime + amount * 300;
                score = score + amount * 20;
                might = might + amount * 85;
                break;
            case 'tspeed':
                tspeed=amount;
                break;
            case 'fspeed':
                fspeed=amount;
                break;
            default: break;
        }
    });
    time=time/(1+tspeed/100);
    ftime=ftime/(1+fspeed/100);
    time=time+ftime+rtime;
    time=time*1000*1000;
    var hours= time/(60*60);
    hours=hours.toFixed(2);
    var type=Number(rest.selectedTrainSpeedup);
    rss.food=convertToStandard(food);
    rss.wood=convertToStandard(wood);
    rss.stone=convertToStandard(stone);
    rss.iron=convertToStandard(iron);
    rss.silver=convertToStandard(silver);
    rss.steel=convertToStandard(steel);
    misc.score=convertToStandard(score);
    misc.time=hours;
    misc.speedups=Math.ceil(hours/type);
    misc.might=convertToStandard(might);

    return {rss,misc};
}
function convertToStandard(amount){
    var convertedAmount;
    if(amount>=1000*1000){
        convertedAmount=(amount/(1000*1000)).toFixed(2)+'T';
    }
    else if(amount>=1000){
        convertedAmount=(amount/(1000)).toFixed(2)+'B';
    }
    else{
        convertedAmount=(amount).toFixed(2)+'M';
    }
    return convertedAmount;
}

app.listen(PORT, (error) =>{
	if(!error)
		console.log("Server is Successfully Running, sand App is listening on port "+ PORT)
	else
		console.log("Error occurred, server can't start", error);
	}
);
