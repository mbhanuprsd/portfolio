import { useEffect, useRef } from 'react';

const GRID_ROWS = 18;
const GRID_LANES = 20;
const TRAIL_LIFETIME = 18000;
const CYCLE_TRAVEL_TIME = 24000;

function getGridPoint(row, lane, width, horizon, floorHeight) {
    const depth = row / GRID_ROWS;
    const perspective = depth * depth;
    return {
        x: width / 2 + lane * (width / GRID_LANES) * depth,
        y: horizon + perspective * floorHeight,
        depth
    };
}

function createCycle(color, trailColor, lane, progressOffset) {
    return {
        color,
        trailColor,
        lane,
        progressOffset,
        previousProgress: 0,
        direction: { x: 1, y: 0 },
        trail: [],
        lastTrailTime: 0
    };
}

function drawCycle(context, cycle, point, size) {
    const { x: directionX, y: directionY } = cycle.direction;
    const rearX = point.x - directionX * size * 1.35;
    const rearY = point.y - directionY * size * 1.35;
    const frontX = point.x + directionX * size * 1.35;
    const frontY = point.y + directionY * size * 1.35;

    context.save();
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.shadowColor = cycle.color;
    context.shadowBlur = size * 1.5;
    context.strokeStyle = cycle.color;
    context.lineWidth = Math.max(1.5, size * 0.28);

    [rearX, frontX].forEach((wheelX, index) => {
        const wheelY = index === 0 ? rearY : frontY;
        context.beginPath();
        context.arc(wheelX, wheelY, size * 0.64, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = 'rgba(230, 237, 243, 0.74)';
        context.lineWidth = Math.max(0.8, size * 0.1);
        context.beginPath();
        context.arc(wheelX, wheelY, size * 0.38, 0, Math.PI * 2);
        context.stroke();
        context.strokeStyle = cycle.color;
        context.lineWidth = Math.max(1.5, size * 0.28);
    });

    const bodyX = point.x - directionX * size * 0.25;
    const bodyY = point.y - directionY * size * 0.25;
    const sideX = -directionY * size * 0.48;
    const sideY = directionX * size * 0.48;

    context.lineWidth = Math.max(1.8, size * 0.32);
    context.beginPath();
    context.moveTo(rearX, rearY);
    context.lineTo(bodyX + sideX, bodyY + sideY);
    context.lineTo(frontX, frontY);
    context.lineTo(bodyX - sideX, bodyY - sideY);
    context.lineTo(rearX, rearY);
    context.stroke();

    context.fillStyle = cycle.color;
    context.beginPath();
    context.arc(
        point.x + directionX * size * 0.08,
        point.y + directionY * size * 0.08,
        size * 0.3,
        0,
        Math.PI * 2
    );
    context.fill();
    context.restore();
}

function NeonRays() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');
        if (!canvas || !context) return undefined;

        const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
        let frameId;
        let width = 0;
        let height = 0;
        let pixelRatio = 1;
        let animationStartTime;
        let previousTime = 0;
        let lastFrameTime = 0;
        let gridOffset = 0;
        const cycles = [
            createCycle('#4cc9f0', '76, 201, 240', -2.5, 0.08),
            createCycle('#f72585', '247, 37, 133', 2.5, 0.56)
        ];

        const resizeCanvas = () => {
            pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * pixelRatio);
            canvas.height = Math.round(height * pixelRatio);
            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        };

        const drawGrid = (horizon, floorHeight, offset) => {
            const center = width / 2;
            const floor = context.createLinearGradient(0, horizon, 0, height);
            floor.addColorStop(0, 'rgba(76, 201, 240, 0.015)');
            floor.addColorStop(0.55, 'rgba(76, 201, 240, 0.055)');
            floor.addColorStop(1, 'rgba(76, 201, 240, 0.11)');
            context.fillStyle = floor;
            context.beginPath();
            context.moveTo(center, horizon);
            context.lineTo(width, height);
            context.lineTo(0, height);
            context.closePath();
            context.fill();

            for (let row = 0; row < GRID_ROWS; row += 1) {
                const gridRow = row - offset;
                const nextGridRow = gridRow + 1;
                if (nextGridRow <= 0) continue;
                for (let lane = -GRID_LANES / 2; lane < GRID_LANES / 2; lane += 1) {
                    const topLeft = getGridPoint(gridRow, lane, width, horizon, floorHeight);
                    const topRight = getGridPoint(gridRow, lane + 1, width, horizon, floorHeight);
                    const bottomLeft = getGridPoint(nextGridRow, lane, width, horizon, floorHeight);
                    const bottomRight = getGridPoint(nextGridRow, lane + 1, width, horizon, floorHeight);
                    const tileTint = (row + lane) % 2 === 0
                        ? '76, 201, 240'
                        : '247, 37, 133';
                    context.fillStyle = `rgba(${tileTint}, ${0.008 + bottomLeft.depth * 0.016})`;
                    context.beginPath();
                    context.moveTo(topLeft.x, topLeft.y);
                    context.lineTo(topRight.x, topRight.y);
                    context.lineTo(bottomRight.x, bottomRight.y);
                    context.lineTo(bottomLeft.x, bottomLeft.y);
                    context.closePath();
                    context.fill();
                }
            }

            for (let lane = -GRID_LANES / 2; lane <= GRID_LANES / 2; lane += 1) {
                const majorLane = lane % 5 === 0;
                context.beginPath();
                context.moveTo(center, horizon);
                context.lineTo(center + lane * (width / GRID_LANES), height);
                context.strokeStyle = majorLane
                    ? 'rgba(76, 201, 240, 0.52)'
                    : 'rgba(76, 201, 240, 0.27)';
                context.lineWidth = majorLane ? 1.5 : 0.9;
                context.stroke();
            }

            for (let row = 1; row <= GRID_ROWS + 1; row += 1) {
                const gridRow = row - offset;
                if (gridRow <= 0 || gridRow > GRID_ROWS) continue;
                const point = getGridPoint(gridRow, 0, width, horizon, floorHeight);
                const majorRow = row % 3 === 0;
                const halfSpan = (width / 2) * (gridRow / GRID_ROWS);
                context.beginPath();
                context.moveTo(center - halfSpan, point.y);
                context.lineTo(center + halfSpan, point.y);
                context.strokeStyle = majorRow
                    ? `rgba(126, 216, 247, ${0.42 + point.depth * 0.22})`
                    : `rgba(76, 201, 240, ${0.24 + point.depth * 0.15})`;
                context.lineWidth = majorRow ? 1.4 : 0.9;
                context.stroke();

                if (majorRow) {
                    for (let lane = -GRID_LANES / 2; lane <= GRID_LANES / 2; lane += 5) {
                        const node = getGridPoint(gridRow, lane, width, horizon, floorHeight);
                        context.fillStyle = 'rgba(126, 216, 247, 0.7)';
                        context.beginPath();
                        context.arc(node.x, node.y, Math.max(1.2, point.depth * 2.2), 0, Math.PI * 2);
                        context.fill();
                    }
                }
            }
        };

        const updateCycle = (cycle, time, horizon, floorHeight) => {
            const progress = (time / CYCLE_TRAVEL_TIME + cycle.progressOffset) % 1;
            if (progress < cycle.previousProgress) {
                cycle.trail = [];
                cycle.lastTrailTime = 0;
            }
            cycle.previousProgress = progress;

            const row = 2 + progress * (GRID_ROWS - 2);
            const point = getGridPoint(row, cycle.lane, width, horizon, floorHeight);
            const nextPoint = getGridPoint(Math.min(GRID_ROWS, row + 0.1), cycle.lane, width, horizon, floorHeight);
            const vectorX = nextPoint.x - point.x;
            const vectorY = nextPoint.y - point.y;
            const vectorLength = Math.hypot(vectorX, vectorY) || 1;
            cycle.direction = { x: vectorX / vectorLength, y: vectorY / vectorLength };

            if (!cycle.lastTrailTime || time - cycle.lastTrailTime > 32) {
                cycle.trail.push({ ...point, time });
                cycle.lastTrailTime = time;
            }
            cycle.trail = cycle.trail.filter((trailPoint) => time - trailPoint.time < TRAIL_LIFETIME);

            return point;
        };

        const drawTrail = (cycle, time, scale) => {
            if (cycle.trail.length < 2) return;
            context.save();
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.shadowColor = cycle.color;
            context.shadowBlur = 12 * scale;

            for (let index = 1; index < cycle.trail.length; index += 1) {
                const start = cycle.trail[index - 1];
                const end = cycle.trail[index];
                const age = time - end.time;
                const fade = Math.max(0, 1 - age / TRAIL_LIFETIME);
                context.strokeStyle = `rgba(${cycle.trailColor}, ${0.82 * fade})`;
                context.lineWidth = Math.max(1.5, 3.8 * scale * fade);
                context.beginPath();
                context.moveTo(start.x, start.y);
                context.lineTo(end.x, end.y);
                context.stroke();
            }
            context.restore();
        };

        const draw = (time) => {
            if (animationStartTime === undefined) animationStartTime = time;
            if (!motionPreference.matches && time - lastFrameTime < 28) {
                frameId = window.requestAnimationFrame(draw);
                return;
            }

            const elapsed = previousTime ? Math.min(time - previousTime, 40) : 16;
            const animationTime = time - animationStartTime;
            previousTime = time;
            lastFrameTime = time;
            if (!motionPreference.matches) {
                gridOffset = (gridOffset + elapsed * 0.00032) % 1;
            }
            context.clearRect(0, 0, width, height);

            const horizon = height * 0.34;
            const floorHeight = height - horizon;
            const horizonGlow = context.createRadialGradient(width / 2, horizon, 0, width / 2, horizon, width * 0.72);
            horizonGlow.addColorStop(0, 'rgba(76, 201, 240, 0.12)');
            horizonGlow.addColorStop(0.35, 'rgba(114, 9, 183, 0.035)');
            horizonGlow.addColorStop(1, 'rgba(8, 12, 18, 0)');
            context.fillStyle = horizonGlow;
            context.fillRect(0, 0, width, height);

            drawGrid(horizon, floorHeight, gridOffset);

            cycles.forEach((cycle) => {
                const point = updateCycle(cycle, animationTime, horizon, floorHeight);
                drawTrail(cycle, animationTime, 0.6 + point.depth * 0.6);
                drawCycle(context, cycle, point, 2 + point.depth * 4);
            });

            if (!motionPreference.matches) {
                frameId = window.requestAnimationFrame(draw);
            } else {
                previousTime += elapsed;
            }
        };

        const handleResize = () => {
            resizeCanvas();
            if (motionPreference.matches) draw(previousTime);
        };

        resizeCanvas();
        window.addEventListener('resize', handleResize);
        draw(0);
        if (!motionPreference.matches) frameId = window.requestAnimationFrame(draw);

        return () => {
            window.cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="neon-rays" aria-hidden="true" />;
}

export default NeonRays;
