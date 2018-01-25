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

const patch = (obj, update) => Object.assign(obj, update)

// state

const state = {
    player: {
        x: 0, y: 0,
        health: 100
    },
    enemies: [
        {x: 16, y: 16, health: 10}
    ]
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
    const {player, enemies} = state
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

window.requestAnimationFrame(loop)
