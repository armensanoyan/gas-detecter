import { Component, ViewChild,Input } from '@angular/core';
import { ConnectionProvider } from '../../providers/connection/connection';
import { Events } from 'ionic-angular';

import { Chart } from 'chart.js';

@Component({
    selector: 'chart',
    templateUrl: 'chart.html'
})

export class ChartComponent {
    @Input() concentration
    @ViewChild('lineCanvas') lineCanvas;
    public value
 
    lineChart: any;

    constructor(
        public connectionProvider: ConnectionProvider,
        public events: Events,
    ) {}

    ngOnInit() {

        this.events.subscribe('value', value => {
            this.react(value)
          });
    
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            
            type: 'line',
            data: {
                labels: ['3.5 s', '3 s', '2.5 s', '2 s', "1.5 s", "1 s", "0.5 s", "now"],
                datasets: [
                    {
                        label: "gas concentration",
                        fill: 'origin',
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
                        data: [0, 0, 0, 0, 0, 0, 0, 0],
                        spanGaps: false,
                    }
                ],
                
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            max: 255,
                            min: 0,
                            maxRotation:5
                        }
                    }]
                }
            }
        });
        console.log('this.lineChart   ', this.lineChart);
    }

    

    react(value='') {
        if (Number(value) > 100) {
            this.lineChart.data.datasets[0].backgroundColor = "rgba(255,0,0)"
            this.lineChart.data.datasets[0].borderColor = "rgba(255,0,0)"
            this.lineChart.data.datasets[0].pointBorderColor = "rgba(255,0,0)"
        }
        else {
            this.lineChart.data.datasets[0].backgroundColor = "rgba(75,192,192,0.4)"
            this.lineChart.data.datasets[0].borderColor = "rgba(75,192,192,1)"
            this.lineChart.data.datasets[0].pointBorderColor = "rgba(75,192,192,1)"
        } 
        
        this.lineChart.data.datasets[0].data.splice(0,1)
        this.lineChart.data.datasets[0].data.push(Number(value))
        this.lineChart.update()
    }
}
