import { Component, NgZone } from '@angular/core';
import { Platform, ActionSheetController, Events } from 'ionic-angular';
import { AboutPage } from '../about/about'
import { ConnectionProvider } from '../../providers/connection/connection';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {

    concentration = 'A'
    connectToBluetooth

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
                                const result = this.connectionProvider.subscribeForData()
                                this.resiveDate(result)
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

    resiveDate(subscribeForData) {
        subscribeForData.subscribe(success => {
            this.concentration = success

            this.createUser(success)

            console.log('subscribeForData', this.concentration);

            this.connectionProvider.write(success)

        }, failure => {
            console.log('subscribeForData failure', failure);
        })
    }

    createUser(value) {
        console.log('Event created!')
        this.events.publish('value', value);
    }

}
