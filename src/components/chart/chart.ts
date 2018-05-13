import { Component, ViewChild,Input } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
    selector: 'chart',
    templateUrl: 'chart.html'
})

export class ChartComponent {
    @Input() concentration
    @ViewChild('lineCanvas') lineCanvas;
 
    lineChart: any;

    constructor() {
  }

    ngOnInit() {
    
        console.log('concentration  ', this.concentration);
        
 
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        spanGaps: false,
                    }
                ]
            }
        });
    }

    react() {
        this.lineChart.data.datasets[0].data.splice(0,1)
        this.lineChart.data.datasets[0].data.push(this.concentration)
        this.lineChart.update()

        console.log('react from chart  ', this.lineChart.data.datasets[0].data);
    }
}
