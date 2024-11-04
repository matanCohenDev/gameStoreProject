var $ = function(id) {
    return document.getElementById(id.substr(1));
};

var maze = (function(){
    return {
        random: function(num) {
            return Math.floor(Math.random() * num);
        },
        init: function (row, col, data, value) {
            for (var x = 0; x < row; x++) {
                data[x] = [];
                for (var y = 0; y < col; y++) {
                    data[x][y] = JSON.parse(JSON.stringify(value));
                }
            }
            return data;
        },
        nextCell: function (cell, tempstack, stack, cellvisit, idx) {
            var tempCell = tempstack[idx],
                row = tempCell[0],
                col = tempCell[1];
            cell = [row, col];
            stack.push(cell);
            cellvisit[row][col] = 1;
            return cell;
        },
        popCell: function (stack, cell) {
            stack.pop();
            var num = stack.length;
            if (num != 0) {
                cell = stack[num - 1];
            }
            return cell;
        }
    }
}());

(function(){
    var cell = [],
        cellWalls = [],
        cellStack = [],
        cellPath = [],
        rowCells = 20,
        columnCells = 20,
        cellWidth = 25,
        cellHeight = 25,
        currentCell = [0, 0]; // Added to keep track of the player's current position

    var canvas = $("#maze");
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = '#005F6B';
    ctx.lineWidth = 2;

    function cellStart(rowmax, colmax) {
        var row = maze.random(rowmax),
            col = maze.random(colmax),
            currentCell = [row, col];
        cell[row][col] = 1;
        cellStack.push(currentCell);
        return currentCell;
    }

    function checkCellVisited() {
        var str = cell.toString();
        return str.includes('0');
    }

    function neighbourCells(position) {
        var neighbourStack = [],
            rowOffset = [-1, 0, 1, 0],
            colOffset = [0, 1, 0, -1],
            direction = ['N', 'E', 'S', 'W'];
        for (var i = 0; i < 4; i++) {
            var targetRow = position[0] + rowOffset[i],
                targetCol = position[1] + colOffset[i];
            if ( targetRow >= 0 && targetCol >= 0
                && targetRow < rowCells && targetCol < columnCells
                && cell[targetRow][targetCol] === 0){
                neighbourStack.push([targetRow, targetCol, direction[i]]);
            }
        }
        return neighbourStack;
    }

    function nextCell() {
        var neighbourNum,
            currentCell = cellStart(rowCells, columnCells);
        while (checkCellVisited()) {
            var neighbourStack = neighbourCells(currentCell);
            neighbourNum = neighbourStack.length;
            if (neighbourNum !== 0) {
                var random = maze.random(neighbourNum), // Random number from 0 to neighbourStack.length-1
                    tempCell = neighbourStack[random];
                wallValue(currentCell, tempCell, cellWalls);
                currentCell = maze.nextCell(currentCell, neighbourStack, cellStack, cell, random);
            } else {
                currentCell = maze.popCell(cellStack, currentCell);
            }
        }
    }

    function wallValue(curCell, nextCell, walls) {
        var curRow = curCell[0],
            curCol = curCell[1],
            nextRow = nextCell[0],
            nextCol = nextCell[1],
            direction = nextCell[2],
            currentWall = walls[curRow][curCol].slice(0),
            nextWall = walls[nextRow][nextCol].slice(0);
        switch (direction) {
            case 'N':
                currentWall[0] = 0;
                nextWall[2] = 0;
                break;
            case 'E':
                currentWall[1] = 0;
                nextWall[3] = 0;
                break;
            case 'S':
                currentWall[2] = 0;
                nextWall[0] = 0;
                break;
            case 'W':
                currentWall[3] = 0;
                nextWall[1] = 0;
                break;
        }
        walls[curRow][curCol] = currentWall;
        walls[nextRow][nextCol] = nextWall;
    }

    function pathInit() {
        maze.init(rowCells, columnCells, cellPath, 0);
        var pathStart = [0, 0],
            pathStack =[];
        cellPath[0][0] = 1;
        pathStack.push(pathStart);
        return pathStack;
    }

    function pathChoose(cell) {
        var row = cell[0],
            col = cell[1],
            rowOffset = [-1, 0, 1, 0],
            colOffset = [0, 1, 0, -1],
            walls = cellWalls[row][col],
            nextStack = [];
        for (var i = 0; i < 4; i++) {
            var targetRow = row + rowOffset[i],
                targetCol = col + colOffset[i],
                targetCell = [targetRow, targetCol];
            if (targetRow >= 0 && targetCol >= 0
                && targetRow < rowCells && targetCol < columnCells
                && walls[i] === 0 && cellPath[targetRow][targetCol] === 0) {
                nextStack.push(targetCell);
            }
        }
        return nextStack;
    }

    function nextPath(rowmax, colmax) {
        var pathStack = pathInit(),
            currentCell = pathStack[pathStack.length - 1],
            pathEnd = [rowmax - 1, colmax - 1];
        while (currentCell.toString() !== pathEnd.toString()) {
            var nextStack = pathChoose(currentCell);
            switch (nextStack.length) {
                case 0:
                    currentCell = maze.popCell(pathStack, currentCell);
                    break;
                default:
                    var idx = maze.random(nextStack.length);
                    currentCell = maze.nextCell(currentCell, nextStack, pathStack, cellPath, idx);
                    break;
            }
        }
        return pathStack;
    }

    function keyboardPosition(curCell, keyValue, wallValue, rowmax, colmax) {
        var row = curCell[0],
            col = curCell[1],
            walls = wallValue[row][col];
        switch (keyValue) {
            case 38: // Up
                if (row - 1 >= 0 && walls[0] === 0) {
                    curCell = [row - 1, col];
                }
                break;
            case 39: // Right
                if (col + 1 < colmax && walls[1] === 0) {
                    curCell = [row, col + 1];
                }
                break;
            case 40: // Down
                if (row + 1 < rowmax && walls[2] === 0) {
                    curCell = [row + 1, col];
                }
                break;
            case 37: // Left
                if (col - 1 >= 0 && walls[3] === 0) {
                    curCell = [row, col - 1];
                }
                break;
        }
        return curCell;
    }

    function entrySet(walls, rowmax, colmax) {
        var entryWalls = walls;
        entryWalls[0][0][3] = 0;
        entryWalls[rowmax - 1][colmax - 1][1] = 0;
        return entryWalls;
    }

    function drawLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1 + 0.5, y1 + 0.5); // Adjusted for crisp lines
        ctx.lineTo(x2 + 0.5, y2 + 0.5);
        ctx.stroke();
    }

    function drawAllLines(rowmax, colmax, width, height) {
        for (var i = 0; i <= rowmax; i++) {
            drawLine(0, i * height, colmax * width, i * height);
        }
        for (var j = 0; j <= colmax; j++) {
            drawLine(j * width, 0, j * width, rowmax * height);
        }
    }

    function clearMaze(width, height, rowmax, colmax) {
        ctx.clearRect(0, 0, colmax * width, rowmax * height);
    }

    function drawWalls(wall, width, height, rowmax, colmax) {
        for (var row = 0; row < rowmax; row++){
            for (var col = 0; col < colmax; col++){
                var x = col * width,
                    y = row * height;
                if (wall[row][col][0] === 1) {
                    drawLine(x, y, x + width, y);
                }
                if (wall[row][col][1] === 1) {
                    drawLine(x + width, y, x + width, y + height);
                }
                if (wall[row][col][2] === 1){
                    drawLine(x, y + height, x + width, y + height);
                }
                if (wall[row][col][3] === 1){
                    drawLine(x, y, x, y + height);
                }
            }
        }
    }

    function drawPath(width, height) {
        var pathCell = nextPath(rowCells, columnCells);
        ctx.fillStyle = 'rgba(0, 180, 204, 0.4)';
        for (var i = 0; i < pathCell.length; i++) {
            setTimeout(function (num) {
                return function () {
                    var currentCell = pathCell[num],
                        row = currentCell[0],
                        col = currentCell[1];
                    ctx.fillRect(col * width, row * height, width, height);
                };
            }(i), 50 * i);
        }
    }

    function redrawCell(row, col, width, height) {
        var x = col * width,
            y = row * height;
        ctx.clearRect(x, y, width, height);
        // Redraw walls for this cell
        var walls = cellWalls[row][col];
        if (walls[0] === 1) {
            drawLine(x, y, x + width, y);
        }
        if (walls[1] === 1) {
            drawLine(x + width, y, x + width, y + height);
        }
        if (walls[2] === 1){
            drawLine(x, y + height, x + width, y + height);
        }
        if (walls[3] === 1){
            drawLine(x, y, x, y + height);
        }
    }

    function drawPosition(cell, width, height, previousCell) {
        if (previousCell) {
            redrawCell(previousCell[0], previousCell[1], width, height);
        }
        var x = cell[0],
            y = cell[1];
        ctx.fillStyle = '#00B4CC';
        ctx.beginPath();
        ctx.arc(y * width + width / 2, x * height + height / 2, 9, 0, 2 * Math.PI);
        ctx.fill();
    }

    drawAllLines(rowCells, columnCells, cellWidth, cellHeight);

    $('#createMaze').addEventListener('click', function(){
        clearMaze(cellWidth, cellHeight, rowCells, columnCells);
        maze.init(rowCells, columnCells, cell, 0);
        maze.init(rowCells, columnCells, cellWalls, [1, 1, 1, 1]);
        nextCell();
        var walls = entrySet(cellWalls, rowCells, columnCells);
        drawWalls(walls, cellWidth, cellHeight, rowCells, columnCells);
        currentCell = [0, 0]; // Reset the player's position
        drawPosition(currentCell, cellWidth, cellHeight);
    });

    $('#solveMaze').addEventListener('click', function(){
        drawPath(cellWidth, cellHeight);
    });

    document.addEventListener('keydown', function(event){
        var key = event.keyCode;
        var previousCell = currentCell.slice();
        currentCell = keyboardPosition(currentCell, key, cellWalls, rowCells, columnCells);
        drawPosition(currentCell, cellWidth, cellHeight, previousCell);
        // Check if the player has reached the exit
        if (currentCell[0] === rowCells - 1 && currentCell[1] === columnCells - 1) {
            alert("Congratulations! You've solved the maze!");
        }
    });

}());
