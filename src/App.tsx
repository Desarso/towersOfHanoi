import { onMount, type Component, createSignal } from 'solid-js';
import './styles.css';



class Circle {
  self: HTMLElement;
  index: number;
  constructor(self: HTMLElement, index: number) {
    this.self = self;
    this.index = index;
  }

  async moveUICircleToBar(bar: Bar, animationTime: number) {
    //we want the  bar to go up
    let translateY = this.heightFromBottom() - 220;
    let bottomHeight = this.heightFromBottom();
    // console.log(this.heightFromBottom());
    if(animationTime === 50){
      this.self.style.transition = `transform ${animationTime}ms linear`;
    }else{
      this.self.style.transition = `transform ${animationTime}ms cubic-bezier(.7,.12,.24,.96)`;
    }
    this.self.style.transform = `translateY(${translateY}px)`;
    await this.sleep(animationTime);
    let translateX = this.distanceFromBar(bar);
    this.self.style.transform = `translate(${translateX}px,${translateY}px )`;
    await this.sleep(animationTime);
    let length = bar.circles.length;
    this.self.style.transform = `translate(${translateX}px,${bottomHeight - (26.33 * length)}px )`;
    await this.sleep(animationTime);
    bar.addCircle(this);
    this.self.style.transform = `translate(0px,0px)`;
  }

  async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  heightFromBottom() {
    let bottom = document.querySelector(".barBase")?.getBoundingClientRect().top;
    let circle = this.self.getBoundingClientRect().bottom;
    let height = bottom! - circle;
    // console.log(height);
    return height;
  }

  distanceFromBar(bar: Bar) {
    let barPosition = bar.self.getBoundingClientRect();
    let barCenter = (barPosition.left + barPosition.right) / 2;
    let circlePosition = this.self.getBoundingClientRect();
    let circleCenter = (circlePosition.left + circlePosition.right) / 2;
    let distance = circleCenter - barCenter;
    // console.log(distance);
    return -distance;
  }

}


class Bar {
  circles: Circle[] | [];
  self: HTMLElement | Element;
  animationTime = 100;
  size: number = 0;
  constructor(self: HTMLElement | Element, circles: Circle[] | []) {
    this.self = self;
    this.circles = circles;
    this.size = circles.length;
  }

  addNewCircle(i: number) {
    const sizeMultiplier = 12;
    const maxWidth = 120;
    const minWidth = 40;
    let newCircle = document.createElement('div');
    newCircle.classList.add("circle");
    newCircle.style.width = `${(minWidth + (i * sizeMultiplier) < maxWidth) ? (minWidth + (i * sizeMultiplier)) : maxWidth}px`;
    let color = `hsl(${(i*40)+100}, 100%, 50%)`
    if(i === 2){
      color = "rgb(202, 201, 201)";
    }
    newCircle.style.backgroundColor = color;
    // newCircle.innerText = `${i}`;
    this.self.append(newCircle);
    let circleObject: Circle = new Circle(newCircle, i);
    this.addCircle(circleObject);
    this.size++;
  }

  removeCircle() {
    let circle = this.circles.shift();
    circle?.self.remove();
    return circle;
  }

  addCircle(circle: Circle) {
    this.circles.push(circle);
    this.self.insertBefore(circle.self, this.self.childNodes[0]);
  }

  async UIMove(bar: Bar) {
    let circle = this.circles[this.circles.length - 1];
    await circle?.moveUICircleToBar(bar, this.animationTime);
    this.circles.pop();
  }

  print() {
    let array = [];
    for (let i = 0; i < this.circles.length; i++) {
      array.push(this.circles[i].index);
    }
    console.log(array);
  }

  isSorted() {
    //check if circles are sorted by size in either order
    let array = [];
    for (let i = 0; i < this.circles.length; i++) {
      array.push(this.circles[i].index);
    }
    let ascending = true;
    let descending = true;
    for (let i = 0; i < array.length; i++) {
      if (i === array.length - 1) break;
      let current = array[i];
      let next = array[i + 1];
      if (current > next) {
        ascending = false;
      }
      if (current < next) {
        descending = false;
      }
    }
    return ascending || descending;
  }



}

