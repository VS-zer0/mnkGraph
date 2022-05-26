import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import mnk_solve from './mnk.js';
// eslint-disable-next-line
import { toBePartiallyChecked } from '@testing-library/jest-dom/dist/matchers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

class App extends React.Component {
    constructor(props) {
    super(props);
    
    // Определяем состояния
    this.state = {
      X: Array(2).fill(0),
      Y: Array(2).fill(0),
      FuncPower: 1,
      Data: Array(0),
      R2: 0
    }
    }
    
    // Кнопка "Построить" запускает решение уравнения регрессии и запись полученных результатов в набор точек для построения
    handlePlot(){
      const X = this.state.X;
      const Y = this.state.Y;
      const FuncPower = this.state.FuncPower;
      
      // Здесь используется написанная ранее функция с методом наименьших квадратов
      const solve = mnk_solve(X, Y, FuncPower);
      const ToPlot = solve[0];
      const R2 = solve[1];
      
      // Составление набора точек для отрисовки
      const newData = [];
      for(let i = 0; i < X.length; ++i){
        newData.push({X:Number(X[i]), Y:Number(Y[i]), Appr:ToPlot[i]});
      }
      newData.sort((a, b) => parseFloat(a.X) - parseFloat(b.X))
      this.setState({Data: newData, R2: R2});
    }
    
    // Обновляет хранимое значение степени уравнения регрессии
    handlePower(){
      const val = document.getElementById("power").value;
      this.setState({FuncPower: val});
    }
    
    // Обновляет хранимое значение в множестве X или множестве Y
    handleChange(XY, name, id){
      const val = document.getElementById("inp_"+name+String(id)).value;
      XY[id] = val;
      name === 'X' ? this.setState({X: XY}) : this.setState({Y: XY});
    }
    
    // Добавляет новое значение в множество X или Y
    handleAdd(XY, name){
      XY.push(0);
      name === 'X' ? this.setState({X: XY}) : this.setState({Y: XY});
    }

    handleRemove(XY, name){
      XY.pop();
      name === 'X' ? this.setState({X: XY}) : this.setState({Y: XY});
    }
    
    render() {
        const X = this.state.X;
        const Y = this.state.Y;
        
        // Отрисовывает поля для ввода значений X
        const Xnodes = X.map((node, id) => {
            return (
                <div key = {id}>
                  <input
                  autoComplete="off" 
                  value={X[id]} 
                  id={'inp_X'+String(id)}
                  onChange={() => this.handleChange(X, 'X', id)}
                  /><br/>
                </div>
            );
        });
        
        // Отрисовывает поля для ввода значений Y
        const Ynodes = Y.map((node, id) => {
          return (
              <div key = {id}>
                <input 
                autoComplete="off" 
                value={Y[id]} 
                id={'inp_Y'+String(id)} 
                onChange={() => this.handleChange(Y, 'Y', id)}
                /><br/>
              </div>
          );
        });
        
        // Кнопка для добавления нового значения
        const Add = (XY, str) => {
          return (
              <button className="add" onClick={() => this.handleAdd(XY, str)}>+</button>
          );
        }
        const Remove = (XY, str) => {
          return (
              <button className="add" onClick={() => this.handleRemove(XY, str)}>─</button>
          );
        }

        // Поле для ввода степени уравнения регрессии
        const Power = () => {
          return (
            <div>
              <input
              autoComplete="off" 
              id="power"
              type="number"
              value={this.state.FuncPower}
              onChange={() => this.handlePower()}
              />
            </div>
          );
        }
      
        // Расстановка составленных выше функций для отрисовки на странице
      return (
        <div className="app">
        <div className="data">
          <div className="data-list">
            X<br/>
            {Add(X, 'X')}{Remove(X, 'X')}
            {Xnodes}
          </div>
          <div className="data-list">
            Y<br/>
            {Add(Y, 'Y')}{Remove(Y, 'Y')}
            {Ynodes}
          </div>
          Степень уравнения
          {Power()}
          <button className="plot" onClick={()=>this.handlePlot()}>Построить</button><br/>
          Достоверность<br/> 
          аппроксимации: {this.state.R2}
        </div>

        <LineChart 
        width={800} 
        height={500}
        data={this.state.Data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5,}}
        >
        {/* Отображение сетки */}
          <CartesianGrid strokeDasharray="3 3" />
          
        {/* Отображение координат по оси X с настройками отображения и границ */}
          <XAxis 
          type="number" 
          dataKey="X" 
          padding={{left: 30, right: 30}} 
          domain={[dataMin => (Math.floor(dataMin/5)*5), dataMax => (Math.ceil(dataMax/5)*5)]}
          tickCount={10}/>
          
          <YAxis 
          domain={[dataMin => (Math.floor((dataMin-1)/5)*5), dataMax => (Math.ceil((dataMax+1)/5)*5)]}/>
          <Tooltip />
          <Legend />
          
        {/* Построение кривой по значениям уравнения регрессии */}
          <Line type="monotone" dataKey="Appr" stroke="#82ca9d" strokeWidth={3}/>
          
        {/* Постоение ломаной по значениям множества Y */}
          <Line type="linear" dataKey="Y" stroke="#000000" strokeWidth={1}/>
        
        </LineChart>
        </div>
      )
    }
}
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);