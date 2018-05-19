import { Component, NgZone } from '@angular/core';
import { Platform, ActionSheetController, Events } from 'ionic-angular';
import { ConnectionProvider } from '../../providers/connection/connection';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {

    connectToBluetooth = 'not connected'

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
                                this.connectToBluetooth = 'Connected'
                                const rowResult = this.connectionProvider.subscribeForRowData()
                                this.reciveDate(rowResult)
                            })
            
                        }, (failure) => {
                            console.log('failt to connect', failure)
                            this.ngZone.run(() => {
                                this.connectToBluetooth = "Couldn't connect"
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

    reciveDate(subscribeForData) {
        subscribeForData.subscribe(data => {

            const intBuffer = new Uint8Array(data) 

            this.createUser(intBuffer[0])
        })
    }
    createUser(value) {
        this.events.publish('value', value);
    }
}
