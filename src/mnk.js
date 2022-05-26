const slau = require('./slau.js');

export default function mnk_solve(X, Y, pwr){

    const newX = [];
    const n = Y.length; // X >= Y
    const matX = [];
    // Получаем новые значения x их смещением на значение первого элемента
    for(let i = 0; i < X.length; ++i){
        newX.push(X[i] - X[0]);
    }

    for (let i = 0; i < n; ++i){
        matX.push([]);
        for (let j = 0; j <= pwr; ++j){
            matX[i].push(newX[i]**j);
        }
    }
    
    const C = []
    for (let i = 0; i <= pwr; ++i){
        C.push([]);
        for (let k = 0; k <= pwr; ++k){
            let s = 0;
            for (let j = 0; j < n; ++j){
                s += matX[j][i] * matX[j][k];
            }
            C[i].push(s);
        }
    }
    
    const Y1 = []
    for (let i = 0; i <= pwr; ++i){
        let s = 0;
        for (let j = 0; j < n; ++j){
            s += matX[j][i] * Y[j];
        }
        Y1.push(s);
    }
    
    const A = slau.solve(C, Y1);
  
    const res = [];
    for (let i = 0; i < X.length; ++i){
        let s = 0;
    for (let j = 0; j <= pwr; ++j){
            s += newX[i]**j * A[j];
        }
        res.push(s);
    }
    // Вычисляем достоверность аппроксимации
    let R2 = 0
    for(let i = 0; i < n; ++i){
        R2 += Math.abs((Y[i]-res[i])/Y[i]);
    }
    R2 = Number(1 - R2 / n).toFixed(3).replace(/\.?0*$/,'');
        
    return [res, R2];

}