class Node {
  value: number;
  next: Node | null;
  constructor(value: number, next: Node | null) {
    this.value = value;
    this.next = next;
  }
}

class Stack {
  top: Node | null;
  constructor() {
    this.top = null;
  }

  push(value: number) {
    let newNode = new Node(value, null);
    if (this.top === null) {
      this.top = newNode;
    } else {
      newNode.next = this.top;
      this.top = newNode;
    }
  }

  pop() {
    if (this.top === null) {
      return null;
    } else {
      let value = this.top.value;
      this.top = this.top.next;
      return value;
    }
  }

  peek() {
    if (this.top === null) {
      return null;
    } else {
      return this.top.value;
    }
  }

  isEmpty() {
    return this.top === null;
  }

  print() {
    let current = this.top;
    let array = []
    while (current !== null) {
      array.push(current.value);
      current = current.next;
    }
    console.log(array);
  }
}


class SolverClass {
  Stacks: Stack[] = [new Stack(), new Stack(), new Stack()];
  moves: [number, number][] = [];
  globalBestScore = 0;
  shortestNumberOfMoves = Infinity;
  size: number = 0;
  depth: number = 0;

  // One: Stack = new Stack();
  // Two: Stack = new Stack();
  // Three: Stack = new Stack();
  constructor(bars: Bar[] | []) {
    if (bars.length === 0) return;
    for (let j = 0; j < bars[0].circles.length; j++) {
      this.Stacks[0].push(bars[0].circles[j].index);
      this.size++;
    }
    for (let j = 0; j < bars[1].circles.length; j++) {
      this.Stacks[1].push(bars[1].circles[j].index);
      this.size++;
    }
    for (let j = 0; j < bars[2].circles.length; j++) {
      this.Stacks[2].push(bars[2].circles[j].index);
      this.size++;
    }


    this.depth = this.size+1;

  }


  print() {
    console.log("One");
    this.Stacks[0].print();
    console.log("Two");
    this.Stacks[1].print();
    console.log("Three");
    this.Stacks[2].print();
  }


  cloneSolver() {
    let newSolver = new SolverClass([]);
    newSolver.Stacks = this.Stacks;
    return newSolver;
  }



  //simplified, do any move that will reach a higher evaluation
  //if none-then go down the tree until you find
  //a move that reaches a higher evaluation


  //let's define a move, it just pops from one stack and pushes to another
  async findBestMove() {
    let moves = await this.generateMoves();
    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      await this.move(move[0], move[1]);
      await this.traverseTree(this, 0, [move]);
      await this.move(move[1], move[0]);
    }

