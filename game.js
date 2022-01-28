console.log("script running");

let numOfPlayers = 2;
let numOfTreasures = 3;
let currentPlayer = 1;

const startScreen = document.querySelector("#startscreen");

function setupStartScreen(startScreen) {
    let playerInput = document.createElement("INPUT")
    playerInput.setAttribute("type", "number")
    playerInput.setAttribute("min", "1")
    playerInput.setAttribute("max", "4")
    playerInput.setAttribute("defaultValue", "2")
    let treasureInput = document.createElement("INPUT")
    playerInput.setAttribute("type", "number")
    playerInput.setAttribute("min", playerInput.value)
    playerInput.setAttribute("max", (24/playerInput.value))
    playerInput.setAttribute("defaultValue", "1")
    let startButton = document.createElement("BUTTON")
    startButton.innerHTML = "START"
    startScreen.appendChild(playerInput)
    startScreen.appendChild(treasureInput)
    startScreen.appendChild(startButton)

    startButton.onclick = function() {
        numOfPlayers = playerInput.value;
        numOfTreasures = treasureInput.value;
        createBoard(gameBoard);
        startScreen.innerHTML = ""
    }


}

setupStartScreen(startScreen)

const description = document.querySelector("#desc");
const gameBoard = document.querySelector("#gameboard");

const fields = [
    {
        name: "L-top-left",
        directions: ["E", "S"],
    },
    {
        name: "L-top-right",
        directions: ["W", "S"],
    },
    {
        name: "L-bottom-left",
        directions: ["E", "N"],
    },
    {
        name: "L-bottom-right",
        directions: ["W", "N"],
    },
    {
        name: "T-north",
        directions: ["W", "N", "E"],
    },
    {
        name: "T-south",
        directions: ["W", "S", "E"],
    },
    {
        name: "T-east",
        directions: ["N", "E", "S"],
    },
    {
        name: "T-west",
        directions: ["N", "W", "S"],
    },
    {
        name: "I-vertical",
        directions: ["N", "S"],
    },
    {
        name: "I-horizontal",
        directions: ["W", "E"],
    },
];

const treasures = ["owl", "ghost", "bat", "skull"];

function rotateBlock(block_ID) {
    if (block_ID === "L-top-left") {
        return "L-top-right";
    } else if (block_ID === "L-top-right") {
        return "L-bottom-right";
    } else if (block_ID === "L-bottom-right") {
        return "L-bottom-left";
    } else if (block_ID === "L-bottom-left") {
        return "L-top-left";
    } else if (block_ID === "T-north") {
        return "T-east";
    } else if (block_ID === "T-east") {
        return "T-south";
    } else if (block_ID === "T-south") {
        return "T-west";
    } else if (block_ID === "T-west") {
        return "T-north";
    } else if (block_ID === "I-horizontal") {
        return "I-vertical";
    } else if (block_ID === "I-vertical") {
        return "I-horizontal";
    } else {
        return null;
    }
}

