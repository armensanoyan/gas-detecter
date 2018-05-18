import { Component, NgZone } from '@angular/core';
import { Platform, ActionSheetController, Events } from 'ionic-angular';
import { AboutPage } from '../about/about'
import { ConnectionProvider } from '../../providers/connection/connection';
import { TextEncoder, TextDecoder } from 'text-encoding-shim';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {

    // concentration = 'A'
    connectToBluetooth
    times = 0

    constructor(
        public connectionProvider: ConnectionProvider,
        public platform: Platform,
        public ngZone: NgZone,
        public actionSheetCtrl: ActionSheetController,
        public events: Events
    ) {}

    ngOnInit() {}

    onClickOpenList() {

        const listOfDevices = this.connectionProvider.listOfDevices()

        listOfDevices.then( devices => {
            this.displayList(devices)
        }, failure => {
            console.log('listOfDevices failed ', failure);
        })
    }
    write() {
        this.connectionProvider.write()
    }

    displayList(devices) {
        const buttons = []
        
        if(typeof devices == 'object') {
            
            devices.forEach(element => {
                
                const button = {
                    text: element.name,
                    role: 'destructive',
                    handler: () => {
                        const connectingToDevice = this.connectionProvider.onDevicesClick(element.id)

                        connectingToDevice.subscribe((success) => {
                            this.ngZone.run(() => {
                                this.connectToBluetooth = 'the connection is established'
                                const rowResult = this.connectionProvider.subscribeForRowData()
                                this.times++
                                this.reciveDate(rowResult, this.times)
                            })
            
                        }, (failure) => {
                            console.log('failt to connect', failure)
                            this.ngZone.run(() => {
                                this.connectToBluetooth = `sorry couldn't connect to device`
                            })
                        })
                    }
                }
                buttons.push(button)
            });
            buttons.push({
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }}
                )
            let actionSheet = this.actionSheetCtrl.create({
                title: 'Devices',
                buttons: buttons
            });
            actionSheet.present();
        }
    }

    reciveDate(subscribeForData, times) {
        
        console.log('success -> ', subscribeForData);

        
        subscribeForData.subscribe(data => {
            console.log('data', data);

            const intBuffer = new Uint8Array(data) 

            console.log('intBuffer -> ', intBuffer, 'type ->', typeof intBuffer);
            
            console.log('first element intBuffer ->', intBuffer[0]);
            
            this.createUser(intBuffer[0])

            this.ngZone.run(() => {
                        this.times = intBuffer[0]
            })
        })
    }
    createUser(value) {
        this.events.publish('value', value);
    }

}