    if (this.globalBestScore === this.size) {
      return true;
    } else {
      return false;
    }
  }

  async traverseTree(solver: SolverClass, depth: number, prevMoves: [number, number][] = []) {
    if (await solver.evaluatePosition(solver) === this.size) {
      console.log("fully solved the tower");
      return this.size;
    }
    if (depth === this.depth) {
      return await solver.evaluatePosition(solver);
    }
    let moves = await solver.generateMoves();
    let bestMove: [number, number] = moves[0];
    let bestScore = 0;
    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      if (move[0] === prevMoves[prevMoves.length - 1][1] && move[1] === prevMoves[prevMoves.length - 1][0]) {
        continue
      } else {
        await solver.move(move[0], move[1]);
        let score = await solver.traverseTree(solver, depth + 1, [...prevMoves, move]);
        await solver.move(move[1], move[0]);
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
          let newMoves = [...prevMoves, bestMove];
          if (bestScore === solver.globalBestScore) {
            if (newMoves.length < solver.shortestNumberOfMoves) {
              solver.shortestNumberOfMoves = newMoves.length;
              solver.moves = newMoves;
            }
          } else if (bestScore > this.globalBestScore) {
            this.globalBestScore = bestScore;
            this.moves = newMoves;
          }
          if (score === this.size && this.size > 5) {
            return solver.size;
          }


        }
      }

    }
    return bestScore;
  }


  async generateMoves() {
    let moves: [number, number][] = [];
    if (!this.Stacks[0].isEmpty()) {
      moves.push([0, 1]);
      moves.push([0, 2]);
    }
    if (!this.Stacks[1].isEmpty()) {
      moves.push([1, 0]);
      moves.push([1, 2]);
    }
    if (!this.Stacks[2].isEmpty()) {
      moves.push([2, 0]);
      moves.push([2, 1]);
    }
    return moves;
  }

  async move(from: number, to: number) {
    let value = this.Stacks[from].pop();
    if (value === null) return;
    this.Stacks[to].push(value!);
  }

  async evaluatePosition(solver: SolverClass) {
    //get longest sorted string in each stack
    let one = solver.Stacks[0];
    let two = solver.Stacks[1];
    let three = solver.Stacks[2];
    let oneScore = this.evaluateStack(one);
    let twoScore = this.evaluateStack(two);
    let threeScore = this.evaluateStack(three);
    let max = Math.max(oneScore, twoScore, threeScore);
    return max;
  }

  evaluateStack(stack: Stack) {
    //return the number of consecutive sorted numbers
    //in any direction
    let current = stack.top;
    let bestScore = 0;
    let descending = 1;
    let ascending = 1;
    let array = [];
    //put stack in an array 
    while (current !== null) {
      array.push(current.value);
      current = current.next;
    }

    for (let i = 0; i < array.length; i++) {
      if (i === array.length - 1) break;
      let current = array[i];
      let next = array[i + 1];
      // console.log("current", current);
      // console.log("next", next);
      if (current > next) {
        // console.log("descending", descending);
        descending++;
        ascending = 1;
      } else {
        ascending++;
        descending = 1;
      }
      if (ascending > bestScore) {
        bestScore = Math.max(ascending, descending);
      }
      // if (descending > bestScore) {
      //   bestScore = Math.max(ascending, descending);
      // }
    }
    return bestScore;

  }


  async moveOver() {
    this.moves = [];
    //we start with bar one
    if (this.Stacks[0].isEmpty()) {
      console.log("empty")
      await this.tower(this.size, 2, 0, 1);
    } else {
      console.log("working")
      await this.tower(this.size, 0, 2, 1);
    }

    console.log("done");
    console.log(this.Stacks);

  }


  async tower(disks: number, from: number, to: number, aux: number) {
    console.log("I am at disk:", disks, from, to , aux);
    if (disks === 0) {
      return;
    }
    await  this.tower(disks - 1, from, aux, to);
    console.log("move disk :", disks, "from peg", from, "to peg", to);
    await this.move(from, to);
    this.moves.push([from, to]);
    await this.tower(disks - 1, aux, to, from);
  }




}






