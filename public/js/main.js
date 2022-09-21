var socket = io();

// socket.on("connectToRoom", (data) => {
//     alert(data);
// });

class Bingo {
  constructor() {
    this.grid = [];
    this.temp = [];
    this.numbers = [];
    this.max_num = 75;
    this.btns = Array.from(document.querySelectorAll(".item-btn"));
    this.display_num = document.querySelector(".num");
    this.flag = false;
    this.bingo_numbers = [];
    this.new_number = true;
  }

  get_number_from_server() {
    socket.on("number", (data) => {
      if (this.new_number) {
        this.bingo_numbers.push(data);
        console.log(this.bingo_numbers);
        this.display_num.innerHTML = this.bingo_numbers;

        this.new_number = false;
        this.check_if_number_exist(data);
      }
    });
  }
  check_if_number_exist(num) {
    this.btns.map((x) => {
      if (parseInt(x.innerHTML) !== num) {
        x.style.pointerEvents = "none";
      }
    });
  }

  save_numbers() {
    let get_item = localStorage.getItem("grid");
    if (get_item == null) {
      this.shuffled_num_list();
      this.add_event_click_to_btn(this.btns);

      let store_this_arr = [];

      for (let i = 0; i < this.grid.length; i++) {
        for (let k = 0; k < this.grid[i].length; k++) {
          store_this_arr.push(this.grid[i][k].innerHTML);
        }
      }
      localStorage.setItem("grid", JSON.stringify(store_this_arr));
    } else {
      //--------------------------------------------------//
      let t = JSON.parse(localStorage.getItem("grid"));
      for (let i = 0; i < this.btns.length; i++) {
        this.btns[i].addEventListener("click", this.handle_btn, false);
        this.btns[i].innerHTML = t[i];

        this.temp.push(this.btns[i]);
      }
    }
  }

  init() {
    this.save_numbers();
    this.get_number_from_server();
    document.querySelector(".bingo-btn").addEventListener(
      "click",
      () => {
        //Horizontal
        for (let row = 0; row < this.grid.length; row++) {
          let found = 1;
          let count = 0;
          while (count < 5) {
            if (
              this.grid[row][count].getAttribute("val") == "1" &&
              found == 5
            ) {
              console.log("Horizontal", "Bingo");
            }
            if (this.grid[row][count].getAttribute("val") == "1") {
              found++;
            }
            count++;
          }
        }
        //Vertical
        for (let row = 0; row < this.grid.length; row++) {
          let found = 1;
          let count = 0;
          while (count < 5) {
            if (
              this.grid[count][row].getAttribute("val") == "1" &&
              found == 5
            ) {
              console.log("Vertical", "Bingo");
            }
            if (this.grid[count][row].getAttribute("val") == "1") {
              found++;
            }
            count++;
          }
        }
        let found = 1;
        //Diagonal
        for (let row = 0; row < this.grid.length; row++) {
          for (let col = 0; col < this.grid[row].length; col++) {
            if (
              col == row &&
              this.grid[row][col].getAttribute("val") == "1" &&
              found == 5
            ) {
              console.log("Diagonal", "Bingo");
            }
            if (col == row && this.grid[row][col].getAttribute("val") == "1") {
              found++;
            }
          }
        }

        this.grid[0][4].getAttribute("toggled") == "true" &&
        this.grid[1][3].getAttribute("toggled") == "true" &&
        this.grid[2][2].getAttribute("toggled") == "true" &&
        this.grid[3][1].getAttribute("toggled") == "true" &&
        this.grid[4][0].getAttribute("toggled") == "true"
          ? console.log("Diagonal", "Bingo")
          : null;
      },
      false
    );
  }

  bingo_btn_click() {
    if (!this.flag) {
      console.log("----", this.grid);
    }
  }

  shuffled_num_list() {
    for (let i = 1; i <= this.max_num; i++) {
      this.numbers.push(i);
    }
    return this.shuffle_array(this.numbers);
  }

  handle_btn(e) {
    let toggled = e.target.getAttribute("toggled");

    if (toggled == "false") {
      e.target.style.backgroundColor = "#27ae60";
      e.target.style.color = "black";
      e.target.style.border = "1px solid black";
      e.target.setAttribute("toggled", "true");
      e.target.setAttribute("val", "1");
      this.onetime = false;
    } else {
      e.target.style.backgroundColor = "#ecf0f1";
      e.target.style.color = "black";
      e.target.style.border = "1px solid rgb(0, 0, 0)";
      e.target.setAttribute("toggled", "false");
      e.target.setAttribute("val", "0");
    }
  }

  shuffle_array(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  add_event_click_to_btn(btn) {
    var nodelist_to_arr = btn;
    for (let i = 0; i < nodelist_to_arr.length; i++) {
      nodelist_to_arr[i].addEventListener("click", this.handle_btn, false);
      nodelist_to_arr[i].innerHTML = this.numbers[i];

      this.temp.push(nodelist_to_arr[i]);
    }

    //Creating 2d array from 1d
    while (this.temp.length) this.grid.push(this.temp.splice(0, 5));
    this.flag = true;
  }
}

let bingo = new Bingo();

//Check if new user
document.body.onload = () => {
  let user = localStorage.getItem("username");
  if (user !== null) {
    toggle_visible();
    bingo.init();
  }
};

let toggle_visible = () => {
  document.querySelector(".grid-container").style.display = "grid";
  document.querySelector(".container").style.display = "grid";
  document.querySelector(".bingo-container").style.display = "grid";
  document.querySelector(".info-container").style.display = "none";
};

document.querySelector("#username-btn").addEventListener("click", () => {
  let username = document
    .querySelector("#username")
    .value.match("[_a-zA-Z0-9ÅÄÖåäö]+");

  if (username) {
    bingo.init();
    toggle_visible();
    socket.emit("set-username", username);
    localStorage.setItem("username", username);
  } else {
    alert("username can only contain letters & numbers");
  }
  console.log(username);
});

/* document
  .querySelector(".bingo-btn")
  .addEventListener("click", bingo.validate_grid, false);
 */