function advancePlayer(player_ID) {
    if (player_ID + 1 > numOfPlayers) {
        return 1;
    } else {
        return player_ID + 1;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const fieldsArray = [];
const arrowsArray = [];
const gameBoardTable = document.createElement("table");
const outline = document.createElement("table");
let Is = 13;
let Ls = 15;
let Ts = 6;

function createBoard(gameBoard) {
    outline.setAttribute("id", "outline_table");

    gameBoardTable.setAttribute("id", "gameboard_table");

    for (let i = 0; i < 7; i++) {
        row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            cell = document.createElement("td");
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.dataset.player = "";
            cell.setAttribute("id", "field");
            cell.dataset.treasure = "";
            if (i % 2 === 0 && j % 2 === 0) {
                cell.dataset.immovable = true;
                if (i === 0 && j === 0) {
                    cell.dataset.field = "L-top-left";
                    cell.innerHTML = "|‾";
                    cell.dataset.player = numOfPlayers >= 1 ? "1" : "";
                } else if (i === 0 && j === 6) {
                    cell.dataset.field = "L-top-right";
                    cell.innerHTML = "‾|";
                    cell.dataset.player = numOfPlayers >= 2 ? "2" : "";
                } else if (i === 6 && j === 0) {
                    cell.dataset.field = "L-bottom-left";
                    cell.innerHTML = "|_";
                    cell.dataset.player = numOfPlayers >= 3 ? "3" : "";
                } else if (i === 6 && j === 6) {
                    cell.dataset.field = "L-bottom-right";
                    cell.innerHTML = "_|";
                    cell.dataset.player = numOfPlayers >= 4 ? "4" : "";
                } else if (i % 2 === 0 && j === 0) {
                    cell.dataset.field = "T-east";
                    cell.innerHTML = "|-";
                } else if (i % 2 === 0 && j === 6) {
                    cell.dataset.field = "T-west";
                    cell.innerHTML = "-|";
                } else if (i === 0 && j % 2 === 0) {
                    cell.dataset.field = "T-south";
                    cell.innerHTML = "‾|‾";
                } else if (i === 6 && j % 2 === 0) {
                    cell.dataset.field = "T-north";
                    cell.innerHTML = "_|_";
                } else if (i === 2 && j === 2) {
                    cell.dataset.field = "T-east";
                    cell.innerHTML = "|-";
                } else if (i === 2 && j === 4) {
                    cell.dataset.field = "T-south";
                    cell.innerHTML = "‾|‾";
                } else if (i === 4 && j === 2) {
                    cell.dataset.field = "T-west";
                    cell.innerHTML = "-|";
                } else if (i === 4 && j === 4) {
                    cell.dataset.field = "T-south";
                    cell.innerHTML = "_|_";
                }
            } else {
                cell.dataset.immovable = false;
                cell.dataset.ejected = false;

                let isGenerated = false;
                while (!isGenerated) {
                    let rand = getRandomInt(3);
                    if (rand === 0 && Is > 0) {
                        let rand2 = getRandomInt(2);
                        cell.dataset.field = rand2 === 0 ? "I-horizontal" : "I-vertical";
                        cell.innerHTML = rand2 === 0 ? "--" : "|";
                        console.log("generated I", Is);
                        isGenerated = true;
                        Is--;
                    } else if (rand === 1 && Ls > 0) {
                        let rand2 = getRandomInt(4);
                        cell.dataset.field =
                            rand2 === 0
                                ? "L-top-left"
                                : rand2 === 1
                                    ? "L-top-right"
                                    : rand2 === 2
                                        ? "L-bottom-left"
                                        : "L-bottom-right";
                        cell.innerHTML =
                            rand2 === 0
                                ? "|‾"
                                : rand2 === 1
                                    ? "‾|"
                                    : rand2 === 2
                                        ? "|_"
                                        : "_|";
                        console.log("generated L", Ls);
                        isGenerated = true;
                        Ls--;
                    } else if (rand === 2 && Ts > 0) {
                        let rand2 = getRandomInt(4);
                        cell.dataset.field =
                            rand2 === 0
                                ? "T-north"
                                : rand2 === 1
                                    ? "T-south"
                                    : rand2 === 2
                                        ? "T-west"
                                        : "T-east";
                        cell.innerHTML =
                            rand2 === 0
                                ? "_|_"
                                : rand2 === 1
                                    ? "‾|‾"
                                    : rand2 === 2
                                        ? "-|"
                                        : "|-";
                        console.log("generated T", Ts);
                        isGenerated = true;
                        Ts--;
                    }
                }
            }
            fieldsArray.push(cell);
            row.appendChild(cell);
        }
        gameBoardTable.appendChild(row);
    }

    cell = document.createElement("td");
    cell.dataset.row = -1;
    cell.dataset.col = -1;
    cell.setAttribute("id", "field");
    cell.dataset.treasure = "";
    cell.dataset.player = "";
    cell.dataset.immovable = false;
    cell.dataset.ejected = true;
    cell.classList.add("ejected");
    cell.dataset.treasure = "";
    cell.dataset.field =
        Ts - 1 === 0 ? "T-north" : Ls - 1 === 0 ? "L-top-left" : "I-horizontal";
    cell.innerHTML = Ts - 1 === 0 ? "_|_" : Ls - 1 === 0 ? "|‾" : "--";
    fieldsArray.push(cell);
    console.log("generated last block:", cell.dataset.field);
    for (let i = 0; i < 9; i++) {
        row = document.createElement("tr");
        for (let j = 0; j < 9; j++) {
            if (j === 1 && i === 1) {
                col = document.createElement("td");
                col.setAttribute("rowspan", 7);
                col.setAttribute("colspan", 7);
                col.setAttribute("id", "board_field");
                col.appendChild(gameBoardTable);
                row.appendChild(col);
            } else if (i === 0 || i === 8 || j === 0 || j === 8) {
                col = document.createElement("td");
                str = '<img id="field_img" src="./resources/#.png" />';
                str = str.replace(
                    "#",
                    i === 0
                        ? "down_arrow"
                        : i === 8
                            ? "up_arrow"
                            : j === 0
                                ? "right_arrow"
                                : "left_arrow"
                );
                if (
                    i % 2 === 0 &&
                    j % 2 === 0 &&
                    (i !== 0 || j !== 0) &&
                    (i !== 8 || j !== 0) &&
                    (i !== 0 || j !== 8) &&
                    (i !== 8 || j !== 8)
                ) {
                    col.classList.add(
                        i === 0
                            ? "down_arrow"
                            : i === 8
                                ? "up_arrow"
                                : j === 0
                                    ? "right_arrow"
                                    : "left_arrow"
                    );
                    col.innerHTML = str;
                    col.dataset.col = j;
                    col.dataset.row = i;
                }
                col.setAttribute("id", "outline");
                arrowsArray.push(col);
                row.appendChild(col);
            }
        }
        outline.appendChild(row);
    }
    row = document.createElement("tr");
    col = document.createElement("td");
    col.innerHTML = "Kiesett lap:";
    col3 = document.createElement("td");
    col3.setAttribute("colspan", 7);
    col.setAttribute("colspan", 1);
    col3.setAttribute("id", "outline");
    col.setAttribute("id", "outline");
    row.appendChild(col);
    row.appendChild(cell);
    row.appendChild(col3);
    outline.appendChild(row);
    gameBoard.appendChild(outline);

    /*for(row of outline.children) {
                for(cell of row.children) {
                    console.log(cell)
                }
            }*/
    placeTreasures();
}



//todo: figure out how to do graphics
//todo: figure out how to insert field, store the ejected field

for (field of fieldsArray) {
    console.log(field.dataset);
}

for (arr of arrowsArray) {
    console.log(arr.dataset);
}

console.log(fieldsArray.length);

function updateBoard() {
    for (field_e of fieldsArray) {
        field_e.innerHTML = '<canvas width="80px" height="80px">';
        let canvas = field_e.querySelector("canvas");
        let ctx = canvas.getContext("2d");

        let images = [];
        let fieldIMG = new Image();
        let trsIMG = new Image();
        let playerIMG = new Image();
        images.push(fieldIMG);

        fieldIMG.onload = trsIMG.onload = drawImages;

        if (field_e.dataset.treasure != "") {
            images.push(trsIMG);
            trsIMG.src = "./resources/treasure_" + field_e.dataset.treasure + ".png";
        }
        if (field_e.dataset.player != "") {
            //console.log(field_e.dataset.player)
            images.push(playerIMG);
            playerIMG.src = "./resources/p" + field_e.dataset.player + ".png";
        }
        fieldIMG.src = "./resources/" + field_e.dataset.field + ".png";

        function drawImages() {
            for (let i = 0; i < images.length; i++) {
                setTimeout(() => {
                    ctx.drawImage(images[i], 0, 0, 80, 80);
                }, 10);
            }
        }
    }
}

function placeTreasures() {
    for (let j = 0; j < numOfTreasures; j++) {
        let tre =
            j % 4 === 0
                ? treasures[0]
                : j % 4 === 1
                    ? treasures[1]
                    : j % 4 === 3
                        ? treasures[2]
                        : treasures[3];
        let isGenerated = false;
        while (!isGenerated) {
            let rand = getRandomInt(49);
            if (
                fieldsArray[rand].dataset.immovable === "false" &&
                fieldsArray[rand].dataset.treasure === ""
            ) {
                fieldsArray[rand].dataset.treasure = tre;
                console.log(fieldsArray[rand].dataset);
                isGenerated = true;
                updateBoard();
            }
        }
    }
}



function insertBlock() { }

/**
 *
 * @param {Node} szulo egy HTML elem querySelectorral kiválasztva (pl. `document.querySelector("ul")`)
 * @param {keyof HTMLElementTagNameMap} gyerek egy CSS szelektor, ami leíja azon elemeket, melyeken szeretnénk futtatni a fgv-t (pl. `"a"`)
 * @param {string} mikor egy esemény, stringként (pl. `"click"`)
 * @param {(ev: Event, target: Node) => null} mit A függvény, amit futtatunk
 */
function delegal(szulo, gyerek, mikor, mit) {
    function esemenyKezelo(ev) {
        const esemenyCelja = ev.target;
        const esemenyKezeloje = this;
        const legkozelebbiKeresettElem = esemenyCelja.closest(gyerek);

        if (esemenyKezeloje.contains(legkozelebbiKeresettElem)) {
            mit(ev, legkozelebbiKeresettElem);
        }
    }

    szulo.addEventListener(mikor, esemenyKezelo);
}

delegal(outline, ".down_arrow", "click", moveCol);
delegal(outline, ".up_arrow", "click", moveCol);
delegal(outline, ".left_arrow", "click", moveRow);
delegal(outline, ".right_arrow", "click", moveRow);
delegal(outline, ".ejected", "click", rotate);
delegal(gameBoardTable, "#field", "click", stepOn);

function stepOn(event, target) {
    //console.log(target)
    let playerField = fieldsArray.find(
        (element) => element.dataset.player == currentPlayer
    );
    if(canStepThere(playerField, target)) {
        console.log(canStepThere(target, playerField))
        tmp = playerField.dataset.player;
        playerField.dataset.player = "";
        target.dataset.player = tmp;
        updateBoard();
    }
    //console.log(playerField)
    /*if(findPath(target, playerField)) {
        console.log("founded patfhf")
    }*/
}

function canStepThere(field_e, dest) {
    console.log(field_e.dataset.col + " " + field_e.dataset.row + " origin: " + dest.dataset.col + " " + dest.dataset.row)
    leftNeighbor = fieldsArray.find(
        (element) =>
            element.dataset.col == parseInt(field_e.dataset.col) - 1 &&
            element.dataset.row == field_e.dataset.row
    );
    console.log("left neighbor: " + leftNeighbor)
    rightNeighbor = fieldsArray.find(
        (element) =>
            element.dataset.col == (parseInt(field_e.dataset.col) + 1) &&
            element.dataset.row == field_e.dataset.row
    );
    console.log("right neighbor: " + rightNeighbor)
    topNeighbor = fieldsArray.find(
        (element) =>
            element.dataset.col == field_e.dataset.col &&
            element.dataset.row == (parseInt(field_e.dataset.row) - 1)
    );
    console.log("top neighbor: " + topNeighbor)
    bottomNeighbor = fieldsArray.find(
        (element) =>
            element.dataset.col == field_e.dataset.col &&
            element.dataset.row == (parseInt(field_e.dataset.row) + 1)
    );
    console.log("bottom neighbor: " + bottomNeighbor)
    if (
        typeof leftNeighbor != "undefined" &&
        fields.find(element => element.name === leftNeighbor.dataset.field).directions.includes("E") &&
        fields.find(element => element.name === field_e.dataset.field).directions.includes("W") && dest === leftNeighbor
    ) {
        console.log("left")
        return true;
    } else if(
        typeof rightNeighbor != "undefined" &&
        fields.find(element => element.name === rightNeighbor.dataset.field).directions.includes("W") &&
        fields.find(element => element.name === field_e.dataset.field).directions.includes("E") && dest === rightNeighbor
    ) {
        console.log("right")
        return true;
    } else if(
        typeof topNeighbor != "undefined" &&
        fields.find(element => element.name === topNeighbor.dataset.field).directions.includes("S") &&
        fields.find(element => element.name === field_e.dataset.field).directions.includes("N") && dest === topNeighbor
    ) {
        console.log("top")
        return true;
    } else if(
        typeof bottomNeighbor != "undefined" &&
        fields.find(element => element.name === bottomNeighbor.dataset.field).directions.includes("N") &&
        fields.find(element => element.name === field_e.dataset.field).directions.includes("S") && dest === bottomNeighbor
    ) {
        console.log("bottom")
        return true;
    } else {
        return false;
    }
}

/*function findPath(field_e, dest) {
    let paths = []
    let steps = 49
    while((field_e.dataset.col != dest.dataset.col && field_e.dataset.row != dest.dataset.row) || steps >= 0) {
        leftNeighbor = fieldsArray.find(
            (element) =>
                element.dataset.col == field_e.dataset.col - 1 &&
                element.dataset.row == field_e.dataset.row
        );
        rightNeighbor = fieldsArray.find(
            (element) =>
                element.dataset.col == field_e.dataset.col + 1 &&
                element.dataset.row == field_e.dataset.row
        );
        topNeighbor = fieldsArray.find(
            (element) =>
                element.dataset.col == field_e.dataset.col &&
                element.dataset.row == field_e.dataset.row - 1
        );
        bottomNeighbor = fieldsArray.find(
            (element) =>
                element.dataset.col == field_e.dataset.col &&
                element.dataset.row == field_e.dataset.row + 1
        );
        if (
            typeof leftNeighbor != "undefined" &&
            fields.find(element => element.name === leftNeighbor.dataset.field).directions.includes("E") &&
            fields.find(element => element.name === field_e.dataset.field).directions.includes("W") && !paths.includes(field_e)
        ) {
            console.log("left");
            paths.push(leftNeighbor)
            field_e = leftNeighbor;
            steps--;
        } else if (
            typeof rightNeighbor != "undefined" &&
            fields.find(element => element.name === rightNeighbor.dataset.field).directions.includes("W") &&
            fields.find(element => element.name === field_e.dataset.field).directions.includes("E") && !paths.includes(field_e)
        ) {
            console.log("right");
            paths.push(rightNeighbor);
            field_e = rightNeighbor;
            steps--;
        } else if (
            typeof topNeighbor != "undefined" &&
            fields.find(element => element.name === topNeighbor.dataset.field).directions.includes("S") &&
            fields.find(element => element.name === field_e.dataset.field).directions.includes("N") && !paths.includes(field_e)
        ) {
            console.log("top");
            paths.push(topNeighbor);
            field_e = topNeighbor;
            steps--;
        } else if (
            typeof bottomNeighbor != "undefined" &&
            fields.find(element => element.name === bottomNeighbor.dataset.field).directions.includes("N") &&
            fields.find(element => element.name === field_e.dataset.field).directions.includes("S") && !paths.includes(field_e)
        ) {
            console.log("bottom");
            paths.push(bottomNeighbor);
            field_e = bottomNeighbor;
            steps--;
        } else {
            steps--;
        }
        
    }
    //console.log(dest)
    
}*/

function rotate(event, target) {
    console.log(target);
    target.dataset.field = rotateBlock(target.dataset.field);
    updateBoard();
}

function moveCol(event, target) {
    console.log(target);
    let targetCol = target.dataset.col - 1;
    console.log("col: " + targetCol + ", direction: " + target.classList);

    if (target.classList.contains("down_arrow")) {
        moveColDown(targetCol);
    } else if (target.classList.contains("up_arrow")) {
        moveColUp(targetCol);
    }
}

function moveRow(event, target) {
    console.log(target);
    let targetRow = target.dataset.row - 1;
    console.log("col: " + targetRow + ", direction: " + target.classList);

    if (target.classList.contains("left_arrow")) {
        moveRowLeft(targetRow);
    } else if (target.classList.contains("right_arrow")) {
        moveRowRight(targetRow);
    }
}

function moveColDown(targetCol) {
    currElement = fieldsArray.find(
        (element) => element.dataset.col == -1 && element.dataset.row == -1
    );
    firstElement = fieldsArray.find(
        (element) => element.dataset.col == targetCol && element.dataset.row == 0
    );
    //console.log(firstElement.dataset)
    for (let i = 0; i < 7; i++) {
        nextElement = fieldsArray.find(
            (element) => element.dataset.col == targetCol && element.dataset.row == i
        );
        console.log(nextElement.dataset);
        tmpField = nextElement.dataset.field;
        tmpTreasure = nextElement.dataset.treasure;
        tmpEjected = nextElement.dataset.ejected;
        tmpPlayer = nextElement.dataset.player;
        nextElement.dataset.field = currElement.dataset.field;
        nextElement.dataset.treasure = currElement.dataset.treasure;
        nextElement.dataset.ejected = currElement.dataset.ejected;
        nextElement.dataset.player = currElement.dataset.player;

        currElement.dataset.field = tmpField;
        currElement.dataset.treasure = tmpTreasure;
        currElement.dataset.ejected = tmpEjected;
        currElement.dataset.player = tmpPlayer;
    }
    updateBoard();
}

function moveColUp(targetCol) {
    currElement = fieldsArray.find(
        (element) => element.dataset.col == -1 && element.dataset.row == -1
    );
    firstElement = fieldsArray.find(
        (element) => element.dataset.col == targetCol && element.dataset.row == 0
    );
    //console.log(firstElement.dataset)
    for (let i = 6; i >= 0; i--) {
        nextElement = fieldsArray.find(
            (element) => element.dataset.col == targetCol && element.dataset.row == i
        );
        console.log(nextElement.dataset);
        tmpField = nextElement.dataset.field;
        tmpTreasure = nextElement.dataset.treasure;
        tmpEjected = nextElement.dataset.ejected;
        tmpPlayer = nextElement.dataset.player;
        
        nextElement.dataset.field = currElement.dataset.field;
        nextElement.dataset.treasure = currElement.dataset.treasure;
        nextElement.dataset.ejected = currElement.dataset.ejected;
        nextElement.dataset.player = currElement.dataset.player;

        currElement.dataset.field = tmpField;
        currElement.dataset.treasure = tmpTreasure;
        currElement.dataset.ejected = tmpEjected;
        currElement.dataset.player = tmpPlayer;
    }
    updateBoard();
}

function moveRowLeft(targetRow) {
    currElement = fieldsArray.find(
        (element) => element.dataset.col == -1 && element.dataset.row == -1
    );
    firstElement = fieldsArray.find(
        (element) => element.dataset.col == 0 && element.dataset.row == targetRow
    );
    //console.log(firstElement.dataset)
    for (let i = 6; i >= 0; i--) {
        nextElement = fieldsArray.find(
            (element) => element.dataset.col == i && element.dataset.row == targetRow
        );
        console.log(nextElement.dataset);
        tmpField = nextElement.dataset.field;
        tmpTreasure = nextElement.dataset.treasure;
        tmpEjected = nextElement.dataset.ejected;
        tmpPlayer = nextElement.dataset.player;
        
        nextElement.dataset.field = currElement.dataset.field;
        nextElement.dataset.treasure = currElement.dataset.treasure;
        nextElement.dataset.ejected = currElement.dataset.ejected;
        nextElement.dataset.player = currElement.dataset.player;

        currElement.dataset.field = tmpField;
        currElement.dataset.treasure = tmpTreasure;
        currElement.dataset.ejected = tmpEjected;
        currElement.dataset.player = tmpPlayer;

    }
    updateBoard();
}

function moveRowRight(targetRow) {
    currElement = fieldsArray.find(
        (element) => element.dataset.col == -1 && element.dataset.row == -1
    );
    firstElement = fieldsArray.find(
        (element) => element.dataset.col == 0 && element.dataset.row == targetRow
    );
    //console.log(firstElement.dataset)
    for (let i = 0; i < 7; i++) {
        nextElement = fieldsArray.find(
            (element) => element.dataset.col == i && element.dataset.row == targetRow
        );
        console.log(nextElement.dataset);
        tmpField = nextElement.dataset.field;
        tmpTreasure = nextElement.dataset.treasure;
        tmpEjected = nextElement.dataset.ejected;
        tmpPlayer = nextElement.dataset.player;
        
        nextElement.dataset.field = currElement.dataset.field;
        nextElement.dataset.treasure = currElement.dataset.treasure;
        nextElement.dataset.ejected = currElement.dataset.ejected;
        nextElement.dataset.player = currElement.dataset.player;
        
        currElement.dataset.field = tmpField;
        currElement.dataset.treasure = tmpTreasure;
        currElement.dataset.ejected = tmpEjected;
        currElement.dataset.player = tmpPlayer;
    }
    updateBoard();
}

updateBoard();
