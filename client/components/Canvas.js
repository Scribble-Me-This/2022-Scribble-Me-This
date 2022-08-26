import React from 'react';

const Canvas = () => {
    const height = 280;
    const width = 280;
    let context;

    window.addEventListener("load", () => {

        const canvas = document.querySelector('#canvas');
        context = canvas.getContext("2d");
        canvas.height = height;
        canvas.width = width;
        let drawing = false;
        const rect = canvas.getBoundingClientRect();

        function startDraw(e) {
            drawing = true;
            draw(e);
        }
        function stopDraw() {
            drawing = false;
            context.beginPath();
        }

        function draw(e) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if (!drawing) return;
            context.lineWidth = 10;
            context.lineCap = "round";
            context.lineTo(x, y);
            context.stroke();
            context.beginPath();
            context.moveTo(x, y);
        }

        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mousemove', draw)

    })

    return (
        <div>
            <canvas id="canvas" height="280" width="280" />
            <button onClick={() => {
                clearCanvas(context)
            }}>clear</button>
        </div>
    )
}

function clearCanvas(context) {
    for (let i = 0; i < 280; i++) {
        for (let j = 0; j < 280; j++) {
            drawPixel("white", context, i, j, 1);
        }
    }
}

function drawPixel(color, context, x, y, size) {
    context.fillStyle = color;
    context.fillRect(x, y, size, size);
}

export default Canvas