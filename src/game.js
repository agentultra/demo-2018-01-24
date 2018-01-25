const canvas = document.getElementById('stage')
, stage = canvas.getContext('2d')
, stageW = 640
, stageH = 400
, tileW = 16
, tileH = 16

canvas.width = stageW
canvas.height = stageH

// event handlers

document.addEventListener('keydown', ev => {
    if (ev.key === 'a') {
        movePlayer(-1, 0)
    } else if (ev.key === 'd') {
        movePlayer(1, 0)
    } else if (ev.key === 's') {
        movePlayer(0, 1)
    } else if (ev.key === 'w') {
        movePlayer(0, -1)
    }
    update()
})

// helpers

const always = x => () => x
const patch = (obj, update) => Object.assign(obj, update)
const range = (n, v=0) => Array.from({length: n}, always(v))

// data structures

const tiles = {
    FLOOR: 0,
    WALL: 1
}

const TileMap = (width, height) => ({
    width, height,
    tiles: range(width * height, tiles.FLOOR)
})

// state

const state = {
    player: {
        x: 1, y: 1,
        health: 100
    },
    enemies: [
        {x: 16, y: 16, health: 10}
    ],
    map: TileMap(stageW / tileW,
                 stageH / tileH)
}

const getTile = (x, y) =>
      state.map.tiles[y * state.map.width + x]

const setTile = (x, y, tile) => {
    state.map.tiles[y * state.map.width + x] = tile
}

const initMap = () => {
    for (let x = 0; x < state.map.width; x++) {
        setTile(x, 0, tiles.WALL)
        setTile(x, state.map.height - 1, tiles.WALL)
    }
    for (let y = 0; y < state.map.height; y++) {
        setTile(0, y, tiles.WALL)
        setTile(state.map.width - 1, y, tiles.WALL)
    }
    setTile(10, 10, tiles.WALL)
    setTile(10, 11, tiles.WALL)
}

const move = (obj, dx, dy) => patch(obj, {
    x: obj.x + dx, y: obj.y + dy
})

const hurt = (obj, amount) => patch(obj, {
    health: obj.health - amount
})

const movePlayer = (dx, dy) => {
    const {player, enemies} = state
    , newPos = {x: player.x + dx, y: player.y + dy}
    let bump = false

    for (const enemy of enemies) {
        if (newPos.x === enemy.x && newPos.y === enemy.y) {
            hurt(enemy, 5)
            bump = true
        }
    }
    if (getTile(newPos.x, newPos.y) === tiles.WALL) {
        bump = true
    }

    if (!bump) move(state.player, dx, dy)
}

const update = () => {
    patch(state, {
        enemies: state.enemies.filter(e => e.health > 0)
    })
}

// rendering functions

const clr = () => {
    stage.fillStyle = 'black'
    stage.fillRect(0, 0, stageW, stageH)
}

const render = () => {
    clr()
    const {player, enemies, map} = state
    for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
            switch(getTile(x, y)) {
            case tiles.FLOOR:
                stage.fillStyle = 'gray'
                stage.fillRect(x * tileW, y * tileH, tileW, tileH)
                break;
            case tiles.WALL:
                stage.fillStyle = 'blue'
                stage.fillRect(x * tileW, y * tileH, tileW, tileH)
                break;
            }
        }
    }
    stage.fillStyle = 'green'
    stage.fillRect(player.x * tileW, player.y * tileH, tileW, tileH)
    for (const enemy of enemies) {
        stage.fillStyle = 'red'
        stage.fillRect(enemy.x * tileW, enemy.y * tileH, tileW, tileH)
    }
}

const loop = dt => {
    render(dt)
    window.requestAnimationFrame(loop)
}

initMap()
window.requestAnimationFrame(loop)
