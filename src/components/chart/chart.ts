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
        public events: Events
    ) {}

    ngOnInit() {

        this.events.subscribe('value', value => {
            this.react(value)
            this.value = value
            // user and time are the same arguments passed in `events.publish(user, time)`
            console.log('Welcome', value, typeof value);
          });
    
        console.log('concentration  ', this.concentration);
 
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: ["6 s", "5 s", "4 s", "3 s", "ծիծիկ", "1 s", "now"],
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
                        data: [0, 0, 0, 0, 0, 0, 0],
                        spanGaps: false,
                    }
                ]
            }
        });

        const listenToData = this.connectionProvider.subscribeForData()
        listenToData.subscribe(success => {
            this.concentration = success

            console.log('listenToData', this.concentration);

            this.connectionProvider.write(success)

        }, failure => {
            console.log('listenToData failure', failure);
        })
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

        console.log('react from chart  ', this.lineChart.data.datasets[0].data);
    }
}
