module.exports = {
    solve: function (A, B){
        for (let i = 0; i < A.length; ++i){
            A[i].push(B[i]);
        }
        const n = A.length;
        const X = Array(n).fill(0);

        for (let i = 0; i < n-1; ++i){
            for (let k = i + 1; k < n; ++k){
                const r = (A[k][i]**2 + A[i][i]**2)**0.5;
                const sin = A[k][i] / r;
                const cos = A[i][i] / r;
                for (let j = i; j <= n; ++j){
                    const p = A[i][j];
                    A[i][j] = A[i][j] * cos + A[k][j] * sin;
                    A[k][j] = A[k][j] * cos - p * sin;
                }
            }
        }
        
        X[n-1] = Number((A[n-1][n] / A[n-1][n-1]).toFixed(10).replace(/\.?0*$/,'')); // Длинный аналог round()
        for (let i = n-2; i >= 0; --i){
            let s = 0;
            for (let j = i + 1; j < n; ++j){
                s += A[i][j] * X[j];
            }
            X[i] = Number(((A[i][n] - s) / A[i][i]).toFixed(10).replace(/\.?0*$/,''));
        }
    
        return X;
    }
}