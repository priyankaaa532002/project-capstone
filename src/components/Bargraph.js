import React, { useEffect } from 'react';

const Hello = () => {
    useEffect(() => {
        // Get the canvas element and its context
        const canvas = document.getElementById('lineChart');
        const ctx = canvas.getContext('2d');

        // Sample data for the line chart
        const data = [10, 20, 15, 25, 30, 35, 40];

        // Calculate the width and height of each bar
        const barWidth = canvas.width / data.length;
        const maxBarHeight = canvas.height;

        // Draw the line chart
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - data[0]);

        for (let i = 1; i < data.length; i++) {
            const x = i * barWidth;
            const y = canvas.height - data[i];
            ctx.lineTo(x, y);
        }

        ctx.strokeStyle = 'blue';
        ctx.stroke();
    }, []); // Run once on component mount

    return (
        <canvas id="lineChart" width="400" height="300"></canvas>
    );
};

export default Hello;