const App: Component = () => {

  const [bars, setBars] = createSignal<Bar[]>();
  const [size, setSize] = createSignal(3);
  const [speed, setSpeed] = createSignal(249);
  const [blocked, setBlocked] = createSignal(false);

  onMount(() => {
    let barElements = document.querySelectorAll(".circleHolder");
    let barObjects: Bar[] = [];
    for (let i = 0; i < barElements.length; i++) {
      let newBar: Bar = new Bar(barElements[i], []);
      barObjects.push(newBar)
    }
    setBars(barObjects);
    for (let i = size(); i > 0; i--) {
      bars()[0].addNewCircle(i);
    }

    for(let i = 0; i < bars().length; i++){
      bars()[i].animationTime = speed();
    }



  });

  function setSpeedAmount(newSpeed: number) {
    setSpeed(newSpeed);
    bars()[0].animationTime = newSpeed;
    bars()[1].animationTime = newSpeed;
    bars()[2].animationTime = newSpeed;
  }

  function setBarsAmount(newSize: number) {
    //remove all current circles
    let circleElements = document.querySelectorAll(".circle");
    for (let i = 0; i < circleElements.length; i++) {
      circleElements[i].remove();
    }
    let barElements = document.querySelectorAll(".circleHolder");

    let barObjects: Bar[] = [];
    for (let i = 0; i < barElements.length; i++) {
      let newBar: Bar = new Bar(barElements[i], []);
      barObjects.push(newBar)
    }
    console.log(barObjects);
    setBars(barObjects);
    for (let i = newSize; i > 0; i--) {
      bars()[0].addNewCircle(i);
    }

    for(let i = 0; i < bars().length; i++){
      bars()[i].animationTime = speed();
    }
    setSize(newSize);
  }

  function clickFunction() {
    shuffleCircles();
  }

  async function isSolved() {

    let barWithCircles;
    for (let i = 0; i < bars().length; i++) {
      if (bars()[i].circles.length === size) {
        barWithCircles = bars()[i];
        return barWithCircles.isSorted();
      }
    }
    return false;
    //find the bar with circle

  }

  async function orderMe() {
    // if (blocked) return;
    // blocked = true;
    //I want to get all the arrays from the boards;
    let result = false;
    let index = 0;

    while (!await isSolved() && index < 10) {
      let solver = new SolverClass(bars());
      result = await solver.findBestMove();
      console.log(solver.evaluatePosition(solver))
      solver.print();      // let moves: [number, number][] = solver.moves;
      // if(result){
      //   solver.moves;
      // }
      // console.log(solver.globalBestScore);
      // console.log(solver.moves);
      for (let i = 0; i < solver.moves.length; i++) {
        let move = solver.moves[i];
        await solver.move(move[0], move[1]);
        await bars()[move[0]].UIMove(bars()[move[1]]);
      }
      index++;

    }
    console.log(await isSolved());
    // blocked = false;
  }

  async function moveOver() {
    let solver = new SolverClass(bars());
    await solver.moveOver();
    solver.print();
    for (let i = 0; i < solver.moves.length; i++) {
      let move = solver.moves[i];
      await bars()[move[0]].UIMove(bars()[move[1]]);
    }
  }


  function shuffleCircles() {
    for (let i = 0; i < 5000; i++) {
      //select random bar
      let randomBarIndex = Math.floor(Math.random() * bars().length);
      if (bars()[randomBarIndex].circles.length === 0) {
        continue;
      } else {
        let circleToMove = bars()[randomBarIndex].removeCircle();
        let randomBarIndex2 = Math.floor(Math.random() * bars().length);
        bars()[randomBarIndex2].addCircle(circleToMove);
      }

    }
  }








  return (
    <div class="whole-Container">

      <div class="bar-container" >
        <div class="bar">
          <div class="circleHolder"></div>
          {/* <div class="barBase"></div> */}
        </div >
        <div class="bar">
          <div class="barBase"></div>
          <div class="circleHolder"></div>
        </div >
        <div class="bar">
          {/* <div class="barBase"></div> */}
          <div class="circleHolder"></div>
        </div >

      </div >
      <button
        class={blocked() ? "blocked" : ""}
        onClick={
          async () => {
            setBlocked(true);
            await moveOver();
            setBlocked(false);
          }
          
        }
      >Mover over</button>
      <div class="slidersContainer">
        <div class="singleSliderContainer">
          {`BARS: ${size()}`}
          <input
            onInput={(e) => setBarsAmount(e.currentTarget.valueAsNumber)}
            type="range" id="size" name="size" class={`slider ${blocked() ? "blocked" : ""}`} min="2" max="5" value={3} />
        </div>
        <div class="singleSliderContainer">
          {`SPEED: ${250-speed()}`}
          <input
            //whenever I move the slide
            //I want to update the size
            onInput={(e) => {
              let newspeed =250 - e.currentTarget.valueAsNumber;
              //100 maps to 50
              console.log(newspeed)
              setSpeedAmount(newspeed)
            }}
            type="range" id="size" name="size" class="slider" min="1" max="200" value={250-speed()} />
        </div>

      </div>


    </div>
  );
};

export default App;
